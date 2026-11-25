#!/usr/bin/env bash
# ==============================================================================
# menu.sh - Developer Productivity & System Monitoring Toolkit
# Description: Colorful interactive text menu launching all automation scripts.
# Course Outcome: Q2 - CO2 (Bash Automation & System Administration)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ANSI Color Codes
BOLD="\033[1m"
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
MAGENTA="\033[0;35m"
BLUE="\033[0;34m"
RED="\033[0;31m"
RESET="\033[0m"

clear_screen() {
    clear 2>/dev/null || printf "\033c"
}

pause_prompt() {
    echo ""
    echo -e "${DIM:-}Press [Enter] to return to the menu...${RESET}"
    read -r
}

display_header() {
    clear_screen
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════════════╗
║               DEVELOPER PRODUCTIVITY & MONITORING TOOLKIT                ║
║                 Interactive Automation & Administration Menu             ║
╚══════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${RESET}"
}

show_menu() {
    display_header
    echo -e "${BOLD}Select an operation to execute:${RESET}\n"
    echo -e "  ${GREEN}[1]${RESET} ${BOLD}System Information${RESET}      - Formatted CPU, RAM, OS, & Uptime report"
    echo -e "  ${GREEN}[2]${RESET} ${BOLD}Resource Monitor${RESET}        - Check CPU/RAM/Disk thresholds & log"
    echo -e "  ${GREEN}[3]${RESET} ${BOLD}Automated Backup${RESET}        - Timestamped tar.gz archive (rotation of 5)"
    echo -e "  ${GREEN}[4]${RESET} ${BOLD}Safe Cleanup (Dry Run)${RESET}  - Preview temporary file & cache purging"
    echo -e "  ${GREEN}[5]${RESET} ${BOLD}Safe Cleanup (Execute)${RESET}  - Purge temporary files & cache dirs"
    echo -e "  ${GREEN}[6]${RESET} ${BOLD}Git Auto-Commit${RESET}         - Stage & commit with snapshot timestamp"
    echo -e "  ${GREEN}[7]${RESET} ${BOLD}View Monitor Logs${RESET}       - Inspect recent entries in logs/monitor.log"
    echo -e "  ${RED}[0]${RESET} ${BOLD}Exit Toolkit${RESET}\n"
}

run_action() {
    local choice="$1"
    case "$choice" in
        1)
            echo -e "\n${CYAN}--- Running System Information Report ---${RESET}\n"
            bash "${SCRIPT_DIR}/system_info.sh"
            pause_prompt
            ;;
        2)
            echo -e "\n${CYAN}--- Running Resource Health Monitor ---${RESET}\n"
            bash "${SCRIPT_DIR}/resource_monitor.sh" || true
            pause_prompt
            ;;
        3)
            echo -e "\n${CYAN}--- Running Automated Backup ---${RESET}\n"
            bash "${SCRIPT_DIR}/backup.sh"
            pause_prompt
            ;;
        4)
            echo -e "\n${CYAN}--- Running Cleanup in Dry-Run Mode ---${RESET}\n"
            bash "${SCRIPT_DIR}/cleanup.sh" --dry-run
            pause_prompt
            ;;
        5)
            echo -e "\n${YELLOW}Are you sure you want to proceed with live cleanup? [y/N]: ${RESET}"
            read -r confirm
            if [[ "$confirm" =~ ^[Yy]$ ]]; then
                bash "${SCRIPT_DIR}/cleanup.sh"
            else
                echo -e "${YELLOW}Cleanup canceled.${RESET}"
            fi
            pause_prompt
            ;;
        6)
            echo -e "\n${CYAN}Enter custom commit message (or press [Enter] for auto-timestamp):${RESET}"
            read -r user_msg
            if [[ -n "$user_msg" ]]; then
                bash "${SCRIPT_DIR}/git_auto_commit.sh" -m "$user_msg"
            else
                bash "${SCRIPT_DIR}/git_auto_commit.sh"
            fi
            pause_prompt
            ;;
        7)
            echo -e "\n${CYAN}--- Recent Resource Monitor Log Entries ---${RESET}\n"
            if [[ -f "${SCRIPT_DIR}/logs/monitor.log" ]]; then
                tail -n 25 "${SCRIPT_DIR}/logs/monitor.log"
            else
                echo -e "${YELLOW}No log entries found at ${SCRIPT_DIR}/logs/monitor.log yet.${RESET}"
            fi
            pause_prompt
            ;;
        0|q|Q|exit)
            echo -e "\n${GREEN}Thank you for using Developer Productivity Toolkit. Goodbye!${RESET}\n"
            exit 0
            ;;
        *)
            echo -e "\n${RED}Invalid option selected. Please enter a number between 0 and 7.${RESET}"
            sleep 1.5
            ;;
    esac
}

main() {
    while true; do
        show_menu
        echo -ne "${BOLD}Enter choice [0-7]: ${RESET}"
        read -r choice
        run_action "$choice"
    done
}

main "$@"
