#!/usr/bin/env python3
"""
Hook: sub-agent-stop
Purpose: Agent coordination hook that captures agent outputs and manages workflow state
Execution time target: <5s
Platform: Cross-platform (Linux/macOS/WSL)

This hook manages the handoff between agents in multi-agent workflows, capturing outputs,
tracking performance metrics, and enabling intelligent agent chaining.
"""

import json
import sys
import os
import time
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Set, Optional, Any, Tuple
import re

class SubAgentStopHook:
    """Handles sub-agent completion and workflow coordination."""
    
    def __init__(self):
        self.hook_name = "sub-agent-stop"
        self.start_time = time.time()
        
        # Directory setup
        self.base_dir = Path('.claude')
        self.logs_dir = self.base_dir / 'logs'
        self.state_dir = self.base_dir / 'workflow-state'
        self.cache_dir = self.base_dir / 'cache'
        self.config_dir = self.base_dir / 'config'
        
        # Ensure directories exist
        for dir_path in [self.logs_dir, self.state_dir, self.cache_dir, self.config_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Agent coordination state
        self.workflow_state = self._load_workflow_state()
        self.agent_registry = self._load_agent_registry()
        
    def _load_config(self) -> Dict[str, Any]:
        """Load hook configuration with defaults."""
        config_file = self.config_dir / 'hooks.json'
        default_config = {
            'hooks': {
                'sub-agent-stop': {
                    'enabled': True,
                    'timeout': 15,
                    'save_outputs': True,
                    'enable_chaining': True,
                    'performance_tracking': True,
                    'output_formats': ['json', 'markdown'],
                    'max_output_size_mb': 10,
                    'agent_timeout_seconds': 300
                }
            },
            'agent_coordination': {
                'parallel_groups': {
                    'review': ['compliance', 'reviewer', 'ui-enhancer'],
                    'validation': ['spec-guardian', 'architect'],
                    'optimization': ['performance-monitor', 'velocity']
                },
                'chain_patterns': {
                    'spec-guardian': ['architect', 'velocity'],
                    'compliance': ['reviewer'],
                    'architect': ['performance-monitor'],
                    'meta-agent': ['workflow-builder']
                },
                'priority_order': [
                    'compliance', 'spec-guardian', 'reviewer',
                    'architect', 'ui-enhancer', 'velocity',
                    'performance-monitor', 'meta-agent'
                ]
            }
        }
        
        try:
            if config_file.exists():
                with open(config_file) as f:
                    loaded_config = json.load(f)
                # Deep merge with defaults
                self._deep_merge(default_config, loaded_config)
        except Exception as e:
            self._log_error(f"Failed to load config: {e}")
        
        return default_config
    
    def _deep_merge(self, base: Dict, overlay: Dict) -> Dict:
        """Deep merge two dictionaries."""
        for key, value in overlay.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._deep_merge(base[key], value)
            else:
                base[key] = value
        return base
    
    def _load_workflow_state(self) -> Dict[str, Any]:
        """Load current workflow execution state."""
        state_file = self.state_dir / 'workflow-execution.json'
        default_state = {
            'current_workflow': None,
            'workflow_id': None,
            'start_time': None,
            'agents_completed': [],
            'agents_pending': [],
            'agents_failed': [],
            'parallel_groups': {},
            'agent_outputs': {},
            'performance_metrics': {},
            'chaining_decisions': []
        }
        
        try:
            if state_file.exists():
                with open(state_file) as f:
                    state = json.load(f)
                # Validate and merge with defaults
                for key in default_state:
                    if key not in state:
                        state[key] = default_state[key]
                return state
        except Exception as e:
            self._log_error(f"Failed to load workflow state: {e}")
        
        return default_state
    
    def _load_agent_registry(self) -> Dict[str, Dict[str, Any]]:
        """Load agent registry with capabilities and metadata."""
        registry_file = self.config_dir / 'agent-registry.json'
        
        # Default agent capabilities
        default_registry = {
            'compliance': {
                'capabilities': ['naming-validation', 'rule-enforcement', 'structure-checking'],
                'output_types': ['violations', 'recommendations'],
                'typical_runtime': 30,
                'priority': 1,
                'chain_compatible': ['reviewer', 'ui-enhancer']
            },
            'reviewer': {
                'capabilities': ['security-scan', 'code-quality', 'best-practices'],
                'output_types': ['issues', 'recommendations', 'security-alerts'],
                'typical_runtime': 45,
                'priority': 2,
                'chain_compatible': ['ui-enhancer', 'performance-monitor']
            },
            'spec-guardian': {
                'capabilities': ['specification-validation', 'requirement-tracking'],
                'output_types': ['alignment-report', 'gaps', 'recommendations'],
                'typical_runtime': 30,
                'priority': 1,
                'chain_compatible': ['architect', 'velocity']
            },
            'ui-enhancer': {
                'capabilities': ['accessibility', 'consistency', 'user-experience'],
                'output_types': ['improvements', 'accessibility-fixes'],
                'typical_runtime': 60,
                'priority': 3,
                'chain_compatible': ['performance-monitor']
            },
            'architect': {
                'capabilities': ['system-design', 'pattern-analysis', 'scalability'],
                'output_types': ['design-recommendations', 'patterns'],
                'typical_runtime': 90,
                'priority': 2,
                'chain_compatible': ['performance-monitor', 'velocity']
            },
            'velocity': {
                'capabilities': ['scope-management', 'feature-prioritization'],
                'output_types': ['scope-analysis', 'recommendations'],
                'typical_runtime': 30,
                'priority': 2,
                'chain_compatible': []
            },
            'performance-monitor': {
                'capabilities': ['performance-analysis', 'optimization-suggestions'],
                'output_types': ['metrics', 'optimizations'],
                'typical_runtime': 45,
                'priority': 3,
                'chain_compatible': []
            },
            'meta-agent': {
                'capabilities': ['agent-creation', 'workflow-design'],
                'output_types': ['agent-specs', 'workflow-definitions'],
                'typical_runtime': 120,
                'priority': 4,
                'chain_compatible': ['workflow-builder']
            }
        }
        
        try:
            if registry_file.exists():
                with open(registry_file) as f:
                    loaded_registry = json.load(f)
                # Merge with defaults
                default_registry.update(loaded_registry)
        except Exception as e:
            self._log_debug(f"Using default agent registry: {e}")
        
        return default_registry
    
    def _save_workflow_state(self):
        """Save updated workflow state."""
        state_file = self.state_dir / 'workflow-execution.json'
        
        try:
            with open(state_file, 'w') as f:
                json.dump(self.workflow_state, f, indent=2)
        except Exception as e:
            self._log_error(f"Failed to save workflow state: {e}")
    
    def _log_info(self, message: str):
        """Log info message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] INFO: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'hooks.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_error(self, message: str):
        """Log error message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] ERROR: {message}"
        print(log_entry, file=sys.stderr)
        
        log_file = self.logs_dir / 'hooks.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_debug(self, message: str):
        """Log debug message if debug mode enabled."""
        if os.environ.get('HOOK_DEBUG', 'false').lower() == 'true':
            timestamp = datetime.now(timezone.utc).isoformat()
            log_entry = f"[{timestamp}] DEBUG: {message}"
            
            debug_log = self.logs_dir / 'hooks-debug.log'
            with open(debug_log, 'a') as f:
                f.write(log_entry + '\n')
    
    def _extract_agent_name(self, hook_data: Dict[str, Any]) -> str:
        """Extract agent name from hook data with multiple fallback strategies."""
        # Try multiple possible field names
        possible_names = [
            'subagent_name', 'agent_name', 'name', 'subagent_type',
            'agent_type', 'agent_id', 'subagent_id'
        ]
        
        for field in possible_names:
            if field in hook_data and hook_data[field]:
                return str(hook_data[field]).lower().replace(' ', '-')
        
        # Try to extract from final_message or content
        content = hook_data.get('final_message', '') or hook_data.get('content', '')
        if content:
            # Look for agent identification patterns
            patterns = [
                r'Agent:\s*([a-zA-Z-]+)',
                r'I am the\s*([a-zA-Z-]+)\s*agent',
                r'As the\s*([a-zA-Z-]+)\s*agent',
                r'\[([a-zA-Z-]+)\s*Agent\]'
            ]
            
            for pattern in patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    return match.group(1).lower().replace(' ', '-')
        
        # Fallback: use timestamp-based identifier
        return f"unknown-{int(time.time())}"
    
    def _parse_agent_output(self, agent_name: str, final_message: str) -> Dict[str, Any]:
        """Parse and structure agent output for handoffs."""
        parsed_output = {
            'agent': agent_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'raw_output': final_message,
            'structured_data': {},
            'recommendations': [],
            'issues': [],
            'metadata': {}
        }
        
        # Extract structured information from the output
        try:
            # Look for JSON blocks
            json_pattern = r'```json\s*\n(.*?)\n```'
            json_matches = re.findall(json_pattern, final_message, re.DOTALL | re.IGNORECASE)
            
            if json_matches:
                try:
                    structured_data = json.loads(json_matches[0])
                    parsed_output['structured_data'] = structured_data
                except json.JSONDecodeError:
                    pass
            
            # Extract recommendations
            rec_patterns = [
                r'(?:Recommendation|Suggest|Recommend)s?:\s*(.+?)(?:\n\n|\n\s*\n|$)',
                r'##\s*Recommendations?\s*\n(.*?)(?:\n##|\n\s*\n|$)',
                r'- Recommend[^:]*:\s*(.+?)(?:\n|\s*$)'
            ]
            
            for pattern in rec_patterns:
                matches = re.findall(pattern, final_message, re.DOTALL | re.IGNORECASE)
                for match in matches:
                    recommendations = [line.strip() for line in match.split('\n') 
                                     if line.strip() and not line.strip().startswith('#')]
                    parsed_output['recommendations'].extend(recommendations)
            
            # Extract issues/problems
            issue_patterns = [
                r'(?:Issue|Problem|Error|Warning)s?:\s*(.+?)(?:\n\n|\n\s*\n|$)',
                r'##\s*Issues?\s*\n(.*?)(?:\n##|\n\s*\n|$)',
                r'❌\s*(.+?)(?:\n|\s*$)',
                r'⚠️\s*(.+?)(?:\n|\s*$)'
            ]
            
            for pattern in issue_patterns:
                matches = re.findall(pattern, final_message, re.DOTALL | re.IGNORECASE)
                for match in matches:
                    issues = [line.strip() for line in match.split('\n')
                             if line.strip() and not line.strip().startswith('#')]
                    parsed_output['issues'].extend(issues)
            
            # Extract metadata
            if 'execution time' in final_message.lower():
                time_match = re.search(r'execution time[:\s]*([0-9.]+)\s*(seconds?|s|minutes?|m)', 
                                     final_message, re.IGNORECASE)
                if time_match:
                    parsed_output['metadata']['execution_time'] = time_match.group(1)
            
            # Clean up duplicates
            parsed_output['recommendations'] = list(set(parsed_output['recommendations'][:10]))
            parsed_output['issues'] = list(set(parsed_output['issues'][:10]))
            
        except Exception as e:
            self._log_debug(f"Failed to parse agent output: {e}")
        
        return parsed_output
    
    def _save_agent_output(self, agent_name: str, parsed_output: Dict[str, Any]):
        """Save agent output for handoffs and analysis."""
        config = self.config['hooks']['sub-agent-stop']
        
        if not config['save_outputs']:
            return
        
        # Save as JSON
        if 'json' in config['output_formats']:
            json_file = self.state_dir / f"{agent_name}-output.json"
            try:
                with open(json_file, 'w') as f:
                    json.dump(parsed_output, f, indent=2)
            except Exception as e:
                self._log_error(f"Failed to save JSON output for {agent_name}: {e}")
        
        # Save as Markdown (legacy format)
        if 'markdown' in config['output_formats']:
            md_file = self.state_dir / f"{agent_name}-agent-output.md"
            try:
                with open(md_file, 'w') as f:
                    f.write(f"# {agent_name.title()} Agent Output\n\n")
                    f.write(f"**Timestamp**: {parsed_output['timestamp']}\n\n")
                    
                    if parsed_output['issues']:
                        f.write("## Issues Identified\n\n")
                        for issue in parsed_output['issues']:
                            f.write(f"- {issue}\n")
                        f.write("\n")
                    
                    if parsed_output['recommendations']:
                        f.write("## Recommendations\n\n")
                        for rec in parsed_output['recommendations']:
                            f.write(f"- {rec}\n")
                        f.write("\n")
                    
                    if parsed_output['structured_data']:
                        f.write("## Structured Data\n\n")
                        f.write("```json\n")
                        f.write(json.dumps(parsed_output['structured_data'], indent=2))
                        f.write("\n```\n\n")
                    
                    f.write("## Full Output\n\n")
                    f.write(parsed_output['raw_output'])
                    
            except Exception as e:
                self._log_error(f"Failed to save Markdown output for {agent_name}: {e}")
    
    def _record_performance_metrics(self, agent_name: str, hook_data: Dict[str, Any]):
        """Record performance metrics for the agent."""
        config = self.config['hooks']['sub-agent-stop']
        
        if not config['performance_tracking']:
            return
        
        metrics = {
            'agent': agent_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'hook_execution_time': time.time() - self.start_time,
            'status': 'completed'
        }
        
        # Extract agent execution time if available
        final_message = hook_data.get('final_message', '')
        time_patterns = [
            r'execution time[:\s]*([0-9.]+)\s*seconds?',
            r'completed in[:\s]*([0-9.]+)\s*seconds?',
            r'took[:\s]*([0-9.]+)\s*seconds?'
        ]
        
        for pattern in time_patterns:
            match = re.search(pattern, final_message, re.IGNORECASE)
            if match:
                try:
                    metrics['agent_execution_time'] = float(match.group(1))
                    break
                except ValueError:
                    pass
        
        # Get expected runtime from registry
        if agent_name in self.agent_registry:
            expected_runtime = self.agent_registry[agent_name].get('typical_runtime', 60)
            metrics['expected_runtime'] = expected_runtime
            
            if 'agent_execution_time' in metrics:
                efficiency = expected_runtime / metrics['agent_execution_time']
                metrics['efficiency_ratio'] = efficiency
                
                if efficiency < 0.5:  # Much slower than expected
                    metrics['performance_flag'] = 'slow'
                elif efficiency > 2.0:  # Much faster than expected
                    metrics['performance_flag'] = 'fast'
                else:
                    metrics['performance_flag'] = 'normal'
        
        # Save performance metrics
        self.workflow_state['performance_metrics'][agent_name] = metrics
        
        # Also append to performance log
        perf_file = self.logs_dir / 'agent-performance.json'
        try:
            with open(perf_file, 'a') as f:
                f.write(json.dumps(metrics) + '\n')
        except Exception as e:
            self._log_error(f"Failed to log performance metrics: {e}")
    
    def _determine_next_agents(self, agent_name: str, parsed_output: Dict[str, Any]) -> List[str]:
        """Determine which agents should run next based on current agent output."""
        config = self.config['hooks']['sub-agent-stop']
        
        if not config['enable_chaining']:
            return []
        
        next_agents = []
        
        # Check configured chain patterns
        chain_config = self.config.get('agent_coordination', {}).get('chain_patterns', {})
        if agent_name in chain_config:
            next_agents.extend(chain_config[agent_name])
        
        # Smart chaining based on output content
        if parsed_output['issues']:
            # If issues found, consider running reviewer if not already done
            if 'reviewer' not in self.workflow_state['agents_completed'] and agent_name != 'reviewer':
                next_agents.append('reviewer')
        
        if any('performance' in issue.lower() for issue in parsed_output['issues']):
            # Performance issues detected
            if 'performance-monitor' not in self.workflow_state['agents_completed']:
                next_agents.append('performance-monitor')
        
        if any('ui' in rec.lower() or 'accessibility' in rec.lower() 
               for rec in parsed_output['recommendations']):
            # UI/accessibility recommendations
            if 'ui-enhancer' not in self.workflow_state['agents_completed']:
                next_agents.append('ui-enhancer')
        
        # Remove already completed agents
        next_agents = [agent for agent in next_agents 
                      if agent not in self.workflow_state['agents_completed']]
        
        # Remove duplicates while preserving order
        seen = set()
        unique_next_agents = []
        for agent in next_agents:
            if agent not in seen:
                seen.add(agent)
                unique_next_agents.append(agent)
        
        return unique_next_agents[:3]  # Limit to 3 chained agents
    
    def _update_workflow_state(self, agent_name: str, hook_data: Dict[str, Any], parsed_output: Dict[str, Any]):
        """Update workflow execution state."""
        now = datetime.now(timezone.utc).isoformat()
        
        # Mark agent as completed
        if agent_name not in self.workflow_state['agents_completed']:
            self.workflow_state['agents_completed'].append(agent_name)
        
        # Remove from pending if present
        if agent_name in self.workflow_state['agents_pending']:
            self.workflow_state['agents_pending'].remove(agent_name)
        
        # Store agent output
        self.workflow_state['agent_outputs'][agent_name] = {
            'timestamp': now,
            'summary': {
                'issues_count': len(parsed_output['issues']),
                'recommendations_count': len(parsed_output['recommendations']),
                'has_structured_data': bool(parsed_output['structured_data'])
            }
        }
        
        # Determine and queue next agents
        next_agents = self._determine_next_agents(agent_name, parsed_output)
        if next_agents:
            self._log_info(f"Agent {agent_name} suggests chaining to: {next_agents}")
            
            # Add to pending agents (avoid duplicates)
            for next_agent in next_agents:
                if (next_agent not in self.workflow_state['agents_pending'] and 
                    next_agent not in self.workflow_state['agents_completed']):
                    self.workflow_state['agents_pending'].append(next_agent)
            
            # Record chaining decision
            self.workflow_state['chaining_decisions'].append({
                'from_agent': agent_name,
                'to_agents': next_agents,
                'reason': 'output_analysis',
                'timestamp': now
            })
    
    def _generate_handoff_summary(self, agent_name: str, parsed_output: Dict[str, Any]) -> Dict[str, Any]:
        """Generate summary for handoff to next agents."""
        summary = {
            'source_agent': agent_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'key_findings': {
                'critical_issues': [issue for issue in parsed_output['issues'] 
                                  if any(word in issue.lower() 
                                        for word in ['critical', 'error', 'fail', 'broken'])],
                'priority_recommendations': parsed_output['recommendations'][:3],
                'structured_insights': parsed_output['structured_data']
            },
            'context_for_next_agents': {
                'areas_of_concern': [],
                'validation_needed': [],
                'enhancement_opportunities': []
            }
        }
        
        # Analyze content to provide context
        all_content = ' '.join(parsed_output['issues'] + parsed_output['recommendations'])
        
        if any(word in all_content.lower() for word in ['security', 'vulnerability', 'auth']):
            summary['context_for_next_agents']['areas_of_concern'].append('security')
        
        if any(word in all_content.lower() for word in ['performance', 'slow', 'optimization']):
            summary['context_for_next_agents']['areas_of_concern'].append('performance')
        
        if any(word in all_content.lower() for word in ['ui', 'ux', 'accessibility']):
            summary['context_for_next_agents']['enhancement_opportunities'].append('user_experience')
        
        # Save handoff summary
        handoff_file = self.state_dir / f"{agent_name}-handoff-summary.json"
        try:
            with open(handoff_file, 'w') as f:
                json.dump(summary, f, indent=2)
        except Exception as e:
            self._log_error(f"Failed to save handoff summary: {e}")
        
        return summary
    
    def process_hook(self, hook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main hook processing logic."""
        try:
            # Extract agent information
            agent_name = self._extract_agent_name(hook_data)
            final_message = hook_data.get('final_message', '')
            
            self._log_info(f"Sub-agent {agent_name} completed")
            self._log_debug(f"Agent output length: {len(final_message)} characters")
            
            # Check if hook is enabled
            if not self.config['hooks']['sub-agent-stop']['enabled']:
                self._log_info("Sub-agent-stop hook disabled in configuration")
                return {"continue": True}
            
            # Parse agent output
            parsed_output = self._parse_agent_output(agent_name, final_message)
            
            # Save agent output
            self._save_agent_output(agent_name, parsed_output)
            
            # Record performance metrics
            self._record_performance_metrics(agent_name, hook_data)
            
            # Update workflow state
            self._update_workflow_state(agent_name, hook_data, parsed_output)
            
            # Generate handoff summary
            handoff_summary = self._generate_handoff_summary(agent_name, parsed_output)
            
            # Save updated workflow state
            self._save_workflow_state()
            
            # Log completion
            issues_count = len(parsed_output['issues'])
            recs_count = len(parsed_output['recommendations'])
            self._log_info(f"Agent {agent_name} completed: {issues_count} issues, {recs_count} recommendations")
            
            # Log performance
            execution_time = time.time() - self.start_time
            perf_file = self.logs_dir / 'performance.json'
            perf_entry = {
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'hook': self.hook_name,
                'execution_time': execution_time,
                'status': 'success',
                'agent': agent_name
            }
            
            try:
                with open(perf_file, 'a') as f:
                    f.write(json.dumps(perf_entry) + '\n')
            except Exception as e:
                self._log_error(f"Failed to log performance: {e}")
            
            return {
                "continue": True,
                "suppressOutput": False,
                "metadata": {
                    "agent": agent_name,
                    "issues_found": issues_count,
                    "recommendations_made": recs_count,
                    "execution_time": execution_time,
                    "next_agents_suggested": len(self.workflow_state['agents_pending'])
                }
            }
            
        except Exception as e:
            self._log_error(f"Hook processing failed: {e}")
            
            # Log error performance
            execution_time = time.time() - self.start_time
            perf_file = self.logs_dir / 'performance.json'
            perf_entry = {
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'hook': self.hook_name,
                'execution_time': execution_time,
                'status': 'error',
                'error': str(e)
            }
            
            try:
                with open(perf_file, 'a') as f:
                    f.write(json.dumps(perf_entry) + '\n')
            except Exception as e:
                pass  # Avoid cascading errors
            
            # Return non-blocking error
            return {
                "continue": True,
                "suppressOutput": False,
                "error": str(e)
            }

def main():
    """Main entry point for the hook."""
    try:
        # Read hook input
        hook_input = json.load(sys.stdin)
        
        # Create and run hook
        hook = SubAgentStopHook()
        result = hook.process_hook(hook_input)
        
        # Output result
        json.dump(result, sys.stdout, indent=2)
        return 0
        
    except Exception as e:
        # Fallback error handling
        error_result = {
            "continue": True,
            "error": f"Hook failed: {e}"
        }
        json.dump(error_result, sys.stdout)
        return 1

if __name__ == "__main__":
    sys.exit(main())