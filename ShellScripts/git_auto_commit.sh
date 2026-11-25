#!/usr/bin/env bash
# ==============================================================================
# git_auto_commit.sh - Developer Productivity & System Monitoring Toolkit
# Description: Stages changes and commits with a structured timestamped message;
#              optionally pushes to the current upstream branch.
# Course Outcome: Q2 - CO2 (Bash Automation & System Administration)
# ==============================================================================

set -euo pipefail

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

DO_PUSH=false
CUSTOM_MSG=""

# Parse Options
while [[ $# -gt 0 ]]; do
    case "$1" in
        --push|-p)
            DO_PUSH=true
            shift
            ;;
        -m|--message)
            CUSTOM_MSG="${2:-}"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [-m \"custom message\"] [--push]"
            echo "  -m, --message  Custom commit message prefix"
            echo "  --push, -p     Automatically push commits to remote upstream"
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

echo -e "${CYAN}${BOLD}=== GIT AUTO-STAGE & COMMIT TOOLKIT ===${RESET}"

# Verify Git is installed
if ! command -v git >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Git executable not found on PATH.${RESET}" >&2
    exit 1
fi

# Verify current directory is in a Git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Current directory is not a Git repository.${RESET}" >&2
    exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Check for modified or untracked files
CHANGED_FILES="$(git status --porcelain)"

if [[ -z "$CHANGED_FILES" ]]; then
    echo -e "${GREEN}[OK] Working directory clean. No changes to commit.${RESET}"
    exit 0
fi

echo -e "Target Repository: ${BOLD}${REPO_ROOT}${RESET}"
echo -e "\n${YELLOW}Detected Changes:${RESET}"
echo "$CHANGED_FILES" | sed 's/^/  /'
echo ""

# Stage all changes
echo -e "${CYAN}Staging changes with 'git add -A'...${RESET}"
git add -A

# Construct timestamped commit message
TIMESTAMP="$(date +"%Y-%m-%d %H:%M:%S")"
if [[ -n "$CUSTOM_MSG" ]]; then
    COMMIT_MSG="${CUSTOM_MSG} (${TIMESTAMP})"
else
    COMMIT_MSG="chore(auto): backup snapshot ${TIMESTAMP}"
fi

# Commit staged changes
echo -e "Committing with message: ${BOLD}\"${COMMIT_MSG}\"${RESET}"
git commit -m "$COMMIT_MSG"

COMMIT_HASH="$(git rev-parse --short HEAD)"
echo -e "${GREEN}[SUCCESS] Committed successfully [${COMMIT_HASH}]${RESET}"

# Optional push to remote
if [[ "$DO_PUSH" == true ]]; then
    CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
    echo -e "\n${CYAN}Pushing changes to remote branch: ${BOLD}${CURRENT_BRANCH}${RESET}..."
    if git push origin "$CURRENT_BRANCH" 2>/dev/null || git push; then
        echo -e "${GREEN}[SUCCESS] Pushed to remote repository!${RESET}"
    else
        echo -e "${YELLOW}[WARNING] Could not push to remote. Verify remote configuration with 'git remote -v'.${RESET}"
    fi
else
    echo -e "${YELLOW}Notice: Run with '--push' or '-p' to automatically push to remote.${RESET}"
fi
echo ""
