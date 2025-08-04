#!/usr/bin/env python3
"""
Performance Benchmarking Tool for Multi-Agent Workflows
Specialized benchmarking and load testing for workflow orchestration
"""

import time
import threading
import concurrent.futures
import psutil
import json
import statistics
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass, asdict

@dataclass
class BenchmarkResult:
    """Benchmark result data structure"""
    benchmark_name: str
    test_type: str
    start_time: float
    end_time: float
    duration: float
    throughput: float
    latency_stats: Dict[str, float]
    resource_usage: Dict[str, float]
    success_rate: float
    details: Dict[str, Any]

class WorkflowPerformanceBenchmarker:
    """Performance benchmarking for workflow system"""
    
    def __init__(self, base_path: str = None):
        self.base_path = Path(base_path) if base_path else Path.cwd()
        self.claude_path = self.base_path / ".claude"
        self.results: List[BenchmarkResult] = []
        
    def monitor_system_resources(self, duration: float = 1.0) -> Dict[str, float]:
        """Monitor system resource usage during test execution"""
        cpu_samples = []
        memory_samples = []
        
        end_time = time.time() + duration
        while time.time() < end_time:
            cpu_samples.append(psutil.cpu_percent(interval=0.1))
            memory_samples.append(psutil.virtual_memory().percent)
            time.sleep(0.1)
        
        return {
            "cpu_avg": statistics.mean(cpu_samples),
            "cpu_max": max(cpu_samples),
            "memory_avg": statistics.mean(memory_samples),
            "memory_max": max(memory_samples),
            "sample_count": len(cpu_samples)
        }
    
    def benchmark_parallel_agent_execution(self, agent_count: int = 5, iterations: int = 10) -> BenchmarkResult:
        """Benchmark parallel agent execution performance"""
        print(f"🔥 Benchmarking parallel execution with {agent_count} agents, {iterations} iterations...")
        
        start_time = time.time()
        latencies = []
        
        def simulate_agent_work(agent_id: int, work_duration: float = 0.1) -> Dict[str, Any]:
            """Simulate agent work with variable duration"""
            agent_start = time.time()
            time.sleep(work_duration)
            agent_end = time.time()
            return {
                "agent_id": agent_id,
                "duration": agent_end - agent_start,
                "success": True
            }
        
        # Monitor resources during benchmark
        resource_monitor = threading.Thread(
            target=lambda: self.monitor_system_resources(duration=iterations * 0.5)
        )
        resource_monitor.start()
        
        successful_runs = 0
        
        for iteration in range(iterations):
            iteration_start = time.time()
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=agent_count) as executor:
                futures = [
                    executor.submit(simulate_agent_work, i, 0.05 + (i * 0.01)) 
                    for i in range(agent_count)
                ]
                results = [future.result() for future in concurrent.futures.as_completed(futures)]
            
            iteration_end = time.time()
            iteration_latency = iteration_end - iteration_start
            latencies.append(iteration_latency)
            
            if all(r["success"] for r in results):
                successful_runs += 1
        
        resource_monitor.join()
        end_time = time.time()
        
        total_duration = end_time - start_time
        throughput = (successful_runs * agent_count) / total_duration
        success_rate = successful_runs / iterations
        
        latency_stats = {
            "mean": statistics.mean(latencies),
            "median": statistics.median(latencies),
            "min": min(latencies),
            "max": max(latencies),
            "stddev": statistics.stdev(latencies) if len(latencies) > 1 else 0.0,
            "p95": sorted(latencies)[int(0.95 * len(latencies))] if latencies else 0.0,
            "p99": sorted(latencies)[int(0.99 * len(latencies))] if latencies else 0.0
        }
        
        return BenchmarkResult(
            benchmark_name="parallel_agent_execution",
            test_type="performance",
            start_time=start_time,
            end_time=end_time,
            duration=total_duration,
            throughput=throughput,
            latency_stats=latency_stats,
            resource_usage=self.monitor_system_resources(0.1),  # Quick sample
            success_rate=success_rate,
            details={
                "agent_count": agent_count,
                "iterations": iterations,
                "total_operations": iterations * agent_count,
                "successful_operations": successful_runs * agent_count
            }
        )
    
    def benchmark_workflow_command_response(self, commands: List[str], iterations: int = 20) -> BenchmarkResult:
        """Benchmark workflow command response times"""
        print(f"⚡ Benchmarking workflow command response times...")
        
        start_time = time.time()
        command_latencies = {cmd: [] for cmd in commands}
        
        for iteration in range(iterations):
            for command in commands:
                cmd_start = time.time()
                
                # Simulate command processing
                if command == "/wr":
                    time.sleep(0.02)  # Fast parallel review
                elif command == "/wv":
                    time.sleep(0.015)  # Quick validation
                elif command == "/wi":
                    time.sleep(0.05)  # Longer implementation setup
                else:
                    time.sleep(0.01)  # Default command time
                
                cmd_end = time.time()
                command_latencies[command].append(cmd_end - cmd_start)
        
        end_time = time.time()
        
        # Calculate overall statistics
        all_latencies = []
        for latencies in command_latencies.values():
            all_latencies.extend(latencies)
        
        total_commands = len(commands) * iterations
        total_duration = end_time - start_time
        throughput = total_commands / total_duration
        
        latency_stats = {
            "mean": statistics.mean(all_latencies),
            "median": statistics.median(all_latencies),
            "min": min(all_latencies),
            "max": max(all_latencies),
            "stddev": statistics.stdev(all_latencies) if len(all_latencies) > 1 else 0.0,
            "p95": sorted(all_latencies)[int(0.95 * len(all_latencies))],
            "p99": sorted(all_latencies)[int(0.99 * len(all_latencies))]
        }
        
        # Per-command statistics
        command_stats = {}
        for cmd, latencies in command_latencies.items():
            command_stats[cmd] = {
                "mean": statistics.mean(latencies),
                "min": min(latencies),
                "max": max(latencies),
                "count": len(latencies)
            }
        
        return BenchmarkResult(
            benchmark_name="workflow_command_response",
            test_type="latency",
            start_time=start_time,
            end_time=end_time,
            duration=total_duration,
            throughput=throughput,
            latency_stats=latency_stats,
            resource_usage=self.monitor_system_resources(0.1),
            success_rate=1.0,  # All commands succeeded in simulation
            details={
                "commands": commands,
                "iterations": iterations,
                "command_stats": command_stats,
                "total_commands": total_commands
            }
        )
    
    def benchmark_state_persistence(self, operations: int = 100) -> BenchmarkResult:
        """Benchmark state persistence operations"""
        print(f"💾 Benchmarking state persistence with {operations} operations...")
        
        start_time = time.time()
        state_dir = self.claude_path / "workflow-state"
        state_dir.mkdir(exist_ok=True)
        
        write_times = []
        read_times = []
        successful_operations = 0
        
        for i in range(operations):
            state_file = state_dir / f"benchmark-state-{i}.json"
            
            # Write operation
            write_start = time.time()
            test_state = {
                "operation_id": i,
                "timestamp": datetime.now().isoformat(),
                "data": {"key": f"value-{i}", "nested": {"array": list(range(10))}},
                "metadata": {"version": "1.0", "type": "benchmark"}
            }
            
            try:
                with open(state_file, "w") as f:
                    json.dump(test_state, f, indent=2)
                write_end = time.time()
                write_times.append(write_end - write_start)
                
                # Read operation
                read_start = time.time()
                with open(state_file, "r") as f:
                    loaded_state = json.load(f)
                read_end = time.time()
                read_times.append(read_end - read_start)
                
                # Verify data integrity
                if loaded_state["operation_id"] == i:
                    successful_operations += 1
                
                # Cleanup
                state_file.unlink()
                
            except Exception as e:
                print(f"Error in operation {i}: {e}")
        
        end_time = time.time()
        
        total_duration = end_time - start_time
        throughput = successful_operations / total_duration
        success_rate = successful_operations / operations
        
        all_times = write_times + read_times
        latency_stats = {
            "mean": statistics.mean(all_times),
            "median": statistics.median(all_times),
            "min": min(all_times),
            "max": max(all_times),
            "stddev": statistics.stdev(all_times) if len(all_times) > 1 else 0.0,
            "write_mean": statistics.mean(write_times) if write_times else 0.0,
            "read_mean": statistics.mean(read_times) if read_times else 0.0
        }
        
        return BenchmarkResult(
            benchmark_name="state_persistence",
            test_type="io_performance",
            start_time=start_time,
            end_time=end_time,
            duration=total_duration,
            throughput=throughput,
            latency_stats=latency_stats,
            resource_usage=self.monitor_system_resources(0.1),
            success_rate=success_rate,
            details={
                "operations": operations,
                "successful_operations": successful_operations,
                "write_operations": len(write_times),
                "read_operations": len(read_times),
                "avg_write_time": statistics.mean(write_times) if write_times else 0.0,
                "avg_read_time": statistics.mean(read_times) if read_times else 0.0
            }
        )
    
    def benchmark_hook_system_overhead(self, hook_calls: int = 50) -> BenchmarkResult:
        """Benchmark hook system overhead and performance"""
        print(f"🪝 Benchmarking hook system overhead with {hook_calls} calls...")
        
        start_time = time.time()
        hook_times = []
        successful_hooks = 0
        
        for i in range(hook_calls):
            hook_start = time.time()
            
            # Simulate hook processing
            hook_data = {
                "event": "test-event",
                "timestamp": datetime.now().isoformat(),
                "data": {"iteration": i},
                "source": "benchmark"
            }
            
            # Simulate hook processing time
            time.sleep(0.001)  # 1ms processing time
            
            hook_end = time.time()
            hook_times.append(hook_end - hook_start)
            successful_hooks += 1
        
        end_time = time.time()
        
        total_duration = end_time - start_time
        throughput = successful_hooks / total_duration
        success_rate = successful_hooks / hook_calls
        
        latency_stats = {
            "mean": statistics.mean(hook_times),
            "median": statistics.median(hook_times),
            "min": min(hook_times),
            "max": max(hook_times),
            "stddev": statistics.stdev(hook_times) if len(hook_times) > 1 else 0.0,
            "overhead_per_call": statistics.mean(hook_times) if hook_times else 0.0
        }
        
        return BenchmarkResult(
            benchmark_name="hook_system_overhead",
            test_type="overhead_analysis",
            start_time=start_time,
            end_time=end_time,
            duration=total_duration,
            throughput=throughput,
            latency_stats=latency_stats,
            resource_usage=self.monitor_system_resources(0.1),
            success_rate=success_rate,
            details={
                "hook_calls": hook_calls,
                "successful_hooks": successful_hooks,
                "avg_overhead": statistics.mean(hook_times) if hook_times else 0.0,
                "total_overhead": sum(hook_times)
            }
        )
    
    def run_comprehensive_benchmark_suite(self) -> Dict[str, BenchmarkResult]:
        """Run complete benchmark suite"""
        print("🚀 Starting Comprehensive Performance Benchmark Suite...")
        print("=" * 60)
        
        benchmarks = {}
        
        # Parallel execution benchmark
        benchmarks["parallel_execution"] = self.benchmark_parallel_agent_execution(
            agent_count=5, iterations=20
        )
        
        # Command response benchmark
        benchmarks["command_response"] = self.benchmark_workflow_command_response(
            commands=["/wr", "/wv", "/wi", "/workflow:help"], iterations=25
        )
        
        # State persistence benchmark
        benchmarks["state_persistence"] = self.benchmark_state_persistence(operations=100)
        
        # Hook system benchmark
        benchmarks["hook_overhead"] = self.benchmark_hook_system_overhead(hook_calls=100)
        
        # Save benchmark results
        self.save_benchmark_results(benchmarks)
        
        return benchmarks
    
    def save_benchmark_results(self, benchmarks: Dict[str, BenchmarkResult]):
        """Save benchmark results to file"""
        results_dir = self.claude_path / "health"
        results_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        results_file = results_dir / f"performance-benchmarks-{timestamp}.json"
        
        # Convert to serializable format
        serializable_results = {}
        for name, result in benchmarks.items():
            serializable_results[name] = asdict(result)
        
        with open(results_file, "w") as f:
            json.dump(serializable_results, f, indent=2, default=str)
        
        print(f"📊 Benchmark results saved to: {results_file}")
    
    def generate_performance_report(self, benchmarks: Dict[str, BenchmarkResult]) -> str:
        """Generate human-readable performance report"""
        report = []
        report.append("🎯 PERFORMANCE BENCHMARK REPORT")
        report.append("=" * 50)
        report.append(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        for name, result in benchmarks.items():
            report.append(f"📊 {name.upper().replace('_', ' ')}")
            report.append("-" * 30)
            report.append(f"  ⏱️  Duration: {result.duration:.3f}s")
            report.append(f"  🚀 Throughput: {result.throughput:.2f} ops/sec")
            report.append(f"  ✅ Success Rate: {result.success_rate:.1%}")
            report.append(f"  📈 Mean Latency: {result.latency_stats['mean']:.3f}s")
            report.append(f"  📊 P95 Latency: {result.latency_stats.get('p95', 0):.3f}s")
            report.append(f"  💾 CPU Usage: {result.resource_usage.get('cpu_avg', 0):.1f}%")
            report.append(f"  🧠 Memory Usage: {result.resource_usage.get('memory_avg', 0):.1f}%")
            report.append("")
        
        # Performance summary
        report.append("🏆 PERFORMANCE SUMMARY")
        report.append("-" * 30)
        
        avg_throughput = sum(r.throughput for r in benchmarks.values()) / len(benchmarks)
        avg_success_rate = sum(r.success_rate for r in benchmarks.values()) / len(benchmarks)
        
        report.append(f"  📊 Average Throughput: {avg_throughput:.2f} ops/sec")
        report.append(f"  ✅ Average Success Rate: {avg_success_rate:.1%}")
        report.append("")
        
        # Recommendations
        report.append("💡 OPTIMIZATION RECOMMENDATIONS")
        report.append("-" * 30)
        
        # Analyze results for recommendations
        for name, result in benchmarks.items():
            if result.throughput < 100:  # Low throughput threshold
                report.append(f"  ⚡ {name}: Consider optimizing for higher throughput")
            
            if result.latency_stats["mean"] > 0.1:  # High latency threshold
                report.append(f"  🏃 {name}: Reduce latency for better responsiveness")
            
            if result.success_rate < 0.95:  # Low success rate threshold
                report.append(f"  🛡️  {name}: Improve reliability and error handling")
        
        report.append("  📈 Monitor production metrics continuously")
        report.append("  🔧 Implement performance regression testing")
        report.append("  🎯 Set performance SLAs based on benchmark baselines")
        
        return "\n".join(report)

def main():
    """Main benchmark execution function"""
    import sys
    
    if len(sys.argv) > 1:
        base_path = sys.argv[1]
    else:
        base_path = os.getcwd()
    
    benchmarker = WorkflowPerformanceBenchmarker(base_path)
    benchmarks = benchmarker.run_comprehensive_benchmark_suite()
    
    # Generate and print report
    report = benchmarker.generate_performance_report(benchmarks)
    print("\n" + report)
    
    # Save report to file
    report_file = Path(base_path) / ".claude" / "health" / f"performance-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"
    with open(report_file, "w") as f:
        f.write(report)
    
    print(f"\n📄 Performance report saved to: {report_file}")

if __name__ == "__main__":
    main()