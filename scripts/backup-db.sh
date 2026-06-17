#!/bin/bash
# ============================================
# MBPP Properties — Database Backup
# Runs daily at 3 AM via cron
# ============================================

DATE=$(date +%Y-%m-%d)
BACKUP_DIR=/var/www/mbpp/backups
mkdir -p $BACKUP_DIR

pg_dump -U mbpp_user propease -Fc > $BACKUP_DIR/mbpp_$DATE.dump

# Keep last 30 days
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete

echo "Backup complete: mbpp_$DATE.dump ($(du -h $BACKUP_DIR/mbpp_$DATE.dump | cut -f1))"
