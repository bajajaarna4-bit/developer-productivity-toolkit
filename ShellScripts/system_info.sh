#!/usr/bin/env bash
# ==============================================================================
# system_info.sh - Developer Productivity & System Monitoring Toolkit
# Description: Generates a formatted hardware, OS, and resource utilization report.
# Course Outcome: Q2 - CO2 (Bash Automation & System Administration)
# ==============================================================================

set -euo pipefail

# --- Color Definitions ---
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
    BOLD="\033[1m"
    DIM="\033[2m"
    CYAN="\033[0;36m"
    GREEN="\033[0;32m"
    YELLOW="\033[1;33m"
    BLUE="\033[0;34m"
    MAGENTA="\033[0;35m"
    RESET="\033[0m"
else
    BOLD=""
    DIM=""
    CYAN=""
    GREEN=""
    YELLOW=""
    BLUE=""
    MAGENTA=""
    RESET=""
fi

# --- Helper Functions ---
print_banner() {
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                   SYSTEM PROFILE & HARDWARE REPORT                   ║
║             Developer Productivity & System Monitoring Toolkit        ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${RESET}"
}

format_row() {
    local label="$1"
    local value="$2"
    printf "${BOLD}%-22s${RESET} : ${GREEN}%s${RESET}\n" "$label" "$value"
}

# --- Gather System Metrics ---
get_os_info() {
    if [[ -f /etc/os-release ]]; then
        # shellcheck disable=SC1091
        source /etc/os-release
        echo "${PRETTY_NAME:-$NAME}"
    elif command -v uname >/dev/null 2>&1; then
        uname -s
    else
        echo "Unknown Operating System"
    fi
}

get_kernel() {
    uname -r 2>/dev/null || echo "N/A"
}

get_hostname() {
    hostname 2>/dev/null || uname -n
}

get_user() {
    whoami 2>/dev/null || id -u -n
}

get_uptime() {
    if command -v uptime >/dev/null 2>&1; then
        uptime -p 2>/dev/null || uptime | sed 's/.*up \([^,]*\), .*/\1/'
    else
        echo "N/A"
    fi
}

get_cpu_model() {
    if [[ -f /proc/cpuinfo ]]; then
        grep -m1 'model name' /proc/cpuinfo | awk -F': ' '{print $2}' | xargs
    elif command -v lscpu >/dev/null 2>&1; then
        lscpu | grep "Model name:" | awk -F': ' '{print $2}' | xargs
    elif command -v sysctl >/dev/null 2>&1; then
        sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "Generic CPU"
    else
        echo "x86_64 Compatible Processor"
    fi
}

get_cpu_cores() {
    if command -v nproc >/dev/null 2>&1; then
        nproc
    elif [[ -f /proc/cpuinfo ]]; then
        grep -c '^processor' /proc/cpuinfo
    else
        echo "1"
    fi
}

get_ram_info() {
    if command -v free >/dev/null 2>&1; then
        local total used pct
        total=$(free -h | awk '/^Mem:/ {print $2}')
        used=$(free -h | awk '/^Mem:/ {print $3}')
        pct=$(free | awk '/^Mem:/ {printf "%.1f", ($3/$2)*100}')
        echo "${used} / ${total} (${pct}% used)"
    elif [[ -f /proc/meminfo ]]; then
        local total_kb avail_kb used_kb pct
        total_kb=$(awk '/MemTotal:/ {print $2}' /proc/meminfo)
        avail_kb=$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)
        used_kb=$((total_kb - avail_kb))
        pct=$(awk "BEGIN {printf \"%.1f\", ($used_kb / $total_kb) * 100}")
        echo "$((used_kb / 1024))MB / $((total_kb / 1024))MB (${pct}% used)"
    else
        echo "Memory statistics unavailable"
    fi
}

get_disk_info() {
    if command -v df >/dev/null 2>&1; then
        local used total pct mount
        used=$(df -h / | awk 'NR==2 {print $3}')
        total=$(df -h / | awk 'NR==2 {print $2}')
        pct=$(df -h / | awk 'NR==2 {print $5}')
        mount=$(df -h / | awk 'NR==2 {print $6}')
        echo "${used} / ${total} (${pct} on ${mount})"
    else
        echo "Disk statistics unavailable"
    fi
}

get_ip_address() {
    if command -v hostname >/dev/null 2>&1 && hostname -I >/dev/null 2>&1; then
        hostname -I | awk '{print $1}'
    elif command -v ip >/dev/null 2>&1; then
        ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}' || echo "127.0.0.1"
    else
        echo "127.0.0.1"
    fi
}

# --- Output Dispatcher ---
main() {
    local json_output=false
    if [[ "${1:-}" == "--json" ]]; then
        json_output=true
    fi

    local os kernel host user uptime cpu cores ram disk ip
    os=$(get_os_info)
    kernel=$(get_kernel)
    host=$(get_hostname)
    user=$(get_user)
    uptime=$(get_uptime)
    cpu=$(get_cpu_model)
    cores=$(get_cpu_cores)
    ram=$(get_ram_info)
    disk=$(get_disk_info)
    ip=$(get_ip_address)

    if [[ "$json_output" == true ]]; then
        cat << EOF
{
  "hostname": "$host",
  "user": "$user",
  "os": "$os",
  "kernel": "$kernel",
  "uptime": "$uptime",
  "cpu_model": "$cpu",
  "cpu_cores": $cores,
  "ram_usage": "$ram",
  "disk_usage": "$disk",
  "ip_address": "$ip",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
        exit 0
    fi

    print_banner
    echo -e "${YELLOW}${BOLD}▶ SYSTEM IDENTITY${RESET}"
    format_row "Hostname" "$host"
    format_row "Current User" "$user"
    format_row "Operating System" "$os"
    format_row "Kernel Release" "$kernel"
    format_row "System Uptime" "$uptime"
    format_row "Primary IPv4" "$ip"
    echo ""

    echo -e "${YELLOW}${BOLD}▶ HARDWARE & RESOURCE CAPACITY${RESET}"
    format_row "Processor (CPU)" "$cpu"
    format_row "CPU Threads / Cores" "$cores logical cores"
    format_row "Physical Memory" "$ram"
    format_row "Root Disk Space" "$disk"
    echo ""

    echo -e "${DIM}Report generated on $(date '+%Y-%m-%d %H:%M:%S %Z') | DeveloperPortfolio Toolkit${RESET}"
    echo ""
}

main "$@"
