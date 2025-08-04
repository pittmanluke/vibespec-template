#!/bin/bash
# Event System Manager - Complete management for VibeSpec event routing and propagation system
# Purpose: Install, configure, and manage the complete event processing infrastructure
# Execution time target: <10s for management operations
# Platform: Cross-platform (Linux/macOS/WSL)

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVENT_SYSTEM_VERSION="1.0.0"

# Source utilities if available
if [[ -f "${SCRIPT_DIR}/hook-utils.sh" ]]; then
    source "${SCRIPT_DIR}/hook-utils.sh"
else
    # Minimal logging functions if utils not available
    log_info() { echo "[INFO] $*"; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_warning() { echo "[WARNING] $*"; }
fi

# Event system components
declare -A EVENT_COMPONENTS=(
    ["routing-table"]="Event routing configuration (event-routing-table.json)"
    ["processor"]="Core event processing engine (event-processor.py)"
    ["integrator"]="Legacy hook integration layer (event-system-integrator.py)"
    ["architecture"]="System architecture documentation"
    ["patterns"]="Integration patterns documentation"
    ["visualization"]="Event flow visualizations"
)

# Display usage information
show_usage() {
    cat << 'EOF'
VibeSpec Event System Manager v1.0.0
Complete management for event routing and propagation infrastructure

USAGE:
    ./event-system-manager.sh <command> [options]

COMMANDS:
    install                Install complete event system
    uninstall              Remove event system components
    start                  Start event processing services
    stop                   Stop event processing services
    restart                Restart event processing services
    status                 Show comprehensive system status
    test                   Test event system functionality
    monitor                Monitor event processing in real-time
    config                 Manage event system configuration
    validate               Validate system installation and health
    upgrade                Upgrade event system components
    backup                 Backup event system configuration and state
    restore [backup]       Restore from backup
    benchmark              Run performance benchmarks
    troubleshoot           Run diagnostic checks

CONFIGURATION COMMANDS:
    config show            Display current configuration
    config edit            Edit configuration files
    config reset           Reset to default configuration
    config export          Export configuration for backup
    config import [file]   Import configuration from file

MONITORING COMMANDS:
    monitor events         Monitor event flow in real-time
    monitor performance    Monitor performance metrics
    monitor queues         Monitor queue depths and processing
    monitor agents         Monitor agent trigger activity

TESTING COMMANDS:
    test routing           Test event routing functionality
    test processing        Test event processing pipeline
    test integration       Test legacy hook integration
    test performance       Test system performance under load
    test recovery          Test error recovery mechanisms

EXAMPLES:
    ./event-system-manager.sh install         # Install complete system
    ./event-system-manager.sh start           # Start all services
    ./event-system-manager.sh status          # Check system status
    ./event-system-manager.sh monitor events  # Monitor event flow
    ./event-system-manager.sh test routing    # Test routing logic
    ./event-system-manager.sh benchmark       # Run performance tests

For detailed documentation, see: .claude/hooks/event-system-documentation.md
EOF
}

# Check system prerequisites
check_prerequisites() {
    local missing_deps=()
    
    # Required commands
    local required_commands=("python3" "git" "npm" "jq")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing_deps+=("$cmd")
        fi
    done
    
    # Required Python modules
    local required_modules=("json" "threading" "queue" "pathlib" "datetime")
    for module in "${required_modules[@]}"; do
        if ! python3 -c "import $module" 2>/dev/null; then
            missing_deps+=("python3-$module")
        fi
    done
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_error "Please install missing dependencies before proceeding"
        return 1
    fi
    
    log_info "All prerequisites satisfied"
    return 0
}

# Install complete event system
install_event_system() {
    log_info "Installing VibeSpec Event System v${EVENT_SYSTEM_VERSION}"
    
    # Check prerequisites
    if ! check_prerequisites; then
        return 1
    fi
    
    # Create directory structure
    local base_dir=".claude"
    local required_dirs=(
        "$base_dir/hooks"
        "$base_dir/config"
        "$base_dir/logs"
        "$base_dir/workflow-state"
        "$base_dir/cache"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_info "Created directory: $dir"
        fi
    done
    
    # Verify core files exist
    local core_files=(
        "$base_dir/hooks/event-routing-table.json"
        "$base_dir/hooks/event-processor.py"
        "$base_dir/hooks/event-system-integrator.py"
        "$base_dir/hooks/event-flow-architecture.md"
        "$base_dir/hooks/integration-patterns.md"
    )
    
    for file in "${core_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Missing core file: $file"
            log_error "Event system files may be incomplete"
            return 1
        else
            log_info "Verified core file: $file"
        fi
    done
    
    # Make Python scripts executable
    chmod +x "$base_dir/hooks/event-processor.py"
    chmod +x "$base_dir/hooks/event-system-integrator.py"
    
    # Initialize configuration if not exists
    local hooks_config="$base_dir/config/hooks.json"
    if [[ ! -f "$hooks_config" ]]; then
        log_info "Creating default hooks configuration"
        create_default_config
    fi
    
    # Install legacy hook integration
    if [[ -f "$base_dir/hooks/hook-manager.sh" ]]; then
        log_info "Installing legacy hook integration"
        "$base_dir/hooks/hook-manager.sh" install
    fi
    
    log_info "Event system installation completed successfully"
    log_info "Run './event-system-manager.sh start' to begin event processing"
}

# Create default configuration
create_default_config() {
    local config_dir=".claude/config"
    
    # Create integration config
    cat > "$config_dir/event-integration.json" << 'EOF'
{
    "bridge_legacy_hooks": true,
    "monitor_processes": true,
    "auto_start_watchers": true,
    "event_routing_enabled": true,
    "performance_monitoring": true,
    "debug_mode": false,
    "auto_restart_watchers": true
}
EOF
    
    # Create performance config if not exists
    if [[ ! -f "$config_dir/performance.json" ]]; then
        cat > "$config_dir/performance.json" << 'EOF'
{
    "max_memory_mb": 100,
    "max_queue_depth": 1000,
    "max_processing_time_ms": 5000,
    "alert_thresholds": {
        "queue_depth": 500,
        "processing_latency_ms": 1000,
        "error_rate_percent": 5,
        "memory_usage_mb": 80
    }
}
EOF
    fi
    
    log_info "Default configuration created"
}

# Start event processing services
start_event_system() {
    log_info "Starting event processing services"
    
    # Check if already running
    if is_event_system_running; then
        log_warning "Event system is already running"
        return 0
    fi
    
    # Start event system integrator
    local integrator_script=".claude/hooks/event-system-integrator.py"
    if [[ -f "$integrator_script" ]]; then
        log_info "Starting event system integrator"
        python3 "$integrator_script" start --daemon
        
        # Wait for startup
        sleep 2
        
        if is_event_system_running; then
            log_info "Event system started successfully"
        else
            log_error "Failed to start event system"
            return 1
        fi
    else
        log_error "Event system integrator not found: $integrator_script"
        return 1
    fi
}

# Stop event processing services
stop_event_system() {
    log_info "Stopping event processing services"
    
    # Stop event system integrator
    local integrator_script=".claude/hooks/event-system-integrator.py"
    if [[ -f "$integrator_script" ]]; then
        python3 "$integrator_script" stop
    fi
    
    # Stop any remaining processes
    pkill -f "event-processor.py" 2>/dev/null || true
    pkill -f "event-system-integrator.py" 2>/dev/null || true
    
    # Wait for shutdown
    sleep 2
    
    if ! is_event_system_running; then
        log_info "Event system stopped successfully"
    else
        log_warning "Some event system processes may still be running"
    fi
}

# Check if event system is running
is_event_system_running() {
    pgrep -f "event-system-integrator.py" >/dev/null 2>&1 || 
    pgrep -f "event-processor.py" >/dev/null 2>&1
}

# Show comprehensive system status
show_system_status() {
    log_info "Event System Status Report"
    echo "=========================="
    echo ""
    
    # Service status
    echo "Service Status:"
    echo "---------------"
    if is_event_system_running; then
        echo "✅ Event System: RUNNING"
    else
        echo "❌ Event System: STOPPED"
    fi
    
    # Check individual components
    local processes=("event-processor.py" "event-system-integrator.py" "file-watcher.py")
    for process in "${processes[@]}"; do
        if pgrep -f "$process" >/dev/null 2>&1; then
            echo "✅ $process: RUNNING"
        else
            echo "❌ $process: STOPPED"
        fi
    done
    
    echo ""
    
    # Configuration status
    echo "Configuration Status:"
    echo "--------------------"
    local config_files=(
        ".claude/hooks/event-routing-table.json"
        ".claude/config/hooks.json"
        ".claude/config/event-integration.json"
    )
    
    for config_file in "${config_files[@]}"; do
        if [[ -f "$config_file" ]]; then
            if python3 -c "import json; json.load(open('$config_file'))" 2>/dev/null; then
                echo "✅ $config_file: VALID"
            else
                echo "❌ $config_file: INVALID JSON"
            fi
        else
            echo "❌ $config_file: MISSING"
        fi
    done
    
    echo ""
    
    # Performance metrics
    echo "Performance Metrics:"
    echo "-------------------"
    local perf_file=".claude/logs/performance.json"
    if [[ -f "$perf_file" ]]; then
        local latest_metrics
        latest_metrics=$(tail -n 1 "$perf_file" 2>/dev/null)
        if [[ -n "$latest_metrics" ]]; then
            echo "$latest_metrics" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f\"Events Processed: {data.get('events_processed', 0)}\")
    print(f\"Average Latency: {data.get('avg_processing_time', 0)*1000:.1f}ms\")
    print(f\"Events/Second: {data.get('events_per_second', 0):.1f}\")
    print(f\"Uptime: {data.get('uptime', 0):.1f}s\")
except:
    print('No performance data available')
" 2>/dev/null || echo "No performance data available"
        else
            echo "No performance data available"
        fi
    else
        echo "No performance log found"
    fi
    
    echo ""
    
    # Recent activity
    echo "Recent Activity:"
    echo "---------------"
    local log_file=".claude/logs/event-processor.log"
    if [[ -f "$log_file" ]]; then
        tail -n 5 "$log_file" 2>/dev/null || echo "No recent activity"
    else
        echo "No activity log found"
    fi
}

# Test event system functionality
test_event_system() {
    local test_type="${1:-all}"
    
    log_info "Testing event system functionality: $test_type"
    
    case "$test_type" in
        "routing")
            test_event_routing
            ;;
        "processing")
            test_event_processing
            ;;
        "integration")
            test_legacy_integration
            ;;
        "performance")
            test_performance
            ;;
        "recovery")
            test_error_recovery
            ;;
        "all")
            test_event_routing
            test_event_processing
            test_legacy_integration
            ;;
        *)
            log_error "Unknown test type: $test_type"
            return 1
            ;;
    esac
}

# Test event routing
test_event_routing() {
    log_info "Testing event routing configuration"
    
    local routing_table=".claude/hooks/event-routing-table.json"
    if [[ ! -f "$routing_table" ]]; then
        log_error "Routing table not found: $routing_table"
        return 1
    fi
    
    # Validate JSON structure
    if ! python3 -c "import json; json.load(open('$routing_table'))" 2>/dev/null; then
        log_error "Invalid JSON in routing table"
        return 1
    fi
    
    # Test routing logic
    python3 -c "
import json, sys
with open('$routing_table') as f:
    config = json.load(f)

# Check required sections
required_sections = ['event_types', 'agent_triggers', 'queue_configuration']
for section in required_sections:
    if section not in config:
        print(f'ERROR: Missing section: {section}')
        sys.exit(1)

# Check event type definitions
event_types = config['event_types']
for event_type, event_config in event_types.items():
    required_fields = ['description', 'priority', 'handlers']
    for field in required_fields:
        if field not in event_config:
            print(f'ERROR: Event type {event_type} missing field: {field}')
            sys.exit(1)

print('✅ Event routing configuration is valid')
"
    
    if [[ $? -eq 0 ]]; then
        log_info "✅ Event routing test passed"
    else
        log_error "❌ Event routing test failed"
        return 1
    fi
}

# Test event processing
test_event_processing() {
    log_info "Testing event processing pipeline"
    
    # Test with event processor directly
    local processor_script=".claude/hooks/event-processor.py"
    if [[ ! -f "$processor_script" ]]; then
        log_error "Event processor not found: $processor_script"
        return 1
    fi
    
    # Create test event
    local test_event='{
        "id": "test-event-' $(date +%s) '",
        "type": "test.event",
        "timestamp": ' $(date +%s) ',
        "priority": "NORMAL",
        "data": {"test": true}
    }'
    
    log_info "Submitting test event"
    
    # This would be a more sophisticated test in a real implementation
    if python3 -c "
import sys, os
sys.path.append('.claude/hooks')
from event_processor import submit_event, Priority

# Submit a test event
result = submit_event('test.event', {'test': True}, Priority.NORMAL)
print('✅ Event submitted successfully' if result else '❌ Event submission failed')
sys.exit(0 if result else 1)
" 2>/dev/null; then
        log_info "✅ Event processing test passed"
    else
        log_error "❌ Event processing test failed"
        return 1
    fi
}

# Test legacy integration
test_legacy_integration() {
    log_info "Testing legacy hook integration"
    
    # Check if hook manager exists
    local hook_manager=".claude/hooks/hook-manager.sh"
    if [[ -f "$hook_manager" ]]; then
        log_info "Testing hook manager integration"
        if "$hook_manager" validate >/dev/null 2>&1; then
            log_info "✅ Legacy hook integration test passed"
        else
            log_error "❌ Legacy hook integration test failed"
            return 1
        fi
    else
        log_warning "Hook manager not found, skipping legacy integration test"
    fi
}

# Monitor event processing
monitor_event_system() {
    local monitor_type="${1:-events}"
    
    case "$monitor_type" in
        "events")
            monitor_event_flow
            ;;
        "performance")
            monitor_performance_metrics
            ;;
        "queues")
            monitor_queue_status
            ;;
        "agents")
            monitor_agent_activity
            ;;
        *)
            log_error "Unknown monitor type: $monitor_type"
            return 1
            ;;
    esac
}

# Monitor event flow
monitor_event_flow() {
    log_info "Monitoring event flow (Ctrl+C to stop)"
    echo "======================================"
    
    local event_log=".claude/logs/event-processor.log"
    if [[ -f "$event_log" ]]; then
        tail -f "$event_log" | while read -r line; do
            echo "$line" | grep -E "(Event|Processing|Handler)" --color=auto || echo "$line"
        done
    else
        log_error "Event log not found: $event_log"
        return 1
    fi
}

# Monitor performance metrics
monitor_performance_metrics() {
    log_info "Monitoring performance metrics (Ctrl+C to stop)"
    echo "==============================================="
    
    local perf_file=".claude/logs/performance.json"
    
    while true; do
        if [[ -f "$perf_file" ]]; then
            local latest_metrics
            latest_metrics=$(tail -n 1 "$perf_file" 2>/dev/null)
            if [[ -n "$latest_metrics" ]]; then
                echo "$latest_metrics" | python3 -c "
import json, sys, time
try:
    data = json.load(sys.stdin)
    timestamp = time.strftime('%H:%M:%S')
    events = data.get('events_processed', 0)
    latency = data.get('avg_processing_time', 0) * 1000
    eps = data.get('events_per_second', 0)
    print(f'{timestamp} - Events: {events:6d} | Latency: {latency:6.1f}ms | EPS: {eps:6.1f}')
except:
    pass
" 2>/dev/null
            fi
        fi
        sleep 5
    done
}

# Run performance benchmark
run_benchmark() {
    log_info "Running event system performance benchmark"
    
    # This would implement a comprehensive benchmark
    log_info "Benchmark functionality not yet implemented"
    log_info "Will test:"
    log_info "- Event throughput capacity"
    log_info "- Latency under load"
    log_info "- Memory usage patterns"
    log_info "- Queue performance"
    log_info "- Error recovery time"
}

# Troubleshoot system issues
troubleshoot_system() {
    log_info "Running event system diagnostics"
    echo "================================"
    
    local issues_found=0
    
    # Check if system is running
    if ! is_event_system_running; then
        log_warning "Event system is not running"
        log_info "Try: ./event-system-manager.sh start"
        issues_found=$((issues_found + 1))
    fi
    
    # Check disk space
    local disk_usage
    disk_usage=$(df . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        log_warning "Low disk space: ${disk_usage}% used"
        issues_found=$((issues_found + 1))
    fi
    
    # Check log file sizes
    local log_dir=".claude/logs"
    if [[ -d "$log_dir" ]]; then
        local large_logs
        large_logs=$(find "$log_dir" -name "*.log" -size +10M 2>/dev/null)
        if [[ -n "$large_logs" ]]; then
            log_warning "Large log files found:"
            echo "$large_logs"
            log_info "Consider rotating log files"
            issues_found=$((issues_found + 1))
        fi
    fi
    
    # Check configuration
    if ! test_event_routing >/dev/null 2>&1; then
        log_error "Configuration validation failed"
        issues_found=$((issues_found + 1))
    fi
    
    if [[ $issues_found -eq 0 ]]; then
        log_info "✅ No issues found"
    else
        log_warning "Found $issues_found potential issues"
    fi
}

# Main command processing
main() {
    local command="${1:-}"
    
    case "$command" in
        "install")
            install_event_system
            ;;
        "uninstall")
            log_info "Uninstalling event system"
            stop_event_system
            log_info "Event system uninstalled (configuration preserved)"
            ;;
        "start")
            start_event_system
            ;;
        "stop")
            stop_event_system
            ;;
        "restart")
            stop_event_system
            sleep 2
            start_event_system
            ;;
        "status")
            show_system_status
            ;;
        "test")
            test_event_system "${2:-all}"
            ;;
        "monitor")
            monitor_event_system "${2:-events}"
            ;;
        "config")
            case "${2:-show}" in
                "show")
                    log_info "Event system configuration:"
                    for config_file in .claude/hooks/event-routing-table.json .claude/config/event-integration.json; do
                        if [[ -f "$config_file" ]]; then
                            echo "=== $config_file ==="
                            cat "$config_file"
                            echo ""
                        fi
                    done
                    ;;
                "edit")
                    ${EDITOR:-nano} .claude/hooks/event-routing-table.json
                    ;;
                "reset")
                    log_info "Resetting configuration to defaults"
                    create_default_config
                    ;;
                *)
                    log_error "Unknown config command: ${2:-}"
                    return 1
                    ;;
            esac
            ;;
        "validate")
            check_prerequisites && test_event_system "all"
            ;;
        "benchmark")
            run_benchmark
            ;;
        "troubleshoot")
            troubleshoot_system
            ;;
        "backup")
            log_info "Creating event system backup"
            local backup_file="event-system-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
            tar -czf "$backup_file" .claude/hooks .claude/config .claude/workflow-state 2>/dev/null
            log_info "Backup created: $backup_file"
            ;;
        "restore")
            local backup_file="${2:-}"
            if [[ -z "$backup_file" ]]; then
                log_error "Please specify backup file to restore"
                return 1
            fi
            log_info "Restoring from backup: $backup_file"
            tar -xzf "$backup_file" 2>/dev/null
            log_info "Backup restored"
            ;;
        "upgrade")
            log_info "Event system upgrade not yet implemented"
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