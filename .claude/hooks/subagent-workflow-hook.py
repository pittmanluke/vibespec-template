#!/usr/bin/env python3
import json
import sys
import os
from datetime import datetime
from pathlib import Path

def log_event(message):
    """Log workflow events"""
    log_dir = Path('.claude/logs')
    log_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().isoformat()
    log_file = log_dir / f"workflow-{datetime.now().strftime('%Y%m%d')}.log"
    
    with open(log_file, 'a') as f:
        f.write(f"[{timestamp}] {message}\n")

def save_agent_output(agent_name, output):
    """Save agent output for handoffs"""
    state_dir = Path('.claude/workflow-state')
    state_dir.mkdir(exist_ok=True)
    
    state_file = state_dir / f"{agent_name}-output.json"
    
    with open(state_file, 'w') as f:
        json.dump({
            'agent': agent_name,
            'output': output,
            'timestamp': datetime.now().isoformat()
        }, f, indent=2)

def main():
    try:
        # Read hook input
        hook_data = json.load(sys.stdin)
        
        # Try multiple possible field names for agent identification
        agent_name = hook_data.get('subagent_name') or \
                    hook_data.get('agent_name') or \
                    hook_data.get('name') or \
                    hook_data.get('subagent_type') or \
                    'unknown'
        
        final_message = hook_data.get('final_message', '')
        
        # Log the event with all available data for debugging
        log_event(f"SubagentStop: {agent_name} completed")
        
        # Also log the full hook data structure for analysis
        debug_file = Path('.claude/logs/hook-debug.json')
        with open(debug_file, 'a') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'event': 'SubagentStop',
                'data': hook_data
            }, f)
            f.write('\n')
        
        # Save output for potential handoffs
        save_agent_output(agent_name, final_message)
        
        # For now, just continue execution
        result = {
            "continue": True,
            "suppressOutput": False
        }
        
        json.dump(result, sys.stdout)
        return 0
        
    except Exception as e:
        log_event(f"Hook error: {str(e)}")
        # Return non-blocking error
        json.dump({"continue": True}, sys.stdout)
        return 1

if __name__ == "__main__":
    sys.exit(main())