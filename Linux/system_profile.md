# System Profile: Developer Workstation & Lab Node

> **Document Scope:** Q1 – Course Outcome 1 (CO1: Analyze and administer core Linux operating system components, kernel parameters, resource allocations, and network configurations).

---

## 1. System Identification & Host Overview

| Attribute | Specification Value | Reference Command |
| :--- | :--- | :--- |
| **Hostname** | `dev-workstation` | `hostname` / `uname -n` |
| **Current User** | `devops` (UID: 1000, GID: 1000) | `whoami` / `id` |
| **Default Shell** | `/bin/bash` (GNU bash, version 5.2.21) | `echo $SHELL` |
| **Operating System** | Ubuntu 24.04 LTS (Noble Numbat) | `/etc/os-release` |
| **OS Architecture** | `x86_64` (64-bit Little Endian) | `uname -m` |
| **Kernel Release** | `6.8.0-40-generic` | `uname -r` |
| **Kernel Build Date** | `#40-Ubuntu SMP PREEMPT_DYNAMIC Fri Jul 5 2024` | `uname -v` |
| **System Uptime** | `14 days, 3 hours, 42 minutes` | `uptime -p` |
| **System Timezone** | `UTC (Coordinated Universal Time)` | `timedatectl` |
| **Active Users** | `2 active sessions` | `who` / `w` |

---

## 2. Hardware Architecture & Compute Infrastructure

### Processor Details (`lscpu`)
- **CPU Model:** AMD Ryzen 7 5800H with Radeon Graphics
- **Instruction Set:** x86-64 (AMD64)
- **Cores / Threads:** 8 Physical Cores / 16 Hardware Threads (Simultaneous Multi-Threading enabled)
- **Base Clock Frequency:** 3.20 GHz
- **Maximum Boost Frequency:** 4.40 GHz
- **Minimum Low-Power Frequency:** 1.20 GHz
- **L1 Cache:** 512 KiB Total (256 KiB Data + 256 KiB Instruction across 8 instances)
- **L2 Cache:** 4 MiB (512 KiB per core)
- **L3 Cache:** 16 MiB Unified Shared Cache
- **Virtualization Support:** Hardware-assisted AMD-V (`svm` flag active)
- **Vulnerability Mitigations:** Retpolines, IBPB, STIBP, Speculative Store Bypass disabled via `prctl`, usercopy/swapgs sanitization

---

## 3. Memory Allocation & Utilization

### Physical Memory (`free -h`)
- **Total Physical RAM:** `15.89 GiB` (~16 GB DDR4-3200)
- **Memory In Use:** `5.2 GiB` (32.7% allocation)
- **Free Memory:** `5.9 GiB` (available unmapped memory)
- **Shared Memory:** `384 MiB` (inter-process communication / shm)
- **Buffer & Page Cache:** `4.4 GiB` (filesystem metadata and active disk caching)
- **Effective Available Memory:** `9.8 GiB` (safe headroom without paging pressure)

### Virtual Memory / Swap
- **Total Swap Space:** `4.0 GiB` (Zram / NVMe swap partition)
- **Used Swap:** `0 B` (0.0% swap utilization; zero paging bottleneck)
- **Free Swap:** `4.0 GiB`
- **Linux Swappiness (`vm.swappiness`):** `60` (standard desktop/server balance)

---

## 4. Storage Architecture & Filesystem Hierarchy

### Storage Device & Mounts (`df -h`)
- **Primary Block Device:** NVMe SSD (`/dev/nvme0n1`, PCIe Gen3 x4)
- **Partition Layout:**
  - `/dev/nvme0n1p2`: Root Filesystem (`/`), `ext4` filesystem
    - **Total Capacity:** `468 GiB`
    - **Used Space:** `142 GiB` (32% utilization)
    - **Available Free Space:** `303 GiB` (68% headroom)
  - `/dev/nvme0n1p1`: EFI System Partition (`/boot/efi`), `vfat` filesystem
    - **Total Capacity:** `511 MiB`
    - **Used Space:** `6.1 MiB` (2% utilization)
    - **Available Space:** `505 MiB`
- **Volatile / In-Memory Filesystems (tmpfs):**
  - `/run`: `1.6 GiB` (system runtime state)
  - `/dev/shm`: `7.8 GiB` (POSIX shared memory)
  - `/run/lock`: `5.0 MiB` (subsystem lock files)
  - `/run/user/1000`: `1.6 GiB` (systemd user session bus)

---

## 5. Network Interfaces & IP Configuration (`ip a`)

| Interface | Type | Hardware MAC | IPv4 Address | MTU | Operational State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lo` | Loopback | `00:00:00:00:00:00` | `127.0.0.1/8` (`::1/128`) | 65536 | `UNKNOWN / UP` |
| `enp3s0` | Gigabit Ethernet | `04:42:1a:8b:9e:3d` | `192.168.1.105/24` | 1500 | `UP (LOWER_UP)` |
| `docker0` | Virtual Bridge | `02:42:3b:51:7a:91` | `172.17.0.1/16` | 1500 | `DOWN (No carrier)` |

- **Default IPv4 Gateway:** `192.168.1.1` via `enp3s0`
- **Primary DNS Resolvers:** `192.168.1.1`, fallback `1.1.1.1`, `8.8.8.8` (managed via `systemd-resolved`)

---

## 6. Process Table & Top Resource Consumers

From `top -bn1` and `ps aux --sort=-%mem | head`:
- **Total Process Count:** 298 tasks (1 running, 297 sleeping, 0 zombie)
- **Average CPU Load:** `0.42` (1 min), `0.58` (5 min), `0.51` (15 min) — System is cool and stable.
- **Top Memory Consumers:**
  1. Google Chrome (`PID 1890`): 5.2% RAM (~845 MB RSS)
  2. Visual Studio Code (`PID 2145`): 3.8% RAM (~612 MB RSS)
  3. Chrome Helper Renderer (`PID 1942`): 2.6% RAM (~421 MB RSS)
  4. Python Automation Pipeline (`PID 3412`): 0.9% RAM (~142 MB RSS)
  5. Docker Daemon (`PID 982`): 0.6% RAM (~98 MB RSS)

---

## 7. System Health Assessment & Summary

1. **CPU Health:** Operating well within safe thermal thresholds; average load (<0.6) on a 16-thread CPU represents less than 5% aggregate processor saturation.
2. **Memory Health:** More than 9.8 GiB of immediate available capacity without requiring swap eviction.
3. **Storage Health:** Root disk consumption is healthy at 32%, with over 300 GiB of write headroom for automated backups and logging.
4. **Service Reliability:** Systemd journal confirms zero kernel panics, zero I/O errors, clean cron execution intervals, and operational stability across the 14-day uptime cycle.
