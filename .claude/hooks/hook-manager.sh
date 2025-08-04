#!/bin/bash
# Hook Manager - Central management for VibeSpec workflow hooks
# Purpose: Install, configure, and manage all workflow automation hooks
# Execution time target: <5s for management operations
# Platform: Cross-platform (Linux/macOS/WSL)

set -euo pipefail

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/hook-utils.sh" 2>/dev/null || {
    echo "ERROR: hook-utils.sh not found. Hook infrastructure may be incomplete."
    exit 1
}

# Configuration
HOOK_MANAGER_VERSION="1.0.0"
HOOKS_DIR="$SCRIPT_DIR"
GIT_HOOKS_DIR=".git/hooks"

# Available hooks
declare -A HOOKS=(
    ["pre-commit"]="Git pre-commit validation hook"
    ["post-tool-use"]="State capture hook for workflow continuity"
    ["sub-agent-stop"]="Agent coordination and handoff management"
    ["file-watcher"]="Real-time file monitoring and violation detection"
)

# Hook files mapping
declare -A HOOK_FILES=(
    ["pre-commit"]="pre-commit.sh"
    ["post-tool-use"]="post-tool-use.py"
    ["sub-agent-stop"]="sub-agent-stop.py"
    ["file-watcher"]="file-watcher.py"
)

# Display usage information
show_usage() {
    cat << 'EOF'
VibeSpec Hook Manager v1.0.0
Central management for workflow automation hooks

USAGE:
    ./hook-manager.sh <command> [options]

COMMANDS:
    install [hook]     Install hooks (all hooks if none specified)
    uninstall [hook]   Uninstall hooks (all hooks if none specified)
    status             Show status of all hooks
    test [hook]        Test hook functionality
    logs [hook]        Show recent logs for hooks
    config             Show/edit hook configuration
    enable [hook]      Enable specific hook
    disable [hook]     Disable specific hook
    reset              Reset all hooks to default configuration
    monitor            Monitor hook performance in real-time
    validate           Validate hook installation and configuration

AVAILABLE HOOKS:
    pre-commit         Git pre-commit validation (/wv integration)
    post-tool-use      State capture for workflow continuity
    sub-agent-stop     Agent coordination and handoffs
    file-watcher       Real-time file monitoring

EXAMPLES:
    ./hook-manager.sh install              # Install all hooks
    ./hook-manager.sh install pre-commit   # Install only pre-commit hook
    ./hook-manager.sh status               # Show status of all hooks
    ./hook-manager.sh test pre-commit      # Test pre-commit hook
    ./hook-manager.sh logs file-watcher    # Show file-watcher logs
    ./hook-manager.sh monitor              # Monitor hooks in real-time

For detailed documentation, see: docs/hook-system-guide.md
EOF
}

# Check if hook exists
hook_exists() {
    local hook_name="$1"
    [[ -n "${HOOKS[$hook_name]:-}" ]]
}

# Get hook file path
get_hook_file() {
    local hook_name="$1"
    echo "${HOOKS_DIR}/${HOOK_FILES[$hook_name]}"
}

# Check if hook is installed
is_hook_installed() {
    local hook_name="$1"
    
    case "$hook_name" in
        "pre-commit")
            [[ -f "${GIT_HOOKS_DIR}/pre-commit" ]]
            ;;
        "post-tool-use"|"sub-agent-stop")
            # These are Claude hooks, check if they're registered
            local hook_file
            hook_file=$(get_hook_file "$hook_name")
            [[ -f "$hook_file" && -x "$hook_file" ]]
            ;;
        "file-watcher")
            local hook_file
            hook_file=$(get_hook_file "$hook_name")
            [[ -f "$hook_file" && -x "$hook_file" ]]
            ;;
        *)
            return 1
            ;;
    esac
}

# Check if hook is enabled
is_hook_enabled() {
    local hook_name="$1"
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    
    if [[ -f "$config_file" ]]; then
        python3 -c "
import json, sys
try:
    with open('$config_file') as f:
        config = json.load(f)
    enabled = config.get('hooks', {}).get('$hook_name', {}).get('enabled', True)
    sys.exit(0 if enabled else 1)
except:
    sys.exit(0)  # Default to enabled
" 2>/dev/null
    else
        return 0  # Default to enabled
    fi
}

# Install a single hook
install_hook() {
    local hook_name="$1"
    
    if ! hook_exists "$hook_name"; then
        log_error "Unknown hook: $hook_name"
        return 1
    fi
    
    local hook_file
    hook_file=$(get_hook_file "$hook_name")
    
    if [[ ! -f "$hook_file" ]]; then
        log_error "Hook file not found: $hook_file"
        return 1
    fi
    
    log_info "Installing $hook_name hook..."
    
    case "$hook_name" in
        "pre-commit")
            install_git_hook "$hook_name" "$hook_file"
            ;;
        "post-tool-use"|"sub-agent-stop")
            install_claude_hook "$hook_name" "$hook_file"
            ;;
        "file-watcher")
            install_file_watcher "$hook_file"
            ;;
    esac
    
    # Make sure hook file is executable
    chmod +x "$hook_file"
    
    log_info "Successfully installed $hook_name hook"
}

# Install git hook
install_git_hook() {
    local hook_name="$1"
    local hook_file="$2"
    
    if [[ ! -d "$GIT_HOOKS_DIR" ]]; then
        log_error "Git hooks directory not found. Not in a git repository?"
        return 1
    fi
    
    local git_hook_file="${GIT_HOOKS_DIR}/${hook_name}"
    
    # Backup existing hook if present
    if [[ -f "$git_hook_file" ]]; then
        local backup_file="${git_hook_file}.backup.$(date +%s)"
        log_info "Backing up existing $hook_name hook to $backup_file"
        mv "$git_hook_file" "$backup_file"
    fi
    
    # Create symlink to our hook
    local abs_hook_file
    abs_hook_file=$(realpath "$hook_file")
    ln -sf "$abs_hook_file" "$git_hook_file"
    chmod +x "$git_hook_file"
    
    log_info "Git $hook_name hook installed: $git_hook_file -> $abs_hook_file"
}

# Install Claude hook (register in Claude configuration)
install_claude_hook() {
    local hook_name="$1"
    local hook_file="$2"
    
    # Claude hooks are registered via their presence in the hooks directory
    # and configuration in hooks.json
    
    local claude_config="${HOOK_CONFIG_DIR}/claude-hooks.json"
    
    # Create or update Claude hooks configuration
    if [[ ! -f "$claude_config" ]]; then
        cat > "$claude_config" << EOF
{
    "hooks": {
        "${hook_name}": {
            "enabled": true,
            "script": "${hook_file}",
            "timeout": 30
        }
    }
}
EOF
    else
        # Update existing configuration
        python3 -c "
import json
try:
    with open('$claude_config') as f:
        config = json.load(f)
    
    if 'hooks' not in config:
        config['hooks'] = {}
    
    config['hooks']['$hook_name'] = {
        'enabled': True,
        'script': '$hook_file',
        'timeout': 30
    }
    
    with open('$claude_config', 'w') as f:
        json.dump(config, f, indent=2)
except Exception as e:
    print(f'Error updating config: {e}')
    exit(1)
"
    fi
    
    log_info "Claude $hook_name hook registered in $claude_config"
}

# Install file watcher
install_file_watcher() {
    local hook_file="$1"
    
    # File watcher can be run standalone or as a service
    log_info "File watcher installed at $hook_file"
    log_info "To start file watcher:"
    log_info "  Background: $hook_file &"
    log_info "  Daemon: $hook_file --daemon"
    log_info "  One-time scan: $hook_file --scan"
    
    # Create systemd service if on Linux
    if [[ "$(detect_platform)" == "linux" ]] && command -v systemctl >/dev/null 2>&1; then
        log_info "To install as systemd service: $hook_file --install-service"
    fi
}

# Uninstall a single hook
uninstall_hook() {
    local hook_name="$1"
    
    if ! hook_exists "$hook_name"; then
        log_error "Unknown hook: $hook_name"
        return 1
    fi
    
    log_info "Uninstalling $hook_name hook..."
    
    case "$hook_name" in
        "pre-commit")
            local git_hook_file="${GIT_HOOKS_DIR}/${hook_name}"
            if [[ -f "$git_hook_file" ]]; then
                rm -f "$git_hook_file"
                log_info "Removed git $hook_name hook"
            fi
            ;;
        "post-tool-use"|"sub-agent-stop")
            local claude_config="${HOOK_CONFIG_DIR}/claude-hooks.json"
            if [[ -f "$claude_config" ]]; then
                python3 -c "
import json
try:
    with open('$claude_config') as f:
        config = json.load(f)
    
    if 'hooks' in config and '$hook_name' in config['hooks']:
        del config['hooks']['$hook_name']
        
        with open('$claude_config', 'w') as f:
            json.dump(config, f, indent=2)
        print('Removed $hook_name from Claude hooks configuration')
except Exception as e:
    print(f'Error updating config: {e}')
"
            fi
            ;;
        "file-watcher")
            # Stop file watcher if running
            pkill -f "file-watcher.py" 2>/dev/null || true
            log_info "Stopped file watcher processes"
            ;;
    esac
    
    log_info "Successfully uninstalled $hook_name hook"
}

# Show status of all hooks
show_status() {
    log_info "VibeSpec Hook Status"
    echo "=================="
    echo ""
    
    for hook_name in "${!HOOKS[@]}"; do
        local status="❌ Not Installed"
        local enabled_status=""
        
        if is_hook_installed "$hook_name"; then
            if is_hook_enabled "$hook_name"; then
                status="✅ Installed & Enabled"
                enabled_status="enabled"
            else
                status="⚠️  Installed but Disabled"
                enabled_status="disabled"
            fi
        fi
        
        printf "%-15s %s\n" "$hook_name:" "$status"
        printf "%-15s %s\n" "" "${HOOKS[$hook_name]}"
        
        # Show additional info for specific hooks
        case "$hook_name" in
            "pre-commit")
                if [[ -f "${GIT_HOOKS_DIR}/pre-commit" ]]; then
                    local target
                    target=$(readlink "${GIT_HOOKS_DIR}/pre-commit" 2>/dev/null || echo "not a symlink")
                    printf "%-15s Git hook: %s\n" "" "$target"
                fi
                ;;
            "file-watcher")
                if pgrep -f "file-watcher.py" >/dev/null 2>&1; then
                    printf "%-15s Process: Running\n" ""
                else
                    printf "%-15s Process: Stopped\n" ""
                fi
                ;;
        esac
        
        echo ""
    done
    
    # Show recent activity
    local recent_logs
    recent_logs=$(tail -n 5 "${HOOK_LOG_DIR}/hooks.log" 2>/dev/null || echo "No recent logs")
    echo "Recent Activity:"
    echo "==============="
    echo "$recent_logs"
}

# Test a hook
test_hook() {
    local hook_name="$1"
    
    if ! hook_exists "$hook_name"; then
        log_error "Unknown hook: $hook_name"
        return 1
    fi
    
    if ! is_hook_installed "$hook_name"; then
        log_error "Hook $hook_name is not installed"
        return 1
    fi
    
    log_info "Testing $hook_name hook..."
    
    case "$hook_name" in
        "pre-commit")
            # Test pre-commit hook with dry run
            local hook_file
            hook_file=$(get_hook_file "$hook_name")
            
            # Create a test staged file
            echo "# Test file" > test-hook-file.md
            git add test-hook-file.md
            
            log_info "Running pre-commit hook test..."
            if "$hook_file"; then
                log_info "✅ Pre-commit hook test passed"
            else
                log_error "❌ Pre-commit hook test failed"
            fi
            
            # Clean up
            git reset HEAD test-hook-file.md
            rm -f test-hook-file.md
            ;;
        "post-tool-use"|"sub-agent-stop")
            # Test Claude hooks with mock data
            local hook_file
            hook_file=$(get_hook_file "$hook_name")
            
            local test_data='{"tool_name":"test","final_message":"Test message from hook test"}'
            
            log_info "Testing $hook_name with mock data..."
            if echo "$test_data" | python3 "$hook_file"; then
                log_info "✅ $hook_name test passed"
            else
                log_error "❌ $hook_name test failed"
            fi
            ;;
        "file-watcher")
            # Test file watcher with scan
            local hook_file
            hook_file=$(get_hook_file "$hook_name")
            
            log_info "Running file watcher scan test..."
            if python3 "$hook_file" --scan >/dev/null; then
                log_info "✅ File watcher test passed"
            else
                log_error "❌ File watcher test failed"
            fi
            ;;
    esac
}

# Show logs for a hook
show_logs() {
    local hook_name="${1:-all}"
    local lines="${2:-50}"
    
    if [[ "$hook_name" == "all" ]]; then
        log_info "Recent hook logs (last $lines lines):"
        echo "========================="
        tail -n "$lines" "${HOOK_LOG_DIR}/hooks.log" 2>/dev/null || echo "No logs found"
    else
        if ! hook_exists "$hook_name"; then
            log_error "Unknown hook: $hook_name"
            return 1
        fi
        
        log_info "Recent logs for $hook_name (last $lines lines):"
        echo "================================"
        
        # Show hook-specific logs
        case "$hook_name" in
            "pre-commit")
                if [[ -f "${HOOK_LOG_DIR}/pre-commit-validation.log" ]]; then
                    tail -n "$lines" "${HOOK_LOG_DIR}/pre-commit-validation.log"
                else
                    echo "No pre-commit logs found"
                fi
                ;;
            *)
                # Show general logs filtered for this hook
                grep "$hook_name" "${HOOK_LOG_DIR}/hooks.log" 2>/dev/null | tail -n "$lines" || echo "No logs found for $hook_name"
                ;;
        esac
    fi
}

# Show/edit configuration
manage_config() {
    local action="${1:-show}"
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    
    case "$action" in
        "show")
            log_info "Current hook configuration:"
            if [[ -f "$config_file" ]]; then
                cat "$config_file"
            else
                echo "No configuration file found. Run 'install' to create default configuration."
            fi
            ;;
        "edit")
            if command -v "${EDITOR:-nano}" >/dev/null 2>&1; then
                "${EDITOR:-nano}" "$config_file"
            else
                log_error "No editor found. Set EDITOR environment variable or install nano."
            fi
            ;;
        "reset")
            log_info "Resetting hook configuration to defaults..."
            rm -f "$config_file"
            init_hook_env  # This will recreate default config
            log_info "Configuration reset to defaults"
            ;;
    esac
}

# Enable/disable a hook
toggle_hook() {
    local hook_name="$1"
    local action="$2"  # enable or disable
    
    if ! hook_exists "$hook_name"; then
        log_error "Unknown hook: $hook_name"
        return 1
    fi
    
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    local enabled_value
    
    if [[ "$action" == "enable" ]]; then
        enabled_value="true"
    else
        enabled_value="false"
    fi
    
    # Update configuration
    python3 -c "
import json
try:
    config = {}
    if os.path.exists('$config_file'):
        with open('$config_file') as f:
            config = json.load(f)
    
    if 'hooks' not in config:
        config['hooks'] = {}
    
    if '$hook_name' not in config['hooks']:
        config['hooks']['$hook_name'] = {}
    
    config['hooks']['$hook_name']['enabled'] = $enabled_value
    
    with open('$config_file', 'w') as f:
        json.dump(config, f, indent=2)
    
    print('Hook $hook_name ${action}d successfully')
except Exception as e:
    print(f'Error updating config: {e}')
    exit(1)
" 2>/dev/null
    
    log_info "Hook $hook_name ${action}d"
}

# Monitor hook performance
monitor_hooks() {
    log_info "Monitoring hook performance (Ctrl+C to stop)..."
    echo "============================================"
    
    local perf_file="${HOOK_LOG_DIR}/performance.json"
    
    # Show recent performance data
    if [[ -f "$perf_file" ]]; then
        echo "Recent Performance Data:"
        echo "======================="
        tail -n 10 "$perf_file" | while read -r line; do
            if [[ -n "$line" ]]; then
                echo "$line" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f\"{data['timestamp'][:19]} - {data['hook']:15} - {data.get('execution_time', 0):6.2f}s - {data['status']}\")
except:
    pass
"
            fi
        done
        echo ""
    fi
    
    # Monitor new entries
    echo "Live Performance Monitoring:"
    echo "=========================="
    
    if command -v tail >/dev/null 2>&1; then
        tail -f "$perf_file" 2>/dev/null | while read -r line; do
            if [[ -n "$line" ]]; then
                echo "$line" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    status_icon = '✅' if data['status'] == 'success' else '❌'
    exec_time = data.get('execution_time', 0)
    time_color = '' if exec_time < 5 else '⚠️ '
    print(f\"{status_icon} {data['timestamp'][:19]} - {data['hook']:15} - {time_color}{exec_time:6.2f}s\")
except:
    pass
"
            fi
        done
    else
        log_error "tail command not available for live monitoring"
    fi
}

# Validate hook installation
validate_installation() {
    log_info "Validating hook installation..."
    echo "============================="
    
    local validation_errors=0
    
    # Check if we're in a git repository
    if ! ensure_git_repo; then
        log_error "Not in a git repository"
        validation_errors=$((validation_errors + 1))
    else
        log_info "✅ Git repository detected"
    fi
    
    # Check required directories
    for dir in "$HOOK_LOG_DIR" "$HOOK_STATE_DIR" "$HOOK_CONFIG_DIR" "$HOOK_CACHE_DIR"; do
        if [[ -d "$dir" ]]; then
            log_info "✅ Directory exists: $dir"
        else
            log_error "❌ Missing directory: $dir"
            validation_errors=$((validation_errors + 1))
        fi
    done
    
    # Check hook files
    for hook_name in "${!HOOKS[@]}"; do
        local hook_file
        hook_file=$(get_hook_file "$hook_name")
        
        if [[ -f "$hook_file" ]]; then
            if [[ -x "$hook_file" ]]; then
                log_info "✅ Hook file executable: $hook_file"
            else
                log_error "❌ Hook file not executable: $hook_file"
                validation_errors=$((validation_errors + 1))
            fi
        else
            log_error "❌ Missing hook file: $hook_file"
            validation_errors=$((validation_errors + 1))
        fi
    done
    
    # Check dependencies
    local required_commands=("python3" "git" "npm")
    for cmd in "${required_commands[@]}"; do
        if command -v "$cmd" >/dev/null 2>&1; then
            log_info "✅ Command available: $cmd"
        else
            log_error "❌ Missing required command: $cmd"
            validation_errors=$((validation_errors + 1))
        fi
    done
    
    # Check configuration
    local config_file="${HOOK_CONFIG_DIR}/hooks.json"
    if [[ -f "$config_file" ]]; then
        if python3 -c "import json; json.load(open('$config_file'))" 2>/dev/null; then
            log_info "✅ Configuration file valid: $config_file"
        else
            log_error "❌ Invalid configuration file: $config_file"
            validation_errors=$((validation_errors + 1))
        fi
    else
        log_error "❌ Missing configuration file: $config_file"
        validation_errors=$((validation_errors + 1))
    fi
    
    echo ""
    if [[ $validation_errors -eq 0 ]]; then
        log_info "✅ All validations passed!"
        return 0
    else
        log_error "❌ $validation_errors validation errors found"
        return 1
    fi
}

# Main command processing
main() {
    local command="${1:-}"
    
    case "$command" in
        "install")
            local hook_name="${2:-all}"
            if [[ "$hook_name" == "all" ]]; then
                for hook in "${!HOOKS[@]}"; do
                    install_hook "$hook"
                done
            else
                install_hook "$hook_name"
            fi
            ;;
        "uninstall")
            local hook_name="${2:-all}"
            if [[ "$hook_name" == "all" ]]; then
                for hook in "${!HOOKS[@]}"; do
                    uninstall_hook "$hook"
                done
            else
                uninstall_hook "$hook_name"
            fi
            ;;
        "status")
            show_status
            ;;
        "test")
            local hook_name="${2:-}"
            if [[ -z "$hook_name" ]]; then
                log_error "Please specify a hook to test"
                return 1
            fi
            test_hook "$hook_name"
            ;;
        "logs")
            show_logs "${2:-all}" "${3:-50}"
            ;;
        "config")
            manage_config "${2:-show}"
            ;;
        "enable")
            local hook_name="${2:-}"
            if [[ -z "$hook_name" ]]; then
                log_error "Please specify a hook to enable"
                return 1
            fi
            toggle_hook "$hook_name" "enable"
            ;;
        "disable")
            local hook_name="${2:-}"
            if [[ -z "$hook_name" ]]; then
                log_error "Please specify a hook to disable"
                return 1
            fi
            toggle_hook "$hook_name" "disable"
            ;;
        "reset")
            manage_config "reset"
            ;;
        "monitor")
            monitor_hooks
            ;;
        "validate")
            validate_installation
            ;;
        "help"|"--help"|"-h")
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            echo ""
            show_usage
            return 1
            ;;
    esac
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi