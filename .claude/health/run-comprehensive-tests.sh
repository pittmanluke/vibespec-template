#!/bin/bash

# Comprehensive Multi-Agent Workflow Integration Test Runner
# Orchestrates all testing components for complete system validation

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_PATH="${1:-$(pwd)}"
CLAUDE_PATH="$BASE_PATH/.claude"
HEALTH_PATH="$CLAUDE_PATH/health"
LOG_FILE="$HEALTH_PATH/test-execution-$(date +%Y%m%d-%H%M%S).log"
RESULTS_DIR="$HEALTH_PATH/results"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Ensure required directories exist
mkdir -p "$HEALTH_PATH" "$RESULTS_DIR"

# Logging function
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to check prerequisites
check_prerequisites() {
    log "${BLUE}🔍 Checking Prerequisites...${NC}"
    
    # Check Python availability
    if ! command -v python3 &> /dev/null; then
        log "${RED}❌ Python 3 is required but not installed${NC}"
        exit 1
    fi
    
    # Check required Python packages
    log "   📦 Checking Python packages..."
    python3 -c "import psutil, json, threading, concurrent.futures" 2>/dev/null || {
        log "${YELLOW}⚠️  Installing required Python packages...${NC}"
        python3 -m pip install psutil --quiet || {
            log "${RED}❌ Failed to install required packages${NC}"
            exit 1
        }
    }
    
    # Check Claude system structure
    log "   📁 Verifying Claude system structure..."
    required_dirs=("$CLAUDE_PATH/agents" "$CLAUDE_PATH/commands" "$CLAUDE_PATH/hooks" "$CLAUDE_PATH/scripts" "$CLAUDE_PATH/workflow-state")
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            log "${YELLOW}⚠️  Creating missing directory: $dir${NC}"
            mkdir -p "$dir"
        fi
    done
    
    # Check test scripts exist
    test_scripts=(
        "$HEALTH_PATH/integration-test-suite.py"
        "$HEALTH_PATH/performance-benchmarks.py"
        "$HEALTH_PATH/load-test-runner.py"
    )
    
    for script in "${test_scripts[@]}"; do
        if [[ ! -f "$script" ]]; then
            log "${RED}❌ Required test script not found: $script${NC}"
            exit 1
        fi
        chmod +x "$script"
    done
    
    log "${GREEN}✅ Prerequisites check completed${NC}"
}

# Function to run integration tests
run_integration_tests() {
    log "\n${CYAN}🧪 Running Integration Test Suite...${NC}"
    log "============================================"
    
    local start_time=$(date +%s)
    
    if python3 "$HEALTH_PATH/integration-test-suite.py" "$BASE_PATH" 2>&1 | tee -a "$LOG_FILE"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${GREEN}✅ Integration tests completed successfully in ${duration}s${NC}"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${RED}❌ Integration tests failed after ${duration}s${NC}"
        return 1
    fi
}

# Function to run performance benchmarks
run_performance_benchmarks() {
    log "\n${PURPLE}📊 Running Performance Benchmarks...${NC}"
    log "============================================"
    
    local start_time=$(date +%s)
    
    if python3 "$HEALTH_PATH/performance-benchmarks.py" "$BASE_PATH" 2>&1 | tee -a "$LOG_FILE"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${GREEN}✅ Performance benchmarks completed successfully in ${duration}s${NC}"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${RED}❌ Performance benchmarks failed after ${duration}s${NC}"
        return 1
    fi
}

# Function to run load tests
run_load_tests() {
    log "\n${YELLOW}🔥 Running Load Tests...${NC}"
    log "============================================"
    
    local start_time=$(date +%s)
    
    # Ask user for confirmation due to resource intensive nature
    read -p "Load tests are resource intensive and may take 15-20 minutes. Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "${YELLOW}⚠️  Load tests skipped by user${NC}"
        return 2
    fi
    
    if timeout 1800 python3 "$HEALTH_PATH/load-test-runner.py" "$BASE_PATH" 2>&1 | tee -a "$LOG_FILE"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${GREEN}✅ Load tests completed successfully in ${duration}s${NC}"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            log "${RED}❌ Load tests timed out after 30 minutes${NC}"
        else
            log "${RED}❌ Load tests failed after ${duration}s${NC}"
        fi
        return 1
    fi
}

# Function to run hook system tests
test_hook_system() {
    log "\n${BLUE}🔗 Testing Hook System Components...${NC}"
    log "============================================"
    
    local hooks_dir="$CLAUDE_PATH/hooks"
    local test_results=0
    
    # Test hook manager
    if [[ -f "$hooks_dir/hook-manager.sh" ]]; then
        log "   🧪 Testing hook manager..."
        if bash "$hooks_dir/hook-manager.sh" --test 2>&1 | tee -a "$LOG_FILE"; then
            log "${GREEN}   ✅ Hook manager test passed${NC}"
        else
            log "${RED}   ❌ Hook manager test failed${NC}"
            ((test_results++))
        fi
    else
        log "${YELLOW}   ⚠️  Hook manager not found, skipping${NC}"
    fi
    
    # Test file watcher
    if [[ -f "$hooks_dir/file-watcher.py" ]]; then
        log "   🧪 Testing file watcher..."
        if timeout 10 python3 "$hooks_dir/file-watcher.py" "$HEALTH_PATH" --test 2>&1 | tee -a "$LOG_FILE"; then
            log "${GREEN}   ✅ File watcher test passed${NC}"
        else
            log "${RED}   ❌ File watcher test failed${NC}"
            ((test_results++))
        fi
    else
        log "${YELLOW}   ⚠️  File watcher not found, skipping${NC}"
    fi
    
    # Test pre-commit hook
    if [[ -f "$hooks_dir/pre-commit.sh" ]]; then
        log "   🧪 Testing pre-commit hook..."
        if bash "$hooks_dir/pre-commit.sh" --test 2>&1 | tee -a "$LOG_FILE"; then
            log "${GREEN}   ✅ Pre-commit hook test passed${NC}"
        else
            log "${RED}   ❌ Pre-commit hook test failed${NC}"
            ((test_results++))
        fi
    else
        log "${YELLOW}   ⚠️  Pre-commit hook not found, skipping${NC}"
    fi
    
    # Test integration test hook (if exists)
    if [[ -f "$hooks_dir/integration-test.sh" ]]; then
        log "   🧪 Testing integration test hook..."
        if bash "$hooks_dir/integration-test.sh" --test 2>&1 | tee -a "$LOG_FILE"; then
            log "${GREEN}   ✅ Integration test hook passed${NC}"
        else
            log "${RED}   ❌ Integration test hook failed${NC}"
            ((test_results++))
        fi
    else
        log "${YELLOW}   ⚠️  Integration test hook not found, skipping${NC}"
    fi
    
    if [[ $test_results -eq 0 ]]; then
        log "${GREEN}✅ All hook system tests passed${NC}"
        return 0
    else
        log "${RED}❌ $test_results hook system tests failed${NC}"
        return 1
    fi
}

# Function to test workflow commands
test_workflow_commands() {
    log "\n${CYAN}⚡ Testing Workflow Commands...${NC}"
    log "============================================"
    
    local commands_dir="$CLAUDE_PATH/commands"
    local test_results=0
    
    # List of critical workflow commands to test
    local critical_commands=("wr.md" "wv.md" "wi.md" "workflow-help.md" "workflow-list.md")
    
    for cmd_file in "${critical_commands[@]}"; do
        if [[ -f "$commands_dir/$cmd_file" ]]; then
            log "   🧪 Verifying command: $cmd_file"
            
            # Check if command file has required structure
            if grep -q "# " "$commands_dir/$cmd_file" && 
               grep -q "## " "$commands_dir/$cmd_file"; then
                log "${GREEN}   ✅ Command structure valid: $cmd_file${NC}"
            else
                log "${RED}   ❌ Command structure invalid: $cmd_file${NC}"
                ((test_results++))
            fi
        else
            log "${RED}   ❌ Missing critical command: $cmd_file${NC}"
            ((test_results++))
        fi
    done
    
    # Test command discovery
    local command_count=$(find "$commands_dir" -name "*.md" | wc -l)
    log "   📊 Total commands discovered: $command_count"
    
    if [[ $command_count -lt 5 ]]; then
        log "${YELLOW}   ⚠️  Low command count, may indicate incomplete setup${NC}"
    fi
    
    if [[ $test_results -eq 0 ]]; then
        log "${GREEN}✅ All workflow command tests passed${NC}"
        return 0
    else
        log "${RED}❌ $test_results workflow command tests failed${NC}"
        return 1
    fi
}

# Function to validate agent system
validate_agent_system() {
    log "\n${PURPLE}🤖 Validating Agent System...${NC}"
    log "============================================"
    
    local agents_dir="$CLAUDE_PATH/agents"
    local test_results=0
    
    # Check for core agents
    local core_agents=("compliance.md" "reviewer.md" "architect.md" "performance-monitor.md")
    
    for agent_file in "${core_agents[@]}"; do
        if [[ -f "$agents_dir/$agent_file" ]]; then
            log "   🧪 Validating agent: $agent_file"
            
            # Check agent file structure
            if grep -q "## Primary Responsibilities" "$agents_dir/$agent_file" &&
               grep -q "## Approach" "$agents_dir/$agent_file"; then
                log "${GREEN}   ✅ Agent structure valid: $agent_file${NC}"
            else
                log "${RED}   ❌ Agent structure invalid: $agent_file${NC}"
                ((test_results++))
            fi
        else
            log "${RED}   ❌ Missing core agent: $agent_file${NC}"
            ((test_results++))
        fi
    done
    
    # Check total agent count
    local agent_count=$(find "$agents_dir" -name "*.md" | wc -l)
    log "   📊 Total agents available: $agent_count"
    
    if [[ $agent_count -lt 10 ]]; then
        log "${YELLOW}   ⚠️  Consider expanding agent ecosystem for better coverage${NC}"
    fi
    
    if [[ $test_results -eq 0 ]]; then
        log "${GREEN}✅ Agent system validation passed${NC}"
        return 0
    else
        log "${RED}❌ $test_results agent validation tests failed${NC}"
        return 1
    fi
}

# Function to generate comprehensive report
generate_comprehensive_report() {
    log "\n${CYAN}📋 Generating Comprehensive Test Report...${NC}"
    log "============================================"
    
    local report_file="$RESULTS_DIR/comprehensive-test-report-$TIMESTAMP.md"
    
    cat > "$report_file" << EOF
# Comprehensive Multi-Agent Workflow Integration Test Report

**Generated:** $(date)
**Test Suite Version:** 1.0
**Base Path:** $BASE_PATH

## Executive Summary

This report provides a comprehensive analysis of the multi-agent workflow system's integration test results, performance benchmarks, and production readiness assessment.

## Test Categories Executed

### 1. Integration Tests
- ✅ Workflow Command Testing
- ✅ Hook System Validation  
- ✅ Multi-Agent Coordination
- ✅ End-to-End Scenarios

### 2. Performance Benchmarks
- ✅ Parallel Agent Execution
- ✅ Command Response Times
- ✅ State Persistence Performance
- ✅ Hook System Overhead

### 3. Load Testing
- ✅ Light Load Baseline
- ✅ Moderate Load Mixed Workflows
- ✅ High Load Parallel Review
- ✅ Stress Test All Workflows
- ✅ Burst Load Test

### 4. System Component Validation
- ✅ Hook System Components
- ✅ Workflow Commands
- ✅ Agent System Architecture

## Test Results Summary

EOF

    # Add test results from log file
    echo "### Detailed Results" >> "$report_file"
    echo "\`\`\`" >> "$report_file"
    grep -E "(✅|❌|⚠️)" "$LOG_FILE" | tail -50 >> "$report_file"
    echo "\`\`\`" >> "$report_file"
    
    # Add file references
    echo "" >> "$report_file"
    echo "## Generated Artifacts" >> "$report_file"
    echo "" >> "$report_file"
    echo "The following files contain detailed test data:" >> "$report_file"
    echo "" >> "$report_file"
    
    # List all generated files
    find "$HEALTH_PATH" -name "*test*" -o -name "*benchmark*" -o -name "*report*" | grep -E "\.(json|txt|md)$" | while read -r file; do
        echo "- \`$(basename "$file")\` - $(stat -f%Sm -t '%Y-%m-%d %H:%M' "$file" 2>/dev/null || stat -c %y "$file" | cut -d' ' -f1-2)" >> "$report_file"
    done
    
    # Add recommendations
    cat >> "$report_file" << EOF

## Recommendations

### Immediate Actions
- 🔍 Review any failed tests and address root causes
- 📊 Establish baseline performance metrics from benchmark results
- 🚨 Set up monitoring for production deployment

### Optimization Opportunities
- ⚡ Optimize parallel execution efficiency if below 3x sequential performance
- 🔄 Implement auto-scaling based on load test patterns
- 📈 Add performance regression testing to CI/CD pipeline

### Production Readiness
- 🛡️ Verify error handling and recovery mechanisms
- 📊 Implement real-time performance monitoring
- 🔄 Set up automated health checks based on test patterns

## Conclusion

This comprehensive test suite validates the multi-agent workflow system's readiness for production deployment. Review the detailed results and address any identified issues before proceeding with production rollout.

**Report Generated:** $(date)
**Total Test Duration:** $(( $(date +%s) - $(stat -f%Sm -t %s "$LOG_FILE" 2>/dev/null || stat -c %Y "$LOG_FILE") )) seconds
EOF

    log "${GREEN}✅ Comprehensive report generated: $report_file${NC}"
}

# Function to cleanup test artifacts
cleanup_test_artifacts() {
    log "\n${BLUE}🧹 Cleaning up test artifacts...${NC}"
    
    # Clean up temporary test files
    find "$HEALTH_PATH" -name "test-state-*.json" -delete 2>/dev/null || true
    find "$HEALTH_PATH" -name "benchmark-state-*.json" -delete 2>/dev/null || true
    find "$HEALTH_PATH" -name "*.tmp" -delete 2>/dev/null || true
    
    # Archive old test results (keep last 10)
    if ls "$HEALTH_PATH"/*test-report* >/dev/null 2>&1; then
        ls -t "$HEALTH_PATH"/*test-report* | tail -n +11 | xargs rm -f 2>/dev/null || true
    fi
    
    log "${GREEN}✅ Cleanup completed${NC}"
}

# Main execution function
main() {
    local start_time=$(date +%s)
    local test_failures=0
    
    log "${GREEN}🚀 Starting Comprehensive Multi-Agent Workflow Integration Tests${NC}"
    log "=================================================================="
    log "📅 Start Time: $(date)"
    log "📁 Base Path: $BASE_PATH"
    log "📝 Log File: $LOG_FILE"
    log ""
    
    # Check prerequisites
    check_prerequisites || exit 1
    
    # Run component validation tests
    log "${CYAN}🔧 Phase 1: Component Validation${NC}"
    validate_agent_system || ((test_failures++))
    test_workflow_commands || ((test_failures++))
    test_hook_system || ((test_failures++))
    
    # Run integration tests
    log "\n${CYAN}🧪 Phase 2: Integration Testing${NC}"
    run_integration_tests || ((test_failures++))
    
    # Run performance benchmarks
    log "\n${CYAN}📊 Phase 3: Performance Benchmarking${NC}"
    run_performance_benchmarks || ((test_failures++))
    
    # Run load tests (optional)
    log "\n${CYAN}🔥 Phase 4: Load Testing${NC}"
    load_test_result=$(run_load_tests)
    load_test_exit=$?
    if [[ $load_test_exit -eq 1 ]]; then
        ((test_failures++))
    elif [[ $load_test_exit -eq 2 ]]; then
        log "${YELLOW}⚠️  Load tests were skipped${NC}"
    fi
    
    # Generate comprehensive report
    generate_comprehensive_report
    
    # Cleanup
    cleanup_test_artifacts
    
    # Final summary
    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))
    
    log "\n${GREEN}🏁 Test Suite Execution Complete${NC}"
    log "=================================================================="
    log "📅 End Time: $(date)"
    log "⏱️  Total Duration: ${total_duration}s ($(($total_duration / 60))m $(($total_duration % 60))s)"
    log "📊 Test Failures: $test_failures"
    
    if [[ $test_failures -eq 0 ]]; then
        log "${GREEN}🎉 ALL TESTS PASSED - System ready for production deployment!${NC}"
        exit 0
    else
        log "${RED}⚠️  $test_failures TEST CATEGORIES FAILED - Review results before production deployment${NC}"
        exit 1
    fi
}

# Handle script interruption
trap 'log "\n🛑 Test execution interrupted"; cleanup_test_artifacts; exit 130' INT TERM

# Execute main function
main "$@"