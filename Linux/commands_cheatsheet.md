# Linux Command Cheatsheet & Technical Reference

> **Course Outcome Alignment:** Q1 – CO1 (Mastering fundamental Linux CLI utilities, syntax, flags, and real-world system administration examples).

This document provides a one-line summary, syntax breakdown, key flags, and verified practical usage examples for the eleven foundational Linux commands documented in this portfolio.

---

## Quick Reference Index

| Command | Category | Core Purpose | Typical Example |
| :--- | :--- | :--- | :--- |
| [`uname`](#1-uname) | System Info | Print system, kernel, and hardware architecture details | `uname -a` |
| [`lscpu`](#2-lscpu) | Hardware | Display detailed processor architecture and cache topology | `lscpu` |
| [`free`](#3-free) | Memory | Inspect physical RAM, swap usage, and buffer/cache allocations | `free -h` |
| [`df`](#4-df) | Storage | Report disk filesystem capacity, used space, and mount points | `df -h` |
| [`top`](#5-top) | Monitoring | Real-time interactive process viewer and CPU/RAM monitor | `top -bn1` |
| [`ps`](#6-ps) | Processes | Snapshot active processes with CPU and memory consumption | `ps aux --sort=-%mem \| head` |
| [`uptime`](#7-uptime) | System Health | Show how long the system has run, active users, and load averages | `uptime -p` |
| [`whoami`](#8-whoami) | Identity | Print the effective username of the current execution shell | `whoami` |
| [`ip`](#9-ip) | Networking | Manage and display IP addresses, network interfaces, and routing | `ip a` |
| [`ls`](#10-ls) | Filesystem | List directory contents with file attributes, permissions, and sizes | `ls -la` |
| [`journalctl`](#11-journalctl) | Logs / Auditing | Query and inspect systemd journal logs and kernel ring buffer | `journalctl -n 50` |

---

### 1. `uname`
- **One-line Summary:** Displays operating system name, hostname, kernel release version, build date, and CPU architecture.
- **Syntax:** `uname [OPTION]...`
- **Key Flags:**
  - `-a`, `--all`: Print all system information in sequence.
  - `-r`, `--kernel-release`: Print operating system kernel release.
  - `-m`, `--machine`: Print machine hardware architecture (e.g. `x86_64`, `aarch64`).
- **Example:**
  ```bash
  uname -a
  # Linux dev-workstation 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
  ```

---

### 2. `lscpu`
- **One-line Summary:** Gathers and formats detailed CPU architecture, core/socket counts, clock frequencies, and cache hierarchies from `sysfs`.
- **Syntax:** `lscpu [OPTION]...`
- **Key Flags:**
  - `-e`, `--extended`: Display an extended tabular format per logical CPU.
  - `-J`, `--json`: Output CPU hardware properties in parseable JSON format.
  - `-p`, `--parse`: Output comma-delimited columns for automated scripts.
- **Example:**
  ```bash
  lscpu | grep -E "Model name|Socket|Thread|CPU\(s\):|MHz"
  ```

---

### 3. `free`
- **One-line Summary:** Displays the total amount of free and used physical memory and swap space, as well as buffers and caches used by the kernel.
- **Syntax:** `free [OPTION]...`
- **Key Flags:**
  - `-h`, `--human`: Show all memory values in human-readable powers of 1024 (KiB, MiB, GiB).
  - `-m`, `--mebi`: Display output values strictly in mebibytes (MiB).
  - `-t`, `--total`: Append a summary row displaying aggregate total memory + swap.
- **Example:**
  ```bash
  free -h --wide
  ```

---

### 4. `df`
- **One-line Summary:** Reports filesystem disk space usage, block device partitions, free inodes, and directory mount locations.
- **Syntax:** `df [OPTION]... [FILE]...`
- **Key Flags:**
  - `-h`, `--human-readable`: Print sizes in powers of 1024 (e.g., 10G, 500M).
  - `-T`, `--print-type`: Print filesystem type (e.g. `ext4`, `btrfs`, `xfs`, `tmpfs`).
  - `-x <type>`: Exclude specific filesystem types from output (e.g. `df -h -x tmpfs -x devtmpfs`).
- **Example:**
  ```bash
  df -hT --exclude-type=tmpfs
  ```

---

### 5. `top`
- **One-line Summary:** Provides a dynamic real-time dashboard of running system tasks, CPU utilization percentage, memory allocations, and load averages.
- **Syntax:** `top [OPTION]...`
- **Key Flags:**
  - `-b`, `--batch`: Run in batch mode; useful for piping output to other commands or saving snapshots to text files.
  - `-n <num>`: Exit after specified number of monitoring refresh iterations.
  - `-p <pid>`: Monitor only specific process IDs.
- **Example:**
  ```bash
  top -bn1 | head -n 20
  ```

---

### 6. `ps`
- **One-line Summary:** Reports a static snapshot of current active processes, their execution states, thread counts, CPU/RAM usage, and initiating commands.
- **Syntax:** `ps [OPTION]...`
- **Key Flags:**
  - `aux`: BSD style syntax showing processes for all users (`a`), with process owner (`u`), including processes without a controlling terminal (`x`).
  - `--sort=<key>`: Sort output by column (e.g. `--sort=-%mem` or `--sort=-%cpu`).
  - `-ef`: Standard POSIX syntax listing every running process with full command arguments.
- **Example:**
  ```bash
  ps aux --sort=-%mem | head -n 10
  ```

---

### 7. `uptime`
- **One-line Summary:** Tells how long the system has been running, the current time, total logged-in users, and 1, 5, and 15-minute load averages.
- **Syntax:** `uptime [OPTION]...`
- **Key Flags:**
  - `-p`, `--pretty`: Show uptime in human-friendly pretty format (e.g., `up 2 weeks, 3 hours`).
  - `-s`, `--since`: Display system up date and timestamp (e.g., `2026-11-07 11:05:28`).
- **Example:**
  ```bash
  uptime -p && uptime -s
  ```

---

### 8. `whoami`
- **One-line Summary:** Prints the effective username associated with the current user ID executing the terminal session.
- **Syntax:** `whoami [OPTION]...`
- **Key Flags:**
  - `--help`: Display usage instructions and exit.
  - `--version`: Output version information.
- **Related Commands:** `id -u -n`, `logname`.
- **Example:**
  ```bash
  whoami
  # devops
  ```

---

### 9. `ip`
- **One-line Summary:** Linux net-tools replacement for inspecting and manipulating network interfaces, IP addresses, routing tables, and tunnels.
- **Syntax:** `ip [OPTIONS] OBJECT { COMMAND | help }`
- **Key Objects & Flags:**
  - `a`, `addr`: Manage and view IP addresses on active interfaces.
  - `r`, `route`: View or modify kernel IP routing tables (`ip route show`).
  - `-br`, `-brief`: Output network device status and addresses in concise tabular format.
  - `-c`, `-color`: Enable ANSI syntax highlighting for interface states.
- **Example:**
  ```bash
  ip -br -c addr show
  ```

---

### 10. `ls`
- **One-line Summary:** Lists directory contents and displays detailed metadata including permissions, hard link count, owner, group, file size, and timestamp.
- **Syntax:** `ls [OPTION]... [FILE]...`
- **Key Flags:**
  - `-l`: Use long listing format showing permissions, ownership, byte size, and last modified timestamp.
  - `-a`, `--all`: Include hidden files and directories starting with `.`.
  - `-h`, `--human-readable`: Format file sizes with human units (`K`, `M`, `G`).
  - `-t`: Sort files by modification time, newest first.
- **Example:**
  ```bash
  ls -lah --time-style=long-iso
  ```

---

### 11. `journalctl`
- **One-line Summary:** Queries and filters system logs collected by the `systemd-journald` logging service and kernel ring buffer.
- **Syntax:** `journalctl [OPTION]... [MATCHES]...`
- **Key Flags:**
  - `-n <lines>`: Display the specified number of recent journal log entries (e.g. `-n 50`).
  - `-f`, `--follow`: Stream live journal entries in real time as they arrive.
  - `-u <unit>`: Filter entries for a specific systemd unit (e.g. `-u nginx.service`, `-u cron.service`).
  - `-p <priority>`: Filter by log severity level (`emerg`, `alert`, `crit`, `err`, `warning`, `notice`, `info`, `debug`).
- **Example:**
  ```bash
  journalctl -u cron.service -n 50 --no-pager
  ```
