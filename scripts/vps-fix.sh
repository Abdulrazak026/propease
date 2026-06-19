#!/bin/bash
set -e

# One-time fix: clone repo, restructure VPS, make auto-deploy work
cd /var/www

# 1. Clone repo to a temp location
rm -rf /tmp/mbpp-repo
git clone https://github.com/Abdulrazak026/propease.git /tmp/mbpp-repo

# 2. Backup current api and bot
cp -r /var/www/mbpp/api /var/www/mbpp/api-backup-$(date +%s) 2>/dev/null || true
cp -r /var/www/mbpp/bot /var/www/mbpp/bot-backup-$(date +%s) 2>/dev/null || true

# 3. Copy backend -> api
rsync -a --delete --exclude=node_modules --exclude=dist /tmp/mbpp-repo/backend/ /var/www/mbpp/api/

# 4. Copy frontend (src/, next.config, package.json, public/ etc)
rsync -a --delete \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=backend \
  --exclude=bot \
  --exclude=ecosystem.config.js \
  --exclude=backups \
  --exclude=uploads \
  --exclude=logs \
  --exclude='*.tar.gz' \
  --exclude='*.dump' \
  /tmp/mbpp-repo/ /var/www/mbpp/frontend/

# 5. Copy bot
rsync -a --delete --exclude=node_modules --exclude=dist /tmp/mbpp-repo/bot/ /var/www/mbpp/bot/

# 6. Copy deploy scripts and ecosystem config
cp /tmp/mbpp-repo/scripts/deploy.sh /var/www/mbpp/scripts/deploy.sh 2>/dev/null || true
cp /tmp/mbpp-repo/ecosystem.config.js /var/www/mbpp/ecosystem.config.js 2>/dev/null || true

# 7. Init git repo at /var/www/mbpp for future deploys
cd /var/www/mbpp
git init
git remote add origin https://github.com/Abdulrazak026/propease.git
git fetch origin master
git reset --hard origin/master

# 8. Cleanup
rm -rf /tmp/mbpp-repo

echo "=== Repo cloned and structured ==="
echo "Now run: bash scripts/deploy.sh"
