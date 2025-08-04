#!/usr/bin/env python3
"""
Load Testing Framework for Multi-Agent Workflow System
Stress testing and scalability validation for production readiness
"""

import time
import threading
import concurrent.futures
import queue
import random
import json
import psutil
import signal
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict

@dataclass
class LoadTestScenario:
    """Load test scenario configuration"""
    name: str
    duration_seconds: int
    concurrent_users: int
    requests_per_second: float
    workflow_types: List[str]
    ramp_up_seconds: int = 30
    ramp_down_seconds: int = 30

@dataclass
class LoadTestMetrics:
    """Load test metrics tracking"""
    scenario_name: str
    start_time: float
    end_time: float
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: float
    p95_response_time: float
    p99_response_time: float
    throughput_rps: float
    error_rate: float
    resource_usage: Dict[str, float]
    bottlenecks: List[str]
    stability_score: float

class WorkflowLoadTester:
    """Load testing orchestrator for workflow system"""
    
    def __init__(self, base_path: str = None):
        self.base_path = Path(base_path) if base_path else Path.cwd()
        self.claude_path = self.base_path / ".claude"
        self.is_running = False
        self.metrics_queue = queue.Queue()
        self.system_metrics = []
        self.test_results = []
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """Handle graceful shutdown"""
        print("\n🛑 Received shutdown signal, stopping load test...")
        self.is_running = False
        sys.exit(0)
    
    def monitor_system_resources(self):
        """Continuously monitor system resources during load test"""
        while self.is_running:
            try:
                cpu_percent = psutil.cpu_percent(interval=1)
                memory = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                metrics = {
                    "timestamp": time.time(),
                    "cpu_percent": cpu_percent,
                    "memory_percent": memory.percent,
                    "memory_available_gb": memory.available / (1024**3),
                    "disk_percent": disk.percent,
                    "active_connections": len(psutil.net_connections()),
                    "process_count": len(psutil.pids())
                }
                
                self.system_metrics.append(metrics)
                
                # Check for resource exhaustion
                if cpu_percent > 90:
                    print(f"⚠️  High CPU usage: {cpu_percent}%")
                if memory.percent > 85:
                    print(f"⚠️  High memory usage: {memory.percent}%")
                
            except Exception as e:
                print(f"Error monitoring resources: {e}")
            
            time.sleep(1)
    
    def simulate_workflow_execution(self, workflow_type: str, user_id: int) -> Dict[str, Any]:
        """Simulate a workflow execution with realistic timing"""
        start_time = time.time()
        
        # Workflow execution times based on type
        execution_times = {
            "/wr": (0.02, 0.05),  # Parallel review: 20-50ms
            "/wv": (0.01, 0.03),  # Validation: 10-30ms  
            "/wi": (0.05, 0.15),  # Implementation: 50-150ms
            "feature_workflow": (0.1, 0.3),  # Full feature: 100-300ms
            "code_review": (0.03, 0.08),     # Code review: 30-80ms
            "deployment": (0.2, 0.5)         # Deployment: 200-500ms
        }
        
        min_time, max_time = execution_times.get(workflow_type, (0.01, 0.05))
        execution_time = random.uniform(min_time, max_time)
        
        # Simulate processing
        time.sleep(execution_time)
        
        # Simulate occasional failures (2% failure rate)
        success = random.random() > 0.02
        
        end_time = time.time()
        
        return {
            "workflow_type": workflow_type,
            "user_id": user_id,
            "start_time": start_time,
            "end_time": end_time,
            "duration": end_time - start_time,
            "success": success,
            "error": None if success else "Simulated random failure"
        }
    
    def generate_load_pattern(self, scenario: LoadTestScenario) -> List[Tuple[float, str, int]]:
        """Generate load pattern for the scenario"""
        requests = []
        current_time = 0.0
        
        # Ramp-up phase
        for second in range(scenario.ramp_up_seconds):
            ramp_factor = (second + 1) / scenario.ramp_up_seconds
            current_rps = scenario.requests_per_second * ramp_factor
            
            requests_this_second = int(current_rps)
            for req in range(requests_this_second):
                workflow_type = random.choice(scenario.workflow_types)
                user_id = random.randint(1, scenario.concurrent_users)
                requests.append((current_time + (req / current_rps), workflow_type, user_id))
            
            current_time += 1.0
        
        # Steady state phase
        steady_duration = scenario.duration_seconds - scenario.ramp_up_seconds - scenario.ramp_down_seconds
        for second in range(steady_duration):
            requests_this_second = int(scenario.requests_per_second)
            for req in range(requests_this_second):
                workflow_type = random.choice(scenario.workflow_types)
                user_id = random.randint(1, scenario.concurrent_users)
                requests.append((current_time + (req / scenario.requests_per_second), workflow_type, user_id))
            
            current_time += 1.0
        
        # Ramp-down phase
        for second in range(scenario.ramp_down_seconds):
            ramp_factor = 1.0 - (second / scenario.ramp_down_seconds)
            current_rps = scenario.requests_per_second * ramp_factor
            
            requests_this_second = int(current_rps)
            for req in range(requests_this_second):
                workflow_type = random.choice(scenario.workflow_types)
                user_id = random.randint(1, scenario.concurrent_users)
                requests.append((current_time + (req / max(current_rps, 1)), workflow_type, user_id))
            
            current_time += 1.0
        
        return requests
    
    def execute_load_scenario(self, scenario: LoadTestScenario) -> LoadTestMetrics:
        """Execute a load test scenario"""
        print(f"🚀 Starting load test: {scenario.name}")
        print(f"   👥 Concurrent users: {scenario.concurrent_users}")
        print(f"   ⚡ Requests/sec: {scenario.requests_per_second}")
        print(f"   ⏱️  Duration: {scenario.duration_seconds}s")
        
        self.is_running = True
        
        # Start system monitoring
        monitor_thread = threading.Thread(target=self.monitor_system_resources)
        monitor_thread.daemon = True
        monitor_thread.start()
        
        # Generate load pattern
        load_pattern = self.generate_load_pattern(scenario)
        print(f"   📊 Generated {len(load_pattern)} requests")
        
        # Execute load test
        start_time = time.time()
        test_start_time = start_time
        request_results = []
        
        # Use thread pool for concurrent execution
        with concurrent.futures.ThreadPoolExecutor(max_workers=scenario.concurrent_users) as executor:
            futures = []
            
            for scheduled_time, workflow_type, user_id in load_pattern:
                # Wait until the scheduled time
                current_time = time.time() - test_start_time
                if scheduled_time > current_time:
                    time.sleep(scheduled_time - current_time)
                
                # Submit the workflow execution
                future = executor.submit(self.simulate_workflow_execution, workflow_type, user_id)
                futures.append(future)
                
                # Collect completed results periodically
                if len(futures) >= 50:  # Batch process results
                    completed_futures = [f for f in futures if f.done()]
                    for future in completed_futures:
                        try:
                            result = future.result()
                            request_results.append(result)
                        except Exception as e:
                            request_results.append({
                                "workflow_type": "unknown",
                                "user_id": 0,
                                "start_time": time.time(),
                                "end_time": time.time(),
                                "duration": 0,
                                "success": False,
                                "error": str(e)
                            })
                        futures.remove(future)
            
            # Collect remaining results
            for future in concurrent.futures.as_completed(futures):
                try:
                    result = future.result()
                    request_results.append(result)
                except Exception as e:
                    request_results.append({
                        "workflow_type": "unknown", 
                        "user_id": 0,
                        "start_time": time.time(),
                        "end_time": time.time(),
                        "duration": 0,
                        "success": False,
                        "error": str(e)
                    })
        
        end_time = time.time()
        self.is_running = False
        
        # Calculate metrics
        metrics = self.calculate_load_test_metrics(scenario, request_results, start_time, end_time)
        
        print(f"✅ Load test completed: {scenario.name}")
        print(f"   📊 Total requests: {metrics.total_requests}")
        print(f"   ✅ Success rate: {(1-metrics.error_rate):.1%}")
        print(f"   ⚡ Throughput: {metrics.throughput_rps:.2f} RPS")
        print(f"   ⏱️  Avg response time: {metrics.avg_response_time:.3f}s")
        
        return metrics
    
    def calculate_load_test_metrics(self, scenario: LoadTestScenario, results: List[Dict], start_time: float, end_time: float) -> LoadTestMetrics:
        """Calculate comprehensive load test metrics"""
        total_requests = len(results)
        successful_requests = len([r for r in results if r["success"]])
        failed_requests = total_requests - successful_requests
        
        # Response time statistics
        response_times = [r["duration"] for r in results]
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        sorted_times = sorted(response_times)
        p95_index = int(0.95 * len(sorted_times))
        p99_index = int(0.99 * len(sorted_times))
        p95_response_time = sorted_times[p95_index] if sorted_times else 0
        p99_response_time = sorted_times[p99_index] if sorted_times else 0
        
        # Throughput calculation
        test_duration = end_time - start_time
        throughput_rps = successful_requests / test_duration if test_duration > 0 else 0
        
        # Error rate
        error_rate = failed_requests / total_requests if total_requests > 0 else 0
        
        # Resource usage analysis
        if self.system_metrics:
            avg_cpu = sum(m["cpu_percent"] for m in self.system_metrics) / len(self.system_metrics)
            avg_memory = sum(m["memory_percent"] for m in self.system_metrics) / len(self.system_metrics)
            max_cpu = max(m["cpu_percent"] for m in self.system_metrics)
            max_memory = max(m["memory_percent"] for m in self.system_metrics)
        else:
            avg_cpu = avg_memory = max_cpu = max_memory = 0
        
        resource_usage = {
            "avg_cpu_percent": avg_cpu,
            "avg_memory_percent": avg_memory,
            "max_cpu_percent": max_cpu,
            "max_memory_percent": max_memory
        }
        
        # Identify bottlenecks
        bottlenecks = []
        if max_cpu > 80:
            bottlenecks.append("CPU utilization")
        if max_memory > 80:
            bottlenecks.append("Memory utilization")
        if p95_response_time > 0.5:
            bottlenecks.append("Response time")
        if error_rate > 0.05:
            bottlenecks.append("Error rate")
        
        # Calculate stability score (0-1)
        stability_score = (
            (1 - error_rate) * 0.4 +                    # 40% weight on success rate
            min(1.0, throughput_rps / scenario.requests_per_second) * 0.3 +  # 30% weight on throughput
            min(1.0, 0.1 / avg_response_time if avg_response_time > 0 else 1.0) * 0.2 +  # 20% weight on response time
            (1 - max_cpu / 100) * 0.1                   # 10% weight on resource efficiency
        )
        
        return LoadTestMetrics(
            scenario_name=scenario.name,
            start_time=start_time,
            end_time=end_time,
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            avg_response_time=avg_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            throughput_rps=throughput_rps,
            error_rate=error_rate,
            resource_usage=resource_usage,
            bottlenecks=bottlenecks,
            stability_score=stability_score
        )
    
    def run_load_test_suite(self) -> List[LoadTestMetrics]:
        """Run comprehensive load test suite"""
        print("🔥 Starting Comprehensive Load Test Suite")
        print("=" * 60)
        
        # Define test scenarios
        scenarios = [
            LoadTestScenario(
                name="light_load_baseline",
                duration_seconds=120,
                concurrent_users=5,
                requests_per_second=2.0,
                workflow_types=["/wr", "/wv"],
                ramp_up_seconds=15,
                ramp_down_seconds=15
            ),
            LoadTestScenario(
                name="moderate_load_mixed_workflows", 
                duration_seconds=180,
                concurrent_users=10,
                requests_per_second=5.0,
                workflow_types=["/wr", "/wv", "/wi", "code_review"],
                ramp_up_seconds=30,
                ramp_down_seconds=30
            ),
            LoadTestScenario(
                name="high_load_parallel_review",
                duration_seconds=150,
                concurrent_users=15,
                requests_per_second=8.0,
                workflow_types=["/wr", "code_review"],
                ramp_up_seconds=20,
                ramp_down_seconds=20
            ),
            LoadTestScenario(
                name="stress_test_all_workflows",
                duration_seconds=200,
                concurrent_users=20,
                requests_per_second=12.0,
                workflow_types=["/wr", "/wv", "/wi", "feature_workflow", "code_review", "deployment"],
                ramp_up_seconds=40,
                ramp_down_seconds=40
            ),
            LoadTestScenario(
                name="burst_load_test",
                duration_seconds=90,
                concurrent_users=25,
                requests_per_second=20.0,
                workflow_types=["/wr", "/wv"],
                ramp_up_seconds=10,
                ramp_down_seconds=10
            )
        ]
        
        results = []
        
        for i, scenario in enumerate(scenarios, 1):
            print(f"\n🎯 Scenario {i}/{len(scenarios)}: {scenario.name}")
            print("-" * 40)
            
            # Reset system metrics for each scenario
            self.system_metrics = []
            
            try:
                metrics = self.execute_load_scenario(scenario)
                results.append(metrics)
                
                # Brief cooldown between scenarios
                if i < len(scenarios):
                    print("   💤 Cooldown period (30s)...")
                    time.sleep(30)
                    
            except KeyboardInterrupt:
                print("\n🛑 Load test interrupted by user")
                break
            except Exception as e:
                print(f"\n❌ Error in scenario {scenario.name}: {e}")
        
        # Save results
        self.save_load_test_results(results)
        
        return results
    
    def save_load_test_results(self, results: List[LoadTestMetrics]):
        """Save load test results to file"""
        results_dir = self.claude_path / "health"
        results_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        results_file = results_dir / f"load-test-results-{timestamp}.json"
        
        # Convert to serializable format
        serializable_results = [asdict(result) for result in results]
        
        with open(results_file, "w") as f:
            json.dump(serializable_results, f, indent=2, default=str)
        
        print(f"\n💾 Load test results saved to: {results_file}")
    
    def generate_load_test_report(self, results: List[LoadTestMetrics]) -> str:
        """Generate comprehensive load test report"""
        if not results:
            return "No load test results to report."
        
        report = []
        report.append("🔥 LOAD TEST REPORT")
        report.append("=" * 50)
        report.append(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"🧪 Scenarios Executed: {len(results)}")
        report.append("")
        
        # Executive Summary
        report.append("📊 EXECUTIVE SUMMARY")
        report.append("-" * 30)
        
        total_requests = sum(r.total_requests for r in results)
        total_successful = sum(r.successful_requests for r in results)
        avg_stability = sum(r.stability_score for r in results) / len(results)
        max_throughput = max(r.throughput_rps for r in results)
        
        report.append(f"  📈 Total Requests Processed: {total_requests:,}")
        report.append(f"  ✅ Overall Success Rate: {(total_successful/total_requests*100):.1f}%")
        report.append(f"  🏆 Maximum Throughput: {max_throughput:.1f} RPS")
        report.append(f"  🎯 Average Stability Score: {avg_stability:.2f}/1.0")
        report.append("")
        
        # Scenario Details
        report.append("🎯 SCENARIO RESULTS")
        report.append("-" * 30)
        
        for result in results:
            report.append(f"📋 {result.scenario_name.upper().replace('_', ' ')}")
            report.append(f"  ⏱️  Duration: {(result.end_time - result.start_time):.1f}s")
            report.append(f"  📊 Requests: {result.total_requests:,} ({result.successful_requests:,} successful)")
            report.append(f"  ⚡ Throughput: {result.throughput_rps:.2f} RPS")
            report.append(f"  📈 Avg Response Time: {result.avg_response_time:.3f}s")
            report.append(f"  📊 P95 Response Time: {result.p95_response_time:.3f}s")
            report.append(f"  ❌ Error Rate: {result.error_rate:.1%}")
            report.append(f"  🎯 Stability Score: {result.stability_score:.2f}/1.0")
            
            if result.bottlenecks:
                report.append(f"  ⚠️  Bottlenecks: {', '.join(result.bottlenecks)}")
            
            report.append("")
        
        # Performance Analysis
        report.append("📈 PERFORMANCE ANALYSIS")
        report.append("-" * 30)
        
        # Find best and worst performing scenarios
        best_scenario = max(results, key=lambda r: r.stability_score)
        worst_scenario = min(results, key=lambda r: r.stability_score)
        
        report.append(f"🏆 Best Performing: {best_scenario.scenario_name} (Score: {best_scenario.stability_score:.2f})")
        report.append(f"⚠️  Worst Performing: {worst_scenario.scenario_name} (Score: {worst_scenario.stability_score:.2f})")
        report.append("")
        
        # Scalability Assessment
        report.append("🚀 SCALABILITY ASSESSMENT")
        report.append("-" * 30)
        
        # Analyze throughput vs load
        light_load = next((r for r in results if "light" in r.scenario_name), None)
        stress_test = next((r for r in results if "stress" in r.scenario_name), None)
        
        if light_load and stress_test:
            scalability_ratio = stress_test.throughput_rps / light_load.throughput_rps
            report.append(f"  📊 Throughput Scaling: {scalability_ratio:.1f}x from light to stress test")
            
            if scalability_ratio > 3.0:
                report.append("  ✅ Excellent scalability - system handles increased load well")
            elif scalability_ratio > 2.0:
                report.append("  👍 Good scalability - reasonable performance under load")
            else:
                report.append("  ⚠️  Poor scalability - performance degrades significantly under load")
        
        report.append("")
        
        # Recommendations
        report.append("💡 RECOMMENDATIONS")
        report.append("-" * 30)
        
        # Analyze common bottlenecks
        all_bottlenecks = []
        for result in results:
            all_bottlenecks.extend(result.bottlenecks)
        
        bottleneck_counts = defaultdict(int)
        for bottleneck in all_bottlenecks:
            bottleneck_counts[bottleneck] += 1
        
        if bottleneck_counts:
            report.append("  🔍 Common Bottlenecks:")
            for bottleneck, count in sorted(bottleneck_counts.items(), key=lambda x: x[1], reverse=True):
                report.append(f"    • {bottleneck} (occurred in {count} scenarios)")
        
        # Performance recommendations
        if avg_stability < 0.8:
            report.append("  🎯 Overall system stability needs improvement")
        
        max_error_rate = max(r.error_rate for r in results)
        if max_error_rate > 0.05:
            report.append("  🛡️  Error handling needs enhancement")
        
        max_response_time = max(r.p95_response_time for r in results)
        if max_response_time > 0.5:
            report.append("  ⚡ Response time optimization required")
        
        report.append("  📊 Establish performance monitoring and alerting")
        report.append("  🔄 Implement auto-scaling based on load patterns")
        report.append("  🧪 Regular load testing in CI/CD pipeline")
        report.append("  📈 Set performance SLAs based on test results")
        
        return "\n".join(report)

def main():
    """Main load test execution function"""
    import sys
    
    if len(sys.argv) > 1:
        base_path = sys.argv[1]
    else:
        base_path = os.getcwd()
    
    load_tester = WorkflowLoadTester(base_path)
    
    try:
        results = load_tester.run_load_test_suite()
        
        # Generate and display report
        report = load_tester.generate_load_test_report(results)
        print("\n" + report)
        
        # Save report to file
        report_file = Path(base_path) / ".claude" / "health" / f"load-test-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"
        with open(report_file, "w") as f:
            f.write(report)
        
        print(f"\n📄 Load test report saved to: {report_file}")
        
        # Exit with appropriate code based on results
        if results and all(r.stability_score > 0.7 for r in results):
            print("✅ All load tests passed - system is ready for production")
            sys.exit(0)
        else:
            print("⚠️  Some load tests failed - system needs optimization")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Load test interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Load test failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()