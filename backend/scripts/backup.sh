#!/bin/sh
# Database backup script — run via Railway cron or manually
# Usage: sh scripts/backup.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.sql.gz"
BACKUP_DIR="/tmp/backups"

mkdir -p "$BACKUP_DIR"

echo "[BACKUP] Starting backup: ${FILENAME}"
echo "[BACKUP] Dumping database..."

pg_dump "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${FILENAME}"

SIZE=$(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1)
echo "[BACKUP] Created ${FILENAME} (${SIZE})"

# Upload to R2 if configured
if [ -n "$R2_ACCOUNT_ID" ] && [ -n "$R2_ACCESS_KEY_ID" ] && [ -n "$R2_BACKUP_BUCKET" ]; then
  echo "[BACKUP] Uploading to R2 bucket: ${R2_BACKUP_BUCKET}"
  node /app/scripts/upload-to-r2.js "${BACKUP_DIR}/${FILENAME}" "backups/${FILENAME}"
  echo "[BACKUP] Uploaded to R2"
fi

# Keep last 7 local backups
ls -t "${BACKUP_DIR}"/backup_*.sql.gz | tail -n +8 | xargs rm -f 2>/dev/null || true
echo "[BACKUP] Complete: ${FILENAME}"
