# Engineering Learning Roadmap & Course Outcome Mastery

> **Course Outcome Alignment:** Q4 – CO4 (Formulate comprehensive professional roadmaps, document developmental milestones, design industry-standard developer profiles, and deploy interactive portfolio applications).

This roadmap outlines an end-to-end curriculum bridging low-level operating system fundamentals, infrastructure automation, RESTful backend pipelines, and modern cloud-native architectures.

---

## 🗺️ Multi-Phase Roadmap Overview

```
[ Phase 1: Linux & OS Internals ]
               │
               ▼
[ Phase 2: Git, Version Control & Shell Automation ]
               │
               ▼
[ Phase 3: Python Pipelines & REST API Telemetry ]
               │
               ▼
[ Phase 4: Cloud Infrastructure, Containers & CI/CD ]
               │
               ▼
[ Phase 5: Production Capstone & Portfolio Delivery ]
```

---

## Phase 1: Linux Systems Administration & Kernel Diagnostics (CO1)
- **Target Period:** Months 1–2
- **Focus:** System calls, process hierarchies, memory management, filesystem architectures, and performance analysis.

### Milestones & Checkpoints
- [x] **Host Architecture & CPU Topologies:** Master `uname -a`, `lscpu`, core/thread allocation, and NUMA nodes.
- [x] **Memory Management & Virtual Paging:** Interpret `free -h`, buffer/cache mechanics, swap thresholds (`vm.swappiness`), and page faults.
- [x] **Storage & Filesystems:** Administer partition tables, block devices, mount points, and headroom auditing with `df -hT`.
- [x] **Process Monitoring & Resource Contention:** Profile process trees using `top -bn1` and `ps aux --sort=-%mem`.
- [x] **Systemd & Kernel Journal Auditing:** Query syslog and kernel buffers using `journalctl -n 50 -u <service>`.
- [x] **Network Configuration & Routing:** Inspect IP addressing and socket states with `ip a`, `ip route`, and `ss -tulpn`.

---

## Phase 2: Git Version Control & Shell Automation (CO2)
- **Target Period:** Months 3–4
- **Focus:** Defensive scripting, automated archiving, retention rotation, dry-run safety mechanisms, and interactive TUIs.

### Milestones & Checkpoints
- [x] **Defensive Scripting Standards:** Implement strict mode (`set -euo pipefail`) across all automation scripts.
- [x] **System Information Engine:** Build `system_info.sh` supporting formatted terminal banners and `--json` serialization.
- [x] **Health Watchdog & Log Rotation:** Develop `resource_monitor.sh` with CPU/RAM/Disk thresholds and ISO-timestamped logging.
- [x] **Automated Archive Retention:** Engineer `backup.sh` with gzip checksum validation and strict 5-archive retention pruning.
- [x] **Non-Destructive Workspace Cleanup:** Create `cleanup.sh` featuring path-safety guards and `--dry-run` inspection.
- [x] **Git Auto-Staging & Commit Utilities:** Implement `git_auto_commit.sh` with porcelain checks and timestamped snapshot commits.
- [x] **Unified Interactive TUI:** Build `menu.sh` ANSI color control center.
- [x] **Daemon & Cron Automation:** Configure recurring cron jobs (`crontab -e`) for automated monitoring and backup schedules.

---

## Phase 3: Python Backend Automation & REST APIs (CO3)
- **Target Period:** Months 5–6
- **Focus:** RESTful client architecture, API authentication, rate-limiting algorithms, and cross-platform hardware telemetry.

### Milestones & Checkpoints
- [x] **Environment Isolation:** Configure virtual environments (`venv`) and deterministic dependency management (`requirements.txt`).
- [x] **GitHub REST API Integration:** Build `github_stats.py` querying user profiles and repositories with rate-limit headers.
- [x] **Credential Hygiene:** Implement environment-variable token loading (`GITHUB_TOKEN`) with zero hardcoded credentials.
- [x] **Data Aggregation & Schema Design:** Calculate repository stars, forks, and top language percentages into structured JSON.
- [x] **Cross-Platform Telemetry Collection:** Author `system_stats.py` utilizing `psutil` with standard-library fallback logic.
- [x] **Resilient Offline Architecture:** Implement automated caching and fallback datasets for zero-network environments.

---

## Phase 4: Cloud Infrastructure, Containers & DevOps CI/CD (CO4)
- **Target Period:** Months 7–8
- **Focus:** Containerization, Infrastructure as Code (IaC), automated testing, and CI/CD pipelines.

### Milestones & Checkpoints
- [ ] **Docker Containerization:** Author multi-stage `Dockerfile` and `docker-compose.yml` for Python telemetry services.
- [ ] **CI/CD Pipeline with GitHub Actions:** Configure `.github/workflows/ci.yml` for automated linting (ShellCheck, Flake8) and testing.
- [ ] **Infrastructure as Code (Terraform):** Provision cloud compute instances and cloud storage buckets using modular HCL code.
- [ ] **Kubernetes Cluster Orchestration:** Deploy multi-tier applications with deployments, services, ingress, and configmaps.
- [ ] **Observability & Metrics:** Integrate Prometheus exporters and Grafana dashboards for cluster-wide metrics visualization.

---

## Phase 5: Production Capstone & Self-Referential Portfolio
- **Target Period:** Months 9–10
- **Focus:** Full-stack dashboard engineering, static hosting deployment, and technical personal branding.

### Milestones & Checkpoints
- [x] **Glassmorphic Space UI:** Build 60fps responsive dashboard with CSS backdrop blur, neon glow, and 3D hover tilt.
- [x] **Interactive Particle Starfield:** Author vanilla HTML5 Canvas starfield reacting to mouse parallax.
- [x] **Circular SVG Gauges & Spline Charts:** Implement live animated gauges and real-time canvas line charts updating every 2s.
- [x] **Terminal Script Typing Simulator:** Implement animated ANSI terminal streamer for shell automation demos.
- [x] **Static Deployment to GitHub Pages:** Deploy static dashboard to `https://<username>.github.io/DeveloperPortfolio/`.
- [x] **ATS Resume & Profile Architecture:** Formulate industry-standard markdown resume, LinkedIn checklist, and GitHub profile README.

---

## Target Progress Tracker

| Track | Mastery Level | Completed Tasks | Status |
| :--- | :--- | :--- | :--- |
| **Linux Administration (CO1)** | Advanced | 6 / 6 | 🟢 Complete |
| **Shell Automation (CO2)** | Advanced | 8 / 8 | 🟢 Complete |
| **Python & REST APIs (CO3)** | Advanced | 6 / 6 | 🟢 Complete |
| **Frontend Dashboard (CO4)** | Advanced | 6 / 6 | 🟢 Complete |
| **Cloud & DevOps CI/CD** | Intermediate | 2 / 5 | 🟡 In Progress |
