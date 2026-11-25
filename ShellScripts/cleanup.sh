#!/usr/bin/env bash
# ==============================================================================
# cleanup.sh - Developer Productivity & System Monitoring Toolkit
# Description: Safely purges temporary files, cache dirs, and old logs.
#              Includes a safety check and non-destructive --dry-run mode.
# Course Outcome: Q2 - CO2 (Bash Automation & System Administration)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Configuration
DRY_RUN=false
MAX_LOG_DAYS=14

# Parse Command Line Options
for arg in "$@"; do
    case "$arg" in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--dry-run]"
            echo "  --dry-run  Preview files to delete without modifying disk"
            exit 0
            ;;
        *)
            ;;
    esac
done

# ANSI Colors
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
    BOLD="\033[1m"
    GREEN="\033[0;32m"
    YELLOW="\033[1;33m"
    CYAN="\033[0;36m"
    RED="\033[0;31m"
    RESET="\033[0m"
else
    BOLD=""
    GREEN=""
    YELLOW=""
    CYAN=""
    RED=""
    RESET=""
fi

echo -e "${CYAN}${BOLD}=== TEMPORARY & CACHE CLEANUP UTILITY ===${RESET}"
if [[ "$DRY_RUN" == true ]]; then
    echo -e "${YELLOW}${BOLD}*** DRY RUN MODE ENABLED - NO FILES WILL BE DELETED ***${RESET}\n"
else
    echo -e "${GREEN}Live Execution Mode Active - Targeted Cleanup Proceeding...${RESET}\n"
fi

# Safety check: Protect root and critical system paths
if [[ "$TARGET_ROOT" == "/" ]] || [[ "$TARGET_ROOT" == "/home" ]] || [[ "$TARGET_ROOT" == "/etc" ]]; then
    echo -e "${RED}[FATAL] Safety abort: Cleanup target root is protected system path: $TARGET_ROOT${RESET}" >&2
    exit 1
fi

echo -e "Scanning workspace: ${BOLD}${TARGET_ROOT}${RESET}...\n"

TOTAL_ITEMS=0
TOTAL_BYTES=0

# Clean temporary extensions (.tmp, .temp, *~, .DS_Store, Thumbs.db)
cleanup_files() {
    local pattern="$1"
    local desc="$2"
    echo -e "${BOLD}Checking: ${desc} (${pattern})${RESET}"

    # Use find to locate matching files
    while IFS= read -r file; do
        if [[ -f "$file" ]]; then
            TOTAL_ITEMS=$((TOTAL_ITEMS + 1))
            local size
            size=$(wc -c < "$file" 2>/dev/null || echo 0)
            TOTAL_BYTES=$((TOTAL_BYTES + size))

            if [[ "$DRY_RUN" == true ]]; then
                echo -e "  ${YELLOW}[WOULD REMOVE]${RESET} $file (${size} bytes)"
            else
                rm -f "$file"
                echo -e "  ${GREEN}[REMOVED]${RESET} $file"
            fi
        fi
    done < <(find "$TARGET_ROOT" -type f -name "$pattern" ! -path "*/.git/*" ! -path "*/.venv/*" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/.vercel/*" 2>/dev/null || true)
}

# Clean Python caches (__pycache__, *.pyc, *.pyo)
cleanup_directories() {
    local dir_name="$1"
    local desc="$2"
    echo -e "${BOLD}Checking: ${desc} (${dir_name})${RESET}"

    while IFS= read -r dir; do
        if [[ -d "$dir" ]]; then
            TOTAL_ITEMS=$((TOTAL_ITEMS + 1))
            if [[ "$DRY_RUN" == true ]]; then
                echo -e "  ${YELLOW}[WOULD REMOVE DIR]${RESET} $dir"
            else
                rm -rf "$dir"
                echo -e "  ${GREEN}[REMOVED DIR]${RESET} $dir"
            fi
        fi
    done < <(find "$TARGET_ROOT" -type d -name "$dir_name" ! -path "*/.git/*" ! -path "*/.venv/*" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/.vercel/*" 2>/dev/null || true)
}

# Clean old log files (> MAX_LOG_DAYS days old)
cleanup_old_logs() {
    local log_dir="${SCRIPT_DIR}/logs"
    echo -e "${BOLD}Checking: Old log files in ${log_dir} (> ${MAX_LOG_DAYS} days old)${RESET}"
    if [[ -d "$log_dir" ]]; then
        while IFS= read -r old_log; do
            if [[ -f "$old_log" ]]; then
                TOTAL_ITEMS=$((TOTAL_ITEMS + 1))
                if [[ "$DRY_RUN" == true ]]; then
                    echo -e "  ${YELLOW}[WOULD REMOVE OLD LOG]${RESET} $old_log"
                else
                    rm -f "$old_log"
                    echo -e "  ${GREEN}[REMOVED OLD LOG]${RESET} $old_log"
                fi
            fi
        done < <(find "$log_dir" -type f -name "*.log" -mtime +"$MAX_LOG_DAYS" 2>/dev/null || true)
    fi
}

# Run targeted checks
cleanup_files "*.tmp" "Temporary files"
cleanup_files "*.temp" "Temporary temp files"
cleanup_files "*~" "Editor swap/backup files"
cleanup_files ".DS_Store" "macOS metadata files"
cleanup_files "Thumbs.db" "Windows thumbnail caches"
cleanup_files "*.bak" "Backup files"
cleanup_directories "__pycache__" "Python bytecode caches"
cleanup_directories ".pytest_cache" "Pytest cache directories"
cleanup_old_logs

echo ""
echo -e "${CYAN}${BOLD}=== CLEANUP SUMMARY ===${RESET}"
echo -e "Total items affected : ${BOLD}${TOTAL_ITEMS}${RESET}"
echo -e "Estimated reclaimed  : ${BOLD}$((TOTAL_BYTES / 1024)) KB${RESET}"

if [[ "$DRY_RUN" == true ]]; then
    echo -e "\n${YELLOW}To perform actual deletion, re-run without --dry-run flag:${RESET}"
    echo -e "  $0"
else
    echo -e "\n${GREEN}[COMPLETED] Workspace cleaned safely.${RESET}"
fi
echo ""
