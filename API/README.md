# API Telemetry & Integration Suite

> **Course Outcome Alignment:** Q3 – CO3 (Develop Python automation integrating external RESTful web APIs, serialize JSON payloads, enforce credential hygiene, and export system telemetry for dashboard visualization).

This directory houses the Python data-collection services that power the **Developer Productivity & System Monitoring Toolkit**.

---

## Files in this Directory

| File | Purpose |
| :--- | :--- |
| **`github_stats.py`** | Connects to the GitHub REST API (`/users/{username}` & `/repos`), calculates aggregate statistics (total stars, language frequency, top repos), handles rate limiting, and exports JSON summaries. |
| **`system_stats.py`** | Uses `psutil` and standard OS APIs to sample live CPU utilization, memory allocations, root disk headroom, and network throughput, outputting `system_stats.json`. |
| **`requirements.txt`** | Python dependencies: `requests` for RESTful calls and `psutil` for cross-platform hardware telemetry. |
| **`github_response.json`** | Raw GitHub REST API response payload (user profile and repository collection). |
| **`stats_summary.json`** | Formatted GitHub summary consumed by the web dashboard. |
| **`system_stats.json`** | Hardware telemetry metrics consumed by the web dashboard. |

---

## Setup & Virtual Environment

Follow industry standard isolation practices:

```bash
# 1. Create a local virtual environment
python -m venv .venv

# 2. Activate the virtual environment
# On Linux / macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# 3. Install required libraries
pip install -r requirements.txt
```

---

## Usage Guide

### 1. Fetching GitHub Statistics (`github_stats.py`)

```bash
# Fetch metrics for default or configured user
python github_stats.py

# Query a specific GitHub profile
python github_stats.py --username torvalds

# Using environment variables
export GITHUB_USERNAME="your-github-username"
python github_stats.py
```

#### GitHub Token Authentication (Rate Limit Protection)
GitHub enforces an unauthenticated rate limit of **60 requests per hour per IP address**. When authenticated, this increases to **5,000 requests per hour**.

To supply a token safely without hardcoding secrets:
```bash
# Linux / macOS
export GITHUB_TOKEN="ghp_yourPersonalAccessTokenGoesHere"
python github_stats.py

# Windows PowerShell
$env:GITHUB_TOKEN="ghp_yourPersonalAccessTokenGoesHere"
python github_stats.py
```

> **Security Rule:** Tokens are strictly read from the environment and are **never** committed or written to disk.

---

### 2. Capturing System Hardware Telemetry (`system_stats.py`)

```bash
python system_stats.py
```

This runs an accurate hardware probe, writes `system_stats.json`, and prints:
- Overall CPU utilization (%) and per-core thread distribution
- Used, total, and available physical RAM
- Primary disk filesystem capacity and mount utilization
- Network I/O metrics (MB sent and received)
- System uptime

---

## Data Schema Reference

### `stats_summary.json`
```json
{
  "username": "bajajaarna4-bit",
  "name": "DevOps Engineer & Full-Stack Architect",
  "bio": "Building resilient systems and developer tools.",
  "public_repos": 14,
  "followers": 48,
  "total_stars": 38,
  "total_forks": 9,
  "top_languages": [
    { "name": "Shell", "count": 6, "percentage": 42.8 },
    { "name": "Python", "count": 4, "percentage": 28.5 },
    { "name": "JavaScript", "count": 3, "percentage": 21.4 }
  ],
  "recent_repositories": [
    {
      "name": "DeveloperPortfolio",
      "description": "Developer Productivity & System Monitoring Toolkit",
      "html_url": "https://github.com/...",
      "language": "Shell",
      "stars": 38,
      "updated_at": "2026-11-21T14:30:00Z"
    }
  ],
  "last_updated": "2026-11-21T14:30:00Z"
}
```

### `system_stats.json`
```json
{
  "system": {
    "hostname": "dev-workstation",
    "os_name": "Linux",
    "architecture": "x86_64",
    "processor": "AMD Ryzen 7 5800H"
  },
  "uptime": {
    "seconds": 1221492.0,
    "formatted": "14d 3h 42m"
  },
  "cpu": {
    "usage_percent": 18.4,
    "logical_cores": 16,
    "current_frequency_mhz": 3200.0
  },
  "memory": {
    "total_gb": 15.89,
    "used_gb": 5.2,
    "available_gb": 9.8,
    "usage_percent": 32.7
  },
  "disk": {
    "mount_point": "/",
    "total_gb": 468.0,
    "used_gb": 142.0,
    "usage_percent": 32.0
  },
  "status": "HEALTHY"
}
```
