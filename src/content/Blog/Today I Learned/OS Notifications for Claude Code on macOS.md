---
created: 2026-02-23T12:39+01:00
changed: 2026-02-23T15:55+01:00
image: "![OS Notifications for Claude Code on macOS](./attachments/OS-Notifications-for-Claude-Code-on-macOS-1771848834188.webp)"
publish: true
published: 2026-02-23
tags:
  - TodayILearned
---
  
Coding with AI is basically the standard nowadays for many people. I also used it quite regularly in my job, specifically [Claude Code](https://code.claude.com/docs/en/overview). It's certainly very useful to take care of boilerplate and repetitive code and other tasks; tell the AI to do the task, that would otherwise take you longer and be boring and let it work in the background (with proper security restraints of course), while I am getting a snack or so.  
There is just one problem with that: It's easy to forget time with your snack and forget to check when Claude is done or needs input from your side, resulting in it twiddling its imaginary thumbs not doing anything. And just like any good manager, I would never allow my employees a single free minute of not being productive.  
Luckily there is a way to avoid that: **Terminal Notifications**!  
  
Claude Code supports **hooks** — shell commands that run automatically at specific points in its lifecycle. With two small config entries and one Homebrew package, you can get native macOS notifications whenever Claude finishes a task or needs your input.  
  
## The Setup  
  
### Prerequisites  
  
Install [terminal-notifier](https://github.com/julienXX/terminal-notifier), a CLI that posts to macOS Notification Center:  
  
```bash  
brew install terminal-notifier  
```  
  
### Configuration  
  
Add two hooks to `~/.claude/settings.json`:  
  
```json  
{  
  "hooks": {  
    "Notification": [  
      {  
        "matcher": "*",  
        "hooks": [  
          {  
            "type": "command",  
            "command": "jq -r '.message' | xargs -I {} terminal-notifier -message \"{}\" -title \"Claude Code Alert\" -group \"$(pwd):notification\""  
          }  
        ]  
      }  
    ],  
    "Stop": [  
      {  
        "matcher": "*",  
        "hooks": [  
          {  
            "type": "command",  
            "command": "terminal-notifier -message \"Claude has completed its task in $(basename $(pwd))\" -title \"Claude Code Finished\" -group \"$(pwd):completion\""  
          }  
        ]  
      }  
    ]  
  }  
}  
```  
  
That's it. ~10 lines of JSON, no scripts, no daemons. And you get simple notifications whenever Claude is done with its current task:  
  
![OS Notifications for Claude Code on macOS](./attachments/OS-Notifications-for-Claude-Code-on-macOS-1771848834188.webp)  
  
There are more details and options to configure these notifications.  
  
## How It Works  
  
### Hook 1: `Notification` — "Claude Needs you"  
  
Fires whenever Claude Code emits a notification — permission prompts, idle prompts, auth events, or questions. Claude pipes JSON to stdin:  
  
```json  
{  
  "message": "Claude needs your permission to use Bash",  
  "title": "Permission needed",  
  "notification_type": "permission_prompt"  
}  
```  
  
The command extracts the `message` field with `jq` and passes it to `terminal-notifier`. You see the actual notification text from Claude as a native macOS notification.  
  
**Notification types** the matcher `"*"` catches:  
  
| Type | When it fires |  
|---|---|  
| `permission_prompt` | Claude needs you to approve a tool use |  
| `idle_prompt` | Claude has been idle waiting for you |  
| `auth_success` | Authentication completed |  
| `elicitation_dialog` | Claude is asking you a question |  
  
### Hook 2: `Stop` — "Claude is done"  
  
Fires whenever Claude finishes its response. The command sends a static notification with the current directory name for context, so you know *which* project Claude just finished working in.  
  
### Smart Notification Grouping  
  
Both hooks use `terminal-notifier`'s `-group` flag:  
  
- `Notification` → `-group "$(pwd):notification"`  
- `Stop` → `-group "$(pwd):completion"`  
  
This does two things:  
  
1. **Per-workspace deduplication** — new notifications from the same workspace replace old ones instead of stacking up  
2. **Separate groups** — "needs input" and "done" notifications don't clobber each other because they use different group suffixes (`:notification` vs `:completion`)  
  
## JSON Payloads  
  
Every hook receives common fields via stdin:  
  
```json  
{  
  "session_id": "abc123",  
  "transcript_path": "/path/to/transcript.jsonl",  
  "cwd": "/current/working/directory",  
  "permission_mode": "default",  
  "hook_event_name": "Stop"  
}  
```  
  
The `Notification` event adds `message`, `title`, and `notification_type`. The `Stop` event adds `stop_hook_active` (boolean) and `last_assistant_message` (Claude's final response text).  
  
## All Available Hook Events  
  
Claude Code supports 15 lifecycle hook events — `Notification` and `Stop` are just two of them:  
  
| Event | When it fires |  
|---|---|  
| `SessionStart` | Session begins or resumes |  
| `UserPromptSubmit` | User submits a prompt, before processing |  
| `PreToolUse` | Before a tool call executes (can block it) |  
| `PermissionRequest` | When a permission dialog appears |  
| `PostToolUse` | After a tool call succeeds |  
| `PostToolUseFailure` | After a tool call fails |  
| `Notification` | When Claude sends a notification |  
| `SubagentStart` | When a subagent is spawned |  
| `SubagentStop` | When a subagent finishes |  
| `Stop` | When Claude finishes responding |  
| `TeammateIdle` | When an agent team teammate is about to go idle |  
| `TaskCompleted` | When a task is marked completed |  
| `ConfigChange` | When a config file changes during a session |  
| `PreCompact` | Before context compaction |  
| `SessionEnd` | When a session terminates |  
  
## Further Reading  
  
- [Hooks reference](https://docs.anthropic.com/en/docs/claude-code/hooks)  
- [Hooks guide (practical examples)](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)  
- [terminal-notifier on GitHub](https://github.com/julienXX/terminal-notifier)  
