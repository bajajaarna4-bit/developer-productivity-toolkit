# ShellScripts Automation Suite

> **Course Outcome Alignment:** Q2 – CO2 (Design, write, debug, and automate production-grade Bash automation scripts with error handling, logging, and scheduled task workflows).

This directory contains six modular, POSIX-compliant, and defensive Bash scripts powering the **Developer Productivity & System Monitoring Toolkit**.

---

## Script Overview & Capabilities

| Script | Purpose & Key Features | CLI Options |
| :--- | :--- | :--- |
| **`system_info.sh`** | Displays formatted system report (OS, Kernel, CPU model, RAM usage, Root disk capacity, Uptime, IPv4). | `--json` for machine-parseable JSON |
| **`resource_monitor.sh`** | Health watchdog that evaluates CPU, RAM, and Disk consumption against alert thresholds. Logs status to `logs/monitor.log`. | Environment overrides: `CPU_THRESHOLD`, `RAM_THRESHOLD`, `DISK_THRESHOLD` |
| **`backup.sh`** | Creates timestamped `tar.gz` archive of specified folder, tests archive integrity, and rotates backups (keeps last 5). | `./backup.sh [source_dir] [backup_dir]` |
| **`cleanup.sh`** | Recursively identifies and purges temporary files (`*.tmp`, `*.bak`, `*~`), cache folders (`__pycache__`), and old logs. | `--dry-run` to inspect without deletion |
| **`git_auto_commit.sh`** | Checks repo status, stages modified/untracked files, and commits with timestamped message. | `-m "msg"`, `--push` to push to remote |
| **`menu.sh`** | Interactive color-coded TUI launcher providing access to all toolkit scripts from a unified interface. | Interactive navigation `[0-7]` |

---

## Technical Standards Applied

Every script in this directory adheres to industry best practices:
1. **Defensive Shebang & Flags:** Starts with `#!/usr/bin/env bash` and `set -euo pipefail` to immediately halt execution on unhandled errors, unbound variables, or broken pipes.
2. **Deterministic Paths:** Resolves `SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"` so scripts execute reliably regardless of the caller's working directory.
3. **Graceful ANSI Color Degradation:** Detects interactive TTYs (`[[ -t 1 ]]`) and honors `NO_COLOR` environment variables.
4. **Safety Guards:** `cleanup.sh` includes hard checks preventing execution against root (`/`), `/home`, `/usr`, or other sensitive operating system locations.

---

## Execution Permissions

Ensure all scripts have executable bits enabled:

```bash
chmod +x ShellScripts/*.sh
```

---

## Usage Guide & Examples

### 1. System Information Report
```bash
# Formatted terminal output
./ShellScripts/system_info.sh

# JSON format for pipelines or APIs
./ShellScripts/system_info.sh --json
```

### 2. Resource Health Monitoring
```bash
# Run with standard thresholds (CPU: 80%, RAM: 85%, Disk: 90%)
./ShellScripts/resource_monitor.sh

# Run with custom strict thresholds
CPU_THRESHOLD=70 RAM_THRESHOLD=75 DISK_THRESHOLD=80 ./ShellScripts/resource_monitor.sh
```

### 3. Timestamped Backup & Rotation
```bash
# Backup current workspace into default ShellScripts/backups/
./ShellScripts/backup.sh

# Backup specific target directory
./ShellScripts/backup.sh /path/to/project /var/backups/dev
```

### 4. Safe Workspace Cleanup
```bash
# Dry run: view files that would be removed without touching disk
./ShellScripts/cleanup.sh --dry-run

# Live cleanup: delete temp files and bytecode caches
./ShellScripts/cleanup.sh
```

### 5. Git Automated Staging & Commit
```bash
# Default timestamped snapshot commit
./ShellScripts/git_auto_commit.sh

# Custom message with auto push to upstream GitHub
./ShellScripts/git_auto_commit.sh -m "feat(api): update stats schema" --push
```

### 6. Interactive Terminal Menu
```bash
./ShellScripts/menu.sh
```

---

## Automated Scheduling via Cron (`crontab -e`)

To automate system monitoring, backups, and routine maintenance, add the following sample lines to your user crontab (`crontab -e`):

```cron
# ------------------------------------------------------------------------------
# Developer Productivity Toolkit Cron Schedule
# Format: Minute Hour Day-of-Month Month Day-of-Week Command
# ------------------------------------------------------------------------------

# 1. Resource Monitor: Check CPU/RAM/Disk health every 15 minutes and log alerts
*/15 * * * * /home/devops/DeveloperPortfolio/ShellScripts/resource_monitor.sh >/dev/null 2>&1

# 2. Automated Backup: Create timestamped tar.gz archive daily at 02:00 AM (retains last 5)
0 2 * * * /home/devops/DeveloperPortfolio/ShellScripts/backup.sh /home/devops/DeveloperPortfolio /home/devops/backups >> /home/devops/DeveloperPortfolio/ShellScripts/logs/backup_cron.log 2>&1

# 3. Weekly Maintenance: Safely purge temporary files and python cache every Sunday at 03:30 AM
30 3 * * 0 /home/devops/DeveloperPortfolio/ShellScripts/cleanup.sh >> /home/devops/DeveloperPortfolio/ShellScripts/logs/cleanup_cron.log 2>&1
```
