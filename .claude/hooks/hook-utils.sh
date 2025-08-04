#!/bin/bash
# Hook Utilities - Shared functionality for VibeSpec workflow hooks
# Purpose: Common functions for logging, error handling, and performance monitoring
# Execution time: <1s for utility functions
# Platform: Cross-platform (Linux/macOS/WSL)

set -euo pipefail

# Configuration
HOOK_LOG_DIR=".claude/logs"
HOOK_STATE_DIR=".claude/workflow-state"
HOOK_CONFIG_DIR=".claude/config"
HOOK_CACHE_DIR=".claude/cache"

# Ensure required directories exist
create_hook_directories() {
    mkdir -p "$HOOK_LOG_DIR" "$HOOK_STATE_DIR" "$HOOK_CONFIG_DIR" "$HOOK_CACHE_DIR"
}

# Logging functions
log_info() {
    local message="$1"
    local timestamp
    timestamp=$(date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S')
    echo "[${timestamp}] INFO: $message" | tee -a "${HOOK_LOG_DIR}/hooks.log"
}

log_error() {
    local message="$1"
    local timestamp
    timestamp=$(date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S')
    echo "[${timestamp}] ERROR: $message" | tee -a "${HOOK_LOG_DIR}/hooks.log" >&2
}

log_debug() {
    local message="$1"
    if [[ "${HOOK_DEBUG:-false}" == "true" ]]; then
        local timestamp
        timestamp=$(date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S')
        echo "[${timestamp}] DEBUG: $message" >> "${HOOK_LOG_DIR}/hooks-debug.log"
    fi
}

# Performance monitoring
start_timer() {
    echo "$(date +%s)"
}

end_timer() {
    local start_time="$1"
    local end_time
    end_time=$(date +%s)
    echo $((end_time - start_time))
}

log_performance() {
    local hook_name="$1"
    local execution_time="$2"
    local status="$3"
    
    local perf_file="${HOOK_LOG_DIR}/performance.json"
    local timestamp
    timestamp=$(date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S')
    
    # Create performance entry
    local entry="{\"timestamp\":\"$timestamp\",\"hook\":\"$hook_name\",\"execution_time\":$execution_time,\"status\":\"$status\"}"
    
    # Append to performance log
    if [[ -f "$perf_file" ]]; then
        # Read existing content, add new entry
        local temp_file
        temp_file=$(mktemp)
        echo "$entry" >> "$temp_file"
        tail -n 1000 "$perf_file" >> "$temp_file" 2>/dev/null || true
        mv "$temp_file" "$perf_file"
    else
        echo "$entry" > "$perf_file"
    fi
}

# Error handling
handle_hook_failure() {
    local exit_code="$1"
    local hook_name="$2"
    local error_message="${3:-Unknown error}"
    
    log_error "Hook $hook_name failed with exit code $exit_code: $error_message"
    
    # Save failure state
    local failure_file="${HOOK_STATE_DIR}/last-failure.json"
    cat > "$failure_file" << EOF
{
    "hook": "$hook_name",
    "exit_code": $exit_code,
    "error_message": "$error_message",
    "timestamp": "$(date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S')",
    "working_directory": "$(pwd)"
}
EOF
    
    exit "$exit_code"
}

# Platform detection
detect_platform() {
    case "$(uname -s)" in
        Linux*)     echo "linux" ;;
        Darwin*)    echo "macos" ;;
        CYGWIN*|MINGW*|MSYS*) echo "windows" ;;
        *)          echo "unknown" ;;
    esac
}

# Check if running in WSL
is_wsl() {
    [[ -n "${WSL_DISTRO_NAME:-}" ]] || [[ "$(uname -r)" == *microsoft* ]]
}

# Cross-platform file watching capability check
has_file_watcher() {
    command -v inotifywait >/dev/null 2>&1 || \
    command -v fswatch >/dev/null 2>&1 || \
    command -v python3 >/dev/null 2>&1
}

# Git repository validation
ensure_git_repo() {
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_error "Not in a git repository"
        return 1
    fi
    return 0
}

# Workflow state management
save_hook_state() {
    local hook_name="$1"
    local state_data="$2"
    
    local state_file="${HOOK_STATE_DIR}/${hook_name}-state.json"
    echo "$state_data" > "$state_file"
    log_debug "Saved state for $hook_name"
}

load_hook_state() {
    local hook_name="$1"
    local state_file="${HOOK_STATE_DIR}/${hook_name}-state.json"
    
    if [[ -f "$state_file" ]]; then
        cat "$state_file"
    else
        echo "{}"
    fi
}

# Check if hook should run (based on configuration)
should_run_hook() {
    local hook_name="$1"
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    
    if [[ -f "$config_file" ]]; then
        # Use Python to check JSON config (cross-platform)
        python3 -c "
import json, sys
try:
    with open('$config_file') as f:
        config = json.load(f)
    enabled = config.get('hooks', {}).get('$hook_name', {}).get('enabled', True)
    sys.exit(0 if enabled else 1)
except:
    sys.exit(0)  # Default to enabled if config is malformed
" 2>/dev/null
    else
        return 0  # Default to enabled
    fi
}

# Cache management
get_cache_key() {
    local input="$1"
    echo -n "$input" | sha256sum 2>/dev/null | cut -d' ' -f1 || \
    echo -n "$input" | shasum -a 256 2>/dev/null | cut -d' ' -f1 || \
    echo -n "$input" | md5sum 2>/dev/null | cut -d' ' -f1 || \
    echo "no-cache"
}

cache_get() {
    local key="$1"
    local cache_file="${HOOK_CACHE_DIR}/${key}"
    
    if [[ -f "$cache_file" ]]; then
        # Check if cache is still valid (30 minutes)
        local cache_age
        cache_age=$(( $(date +%s) - $(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null || echo 0) ))
        
        if [[ $cache_age -lt 1800 ]]; then
            cat "$cache_file"
            return 0
        else
            rm -f "$cache_file"
        fi
    fi
    return 1
}

cache_set() {
    local key="$1"
    local value="$2"
    local cache_file="${HOOK_CACHE_DIR}/${key}"
    
    echo "$value" > "$cache_file"
}

# Workflow integration
trigger_workflow() {
    local workflow_name="$1"
    shift
    local args="$*"
    
    log_info "Triggering workflow: $workflow_name $args"
    
    # Check if Claude Code is available
    if command -v claude >/dev/null 2>&1; then
        claude -m "/$workflow_name $args" 2>&1 | tee -a "${HOOK_LOG_DIR}/workflow-triggers.log"
        return ${PIPESTATUS[0]}
    else
        log_error "Claude Code not available for workflow trigger"
        return 1
    fi
}

# File change detection
get_staged_files() {
    git diff --cached --name-only 2>/dev/null || echo ""
}

get_modified_files() {
    git diff --name-only 2>/dev/null || echo ""
}

get_file_extensions() {
    local files="$1"
    echo "$files" | sed 's/.*\.//' | sort | uniq | grep -v '^[^.]*$' || true
}

# Naming convention validation
validate_file_naming() {
    local file="$1"
    local basename
    basename=$(basename "$file")
    
    # Check if file uses kebab-case (excluding certain patterns)
    if [[ "$basename" =~ ^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$ ]] || \
       [[ "$basename" =~ ^[A-Z][a-zA-Z0-9]*$ ]] || \
       [[ "$basename" =~ ^(README|LICENSE|CHANGELOG)(\.[a-z]+)?$ ]] || \
       [[ "$basename" =~ ^\.[a-z] ]]; then
        return 0
    else
        return 1
    fi
}

# Initialize hook environment
init_hook_env() {
    create_hook_directories
    
    # Set default configuration if not exists
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    if [[ ! -f "$config_file" ]]; then
        cat > "$config_file" << 'EOF'
{
    "hooks": {
        "pre-commit": {
            "enabled": true,
            "timeout": 120,
            "fail_fast": true
        },
        "post-tool-use": {
            "enabled": true,
            "timeout": 30,
            "batch_size": 10
        },
        "sub-agent-stop": {
            "enabled": true,
            "timeout": 15,
            "save_outputs": true
        },
        "file-watcher": {
            "enabled": true,
            "debounce_ms": 1000,
            "batch_events": true
        }
    },
    "performance": {
        "max_execution_time": 300,
        "enable_caching": true,
        "log_performance": true
    }
}
EOF
    fi
    
    log_debug "Hook environment initialized"
}

# Export functions for use in other scripts
export -f log_info log_error log_debug handle_hook_failure
export -f start_timer end_timer log_performance
export -f detect_platform is_wsl ensure_git_repo
export -f save_hook_state load_hook_state should_run_hook
export -f cache_get cache_set get_cache_key
export -f trigger_workflow get_staged_files get_modified_files
export -f validate_file_naming init_hook_env

# Initialize on source
init_hook_env