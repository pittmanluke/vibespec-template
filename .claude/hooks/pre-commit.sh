#!/bin/bash
# Hook: pre-commit
# Purpose: Git pre-commit validation hook that runs /wv (workflow validate) automatically
# Execution time target: <5s (triggers workflow that completes in ~90s)
# Platform: Cross-platform (Linux/macOS/WSL)

set -euo pipefail

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/hook-utils.sh" 2>/dev/null || {
    echo "ERROR: hook-utils.sh not found. Hook infrastructure may be incomplete."
    exit 1
}

# Configuration
HOOK_NAME="pre-commit"
MAX_EXECUTION_TIME=300  # 5 minutes maximum
VALIDATION_CACHE_TTL=1800  # 30 minutes

# Main hook logic
main() {
    local start_time
    start_time=$(start_timer)
    
    log_info "Pre-commit hook started"
    
    # Ensure we're in a git repository
    if ! ensure_git_repo; then
        handle_hook_failure 1 "$HOOK_NAME" "Not in a git repository"
    fi
    
    # Check if hook should run
    if ! should_run_hook "$HOOK_NAME"; then
        log_info "Pre-commit hook disabled in configuration"
        exit 0
    fi
    
    # Get staged files for validation
    local staged_files
    staged_files=$(get_staged_files)
    
    if [[ -z "$staged_files" ]]; then
        log_info "No staged files detected, skipping validation"
        exit 0
    fi
    
    log_info "Staged files detected: $(echo "$staged_files" | wc -l) files"
    log_debug "Files: $staged_files"
    
    # Quick naming convention check before expensive validation
    if ! quick_naming_check "$staged_files"; then
        log_error "Naming convention violations detected. Please fix before committing."
        handle_hook_failure 1 "$HOOK_NAME" "Naming convention violations"
    fi
    
    # Check cache for recent validation
    local cache_key
    cache_key=$(get_cache_key "$staged_files$(git rev-parse HEAD)")
    
    if cache_result=$(cache_get "$cache_key"); then
        log_info "Using cached validation result"
        if [[ "$cache_result" == "PASSED" ]]; then
            log_info "Pre-commit validation passed (cached)"
            log_performance "$HOOK_NAME" $(end_timer "$start_time") "success_cached"
            exit 0
        else
            log_error "Previous validation failed (cached). Please fix issues and try again."
            handle_hook_failure 1 "$HOOK_NAME" "Cached validation failure"
        fi
    fi
    
    # Run workflow validation
    log_info "Running workflow validation (/wv)"
    
    if run_workflow_validation; then
        # Cache successful result
        cache_set "$cache_key" "PASSED"
        log_info "Pre-commit validation completed successfully"
        log_performance "$HOOK_NAME" $(end_timer "$start_time") "success"
        
        # Update hook state
        save_hook_state "$HOOK_NAME" "{
            \"last_success\": \"$(date -Iseconds)\",
            \"files_validated\": $(echo "$staged_files" | wc -l),
            \"validation_result\": \"PASSED\"
        }"
        
        exit 0
    else
        local exit_code=$?
        cache_set "$cache_key" "FAILED"
        log_error "Pre-commit validation failed"
        log_performance "$HOOK_NAME" $(end_timer "$start_time") "failure"
        
        # Show helpful error message
        show_commit_help
        
        handle_hook_failure "$exit_code" "$HOOK_NAME" "Workflow validation failed"
    fi
}

# Quick naming convention check
quick_naming_check() {
    local files="$1"
    local violations=0
    
    log_debug "Performing quick naming convention check"
    
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        
        # Skip deleted files
        if [[ ! -f "$file" ]]; then
            continue
        fi
        
        # Check file naming
        if ! validate_file_naming "$file"; then
            log_error "NAMING VIOLATION: $file (should use kebab-case)"
            violations=$((violations + 1))
        fi
        
        # Check directory naming
        local dir
        dir=$(dirname "$file")
        while [[ "$dir" != "." && "$dir" != "/" ]]; do
            local basename_dir
            basename_dir=$(basename "$dir")
            
            # Skip certain directories
            if [[ "$basename_dir" =~ ^(node_modules|\.git|\.next|dist|build)$ ]]; then
                break
            fi
            
            # Check if directory uses kebab-case (allowing some exceptions)
            if [[ ! "$basename_dir" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] && \
               [[ ! "$basename_dir" =~ ^\..*$ ]] && \
               [[ ! "$basename_dir" =~ ^(src|app|pages|public|components|lib|hooks|types|config|utils)$ ]]; then
                log_error "NAMING VIOLATION: Directory $dir (should use kebab-case)"
                violations=$((violations + 1))
            fi
            
            dir=$(dirname "$dir")
        done
    done <<< "$files"
    
    if [[ $violations -gt 0 ]]; then
        log_error "Found $violations naming convention violations"
        echo ""
        echo "VibeSpec Naming Convention Requirements:"
        echo "- Files: use kebab-case (e.g., user-profile.tsx, auth-service.ts)"
        echo "- Directories: use kebab-case (e.g., user-management/, api-routes/)"
        echo "- Component exports: use PascalCase (e.g., export function UserProfile)"
        echo ""
        echo "Fix these violations and commit again."
        return 1
    fi
    
    return 0
}

# Run workflow validation with timeout
run_workflow_validation() {
    local timeout_cmd=""
    
    # Set up timeout command (platform-specific)
    if command -v timeout >/dev/null 2>&1; then
        timeout_cmd="timeout ${MAX_EXECUTION_TIME}"
    elif command -v gtimeout >/dev/null 2>&1; then
        timeout_cmd="gtimeout ${MAX_EXECUTION_TIME}"
    fi
    
    # Check if Claude Code is available
    if ! command -v claude >/dev/null 2>&1; then
        log_error "Claude Code not found. Please install Claude Code to use workflow validation."
        echo ""
        echo "Alternative: Run validation manually:"
        echo "  npm run build"
        echo "  npm run lint"
        echo ""
        return 1
    fi
    
    # Run workflow validation
    log_info "Executing: claude -m \"/workflow:validate\""
    
    if [[ -n "$timeout_cmd" ]]; then
        $timeout_cmd claude -m "/workflow:validate" 2>&1 | tee "${HOOK_LOG_DIR}/pre-commit-validation.log"
        local result=${PIPESTATUS[1]}
    else
        claude -m "/workflow:validate" 2>&1 | tee "${HOOK_LOG_DIR}/pre-commit-validation.log"
        local result=$?
    fi
    
    return $result
}

# Show helpful error message when validation fails
show_commit_help() {
    echo ""
    echo "=============================================="
    echo "PRE-COMMIT VALIDATION FAILED"
    echo "=============================================="
    echo ""
    echo "Your commit was blocked because validation failed."
    echo "This prevents broken code from entering the repository."
    echo ""
    echo "Common fixes:"
    echo ""
    echo "1. Build Errors:"
    echo "   npm run build"
    echo "   # Fix any TypeScript compilation errors"
    echo ""
    echo "2. Lint Errors:"
    echo "   npm run lint --fix"
    echo "   # Fix any remaining lint errors manually"
    echo ""
    echo "3. Naming Violations:"
    echo "   # Rename files to use kebab-case"
    echo "   # Update directory names to use kebab-case"
    echo ""
    echo "4. Review the full validation log:"
    echo "   cat ${HOOK_LOG_DIR}/pre-commit-validation.log"
    echo ""
    echo "After fixing issues, try committing again:"
    echo "   git add ."
    echo "   git commit"
    echo ""
    echo "To bypass this hook (NOT RECOMMENDED):"
    echo "   git commit --no-verify"
    echo ""
    echo "=============================================="
}

# Handle script termination
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Pre-commit hook interrupted or failed"
    fi
    exit $exit_code
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Validate environment before execution
validate_environment() {
    # Check for required tools
    local missing_tools=()
    
    if ! command -v git >/dev/null 2>&1; then
        missing_tools+=("git")
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        missing_tools+=("npm")
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        echo "Please install the missing tools and try again."
        return 1
    fi
    
    # Check if we're in a Node.js project
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found. This hook requires a Node.js project."
        return 1
    fi
    
    return 0
}

# Install as git hook (utility function)
install_git_hook() {
    local git_hooks_dir=".git/hooks"
    local git_hook_file="${git_hooks_dir}/pre-commit"
    
    if [[ ! -d "$git_hooks_dir" ]]; then
        log_error "Git hooks directory not found. Not in a git repository?"
        return 1
    fi
    
    # Create symlink to this script
    local hook_path
    hook_path=$(realpath "${BASH_SOURCE[0]}")
    
    if [[ -f "$git_hook_file" ]]; then
        log_info "Backing up existing pre-commit hook"
        mv "$git_hook_file" "${git_hook_file}.backup.$(date +%s)"
    fi
    
    ln -sf "$hook_path" "$git_hook_file"
    chmod +x "$git_hook_file"
    
    log_info "Pre-commit hook installed successfully"
    echo "Hook installed at: $git_hook_file"
    echo "To uninstall: rm $git_hook_file"
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Check for installation flag
    if [[ "${1:-}" == "--install" ]]; then
        install_git_hook
        exit 0
    fi
    
    # Validate environment
    if ! validate_environment; then
        exit 1
    fi
    
    # Execute main hook logic
    main "$@"
fi