# Verification Screenshots & Rubric Evidence Matrix

> **Purpose:** This document catalogs the visual verification evidence proving all Course Outcomes (**CO1 through CO4**) and capstone requirements for the **Developer Productivity & System Monitoring Toolkit**.
>
> *Note:* Follow the step-by-step reproduction instructions below to capture your real screenshots and save them into this `Screenshots/` directory using the specified filenames.

---

## 📋 Comprehensive Screenshot Evidence Mapping

| # | Screenshot Filename | Question & Outcome | Evaluator Verification Scope | Command / Action to Capture |
| :-: | :--- | :--- | :--- | :--- |
| **01** | `01_linux_system_profile.png` | **Q1 – CO1** | Proves complete Linux OS, kernel version, AMD/Intel CPU model, RAM, storage mounts, and system uptime. | Open `Linux/system_profile.md` in preview or view `uname -a && uptime && free -h`. |
| **02** | `02_linux_command_outputs.png` | **Q1 – CO1** | Proves verified outputs of all 11 foundational Linux commands saved in `Linux/command_outputs/`. | Terminal snapshot of `ls -la Linux/command_outputs/` and viewing `top_-bn1.txt` / `lscpu.txt`. |
| **03** | `03_shell_system_info.png` | **Q2 – CO2** | Proves execution of `system_info.sh` displaying formatted system identity, CPU, RAM, and disk utilization. | Run: `bash ShellScripts/system_info.sh` |
| **04** | `04_shell_resource_monitor.png` | **Q2 – CO2** | Proves execution of `resource_monitor.sh` evaluating thresholds, colorized alerts, and writing to `logs/monitor.log`. | Run: `bash ShellScripts/resource_monitor.sh` |
| **05** | `05_shell_backup_rotation.png` | **Q2 – CO2** | Proves `backup.sh` creating a timestamped `.tar.gz`, checking gzip integrity, and strictly pruning beyond 5 backups. | Run: `bash ShellScripts/backup.sh` |
| **06** | `06_shell_cleanup_dryrun.png` | **Q2 – CO2** | Proves `cleanup.sh` in `--dry-run` mode scanning and identifying temporary files and cache directories safely. | Run: `bash ShellScripts/cleanup.sh --dry-run` |
| **07** | `07_shell_git_auto_commit.png` | **Q2 – CO2** | Proves `git_auto_commit.sh` detecting working tree changes, auto-staging with `git add -A`, and creating timestamped commit. | Run: `bash ShellScripts/git_auto_commit.sh -m "feat: snapshot"` |
| **08** | `08_shell_interactive_menu.png` | **Q2 – CO2** | Proves `menu.sh` presenting the colorful ANSI text menu and successfully launching child automation scripts. | Run: `bash ShellScripts/menu.sh` |
| **09** | `09_python_github_api_run.png` | **Q3 – CO3** | Proves `github_stats.py` querying GitHub REST API (`/users` & `/repos`), bearer token handling, and terminal summary. | Run: `python API/github_stats.py` |
| **10** | `10_python_system_stats_psutil.png` | **Q3 – CO3** | Proves `system_stats.py` sampling hardware telemetry via `psutil` and writing valid `system_stats.json`. | Run: `python API/system_stats.py` |
| **11** | `11_dashboard_hero_gauges.png` | **Q4 – CO4** | Proves the 60fps dark space control room hero title, typewriter subtitle, and animated circular SVG gauges (CPU/RAM/Disk). | Open `Portfolio/dashboard/index.html` in browser; snapshot Hero & System Monitor. |
| **12** | `12_dashboard_live_spline_chart.png`| **Q4 – CO4** | Proves the real-time canvas spline line chart updating CPU & Memory utilization history every 2 seconds. | Snapshot the Live Resource Stream card in `Portfolio/dashboard/`. |
| **13** | `13_dashboard_interactive_terminal.png`| **Q4 – CO4** | Proves the interactive web terminal simulator typing out shell script outputs line by line with active tab selection. | Click through tabs in `Portfolio/dashboard/#scripts` and snapshot active typing. |
| **14** | `14_dashboard_github_analytics.png` | **Q4 – CO4** | Proves dynamic GitHub counters (repos, stars, followers, forks) and animated language distribution progress bars. | Snapshot the GitHub Analytics section in `Portfolio/dashboard/#github`. |
| **15** | `15_dashboard_timeline_roadmap.png` | **Q4 – CO4** | Proves the animated vertical engineering roadmap timeline drawing down as the user scrolls through curriculum phases. | Snapshot the Roadmap section in `Portfolio/dashboard/#roadmap`. |
| **16** | `16_linkedin_profile_banner.png` | **Q4 – CO4** | Proves professional LinkedIn profile optimization, customized banner, featured project showcase, and headline. | Snapshot updated LinkedIn profile page. |

---

## 📸 Step-by-Step Screenshot Capture Guide

### Step 1: Terminal Scripts (03 through 08)
1. Open your terminal (Git Bash, WSL, or native Linux).
2. Set terminal window width to at least 90 columns for clean formatting.
3. Execute each script one by one:
   ```bash
   ./ShellScripts/system_info.sh
   ./ShellScripts/resource_monitor.sh
   ./ShellScripts/backup.sh
   ./ShellScripts/cleanup.sh --dry-run
   ./ShellScripts/git_auto_commit.sh
   ./ShellScripts/menu.sh
   ```
4. Use `Win + Shift + S` (Windows) or `Shift + Cmd + 4` (macOS) or `gnome-screenshot -a` (Linux) to capture the clean terminal window and save into `Screenshots/`.

### Step 2: Python Telemetry & API JSON (09 and 10)
1. Activate your virtual environment:
   ```bash
   # Windows
   .venv\Scripts\Activate.ps1
   # Linux / macOS
   source .venv/bin/activate
   ```
2. Execute the scripts:
   ```bash
   python API/system_stats.py
   python API/github_stats.py
   ```
3. Capture the formatted ASCII tables and file save confirmations.

### Step 3: Web Dashboard (11 through 15)
1. Open `Portfolio/dashboard/index.html` in Chrome, Firefox, Edge, or Brave.
2. Maximize the browser window to standard 1080p (1920×1080).
3. Capture full-resolution snapshots of:
   - Hero section + Circular Gauges
   - Live 2-second Line Chart
   - Interactive Terminal Simulator with `backup.sh` or `system_info.sh` output
   - GitHub statistics and language bars
   - Animated Roadmap vertical timeline
