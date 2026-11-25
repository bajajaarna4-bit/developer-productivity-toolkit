#!/usr/bin/env bash
# ==============================================================================
# backup.sh - Developer Productivity & System Monitoring Toolkit
# Description: Creates timestamped tar.gz archive of a target directory and
#              strictly retains only the last 5 backup archives (rotation policy).
# Course Outcome: Q2 - CO2 (Bash Automation & System Administration)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_SOURCE="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"
MAX_BACKUPS=5

# Parse Arguments
SOURCE_DIR="${1:-$DEFAULT_SOURCE}"
TARGET_DIR="${2:-$BACKUP_DIR}"

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

echo -e "${CYAN}${BOLD}=== AUTOMATED ARCHIVE & BACKUP MANAGER ===${RESET}"

# Validate source directory
if [[ ! -d "$SOURCE_DIR" ]]; then
    echo -e "${RED}[ERROR] Source directory does not exist: $SOURCE_DIR${RESET}" >&2
    exit 1
fi

mkdir -p "$TARGET_DIR"

TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
ARCHIVE_NAME="backup_${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${TARGET_DIR}/${ARCHIVE_NAME}"

echo -e "Source Path      : ${BOLD}${SOURCE_DIR}${RESET}"
echo -e "Destination Path : ${BOLD}${TARGET_DIR}${RESET}"
echo -e "Creating Archive : ${YELLOW}${ARCHIVE_NAME}${RESET}..."

# Create compressed tar archive excluding temp files, venv, node_modules, build artifacts, and previous backups
tar -czf "$ARCHIVE_PATH" \
    --exclude='.git' \
    --exclude='.venv' \
    --exclude='venv' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vercel' \
    --exclude='__pycache__' \
    --exclude='ShellScripts/backups' \
    --exclude='*.tar.gz' \
    -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")" 2>/dev/null || {
    # Fallback without -C if single folder
    tar -czf "$ARCHIVE_PATH" \
        --exclude='.git' \
        --exclude='.venv' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.vercel' \
        --exclude='ShellScripts/backups' \
        -C "$SOURCE_DIR" .
}

# Verify integrity
if tar -tzf "$ARCHIVE_PATH" >/dev/null 2>&1; then
    ARCHIVE_SIZE=$(ls -lh "$ARCHIVE_PATH" | awk '{print $5}')
    echo -e "${GREEN}[SUCCESS] Backup created and verified successfully!${RESET}"
    echo -e "Archive Size     : ${BOLD}${ARCHIVE_SIZE}${RESET}"
else
    echo -e "${RED}[ERROR] Archive verification failed for $ARCHIVE_PATH${RESET}" >&2
    rm -f "$ARCHIVE_PATH"
    exit 1
fi

# Retention Policy: Keep only the newest MAX_BACKUPS archives
echo -e "\n${CYAN}Enforcing Retention Policy (Max ${MAX_BACKUPS} archives)...${RESET}"

# Find backups sorted by modification time (newest first)
cd "$TARGET_DIR"
BACKUP_COUNT=$({ ls -1t backup_*.tar.gz 2>/dev/null || true; } | wc -l)

if (( BACKUP_COUNT > MAX_BACKUPS )); then
    echo -e "${YELLOW}Found ${BACKUP_COUNT} backups. Pruning oldest archives...${RESET}"
    # Select archives beyond the 5th newest
    ls -1t backup_*.tar.gz | tail -n +"$((MAX_BACKUPS + 1))" | while IFS= read -r old_archive; do
        echo -e "  - Removing deprecated archive: ${old_archive}"
        rm -f "${TARGET_DIR}/${old_archive}"
    done
    echo -e "${GREEN}Retention enforcement complete. Retained last ${MAX_BACKUPS} archives.${RESET}"
else
    echo -e "${GREEN}Total backups (${BACKUP_COUNT}) within limit (${MAX_BACKUPS}). No rotation needed.${RESET}"
fi

echo -e "\n${BOLD}Current Backups in ${TARGET_DIR}:${RESET}"
ls -lh backup_*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ", " $6 " " $7 " " $8 ")"}'
echo ""
