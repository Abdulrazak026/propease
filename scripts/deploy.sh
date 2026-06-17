#!/bin/bash
set -e

# ============================================
# MBPP Properties — Deploy Script
# Run after uploading new code to /var/www/mbpp/
# ============================================

cd /var/www/mbpp

echo "=== Deploying Backend (Express API) ==="
cd /var/www/mbpp/api
npm ci --omit=dev 2>/dev/null || npm ci
npx prisma generate
npm run build
npx prisma migrate deploy
echo "Backend built."

echo ""
echo "=== Deploying Frontend (Next.js) ==="
cd /var/www/mbpp/frontend
npm ci --omit=dev 2>/dev/null || npm ci
npm run build
echo "Frontend built."

echo ""
echo "=== Deploying Bot (WhatsApp) ==="
cd /var/www/mbpp/bot
npm ci --omit=dev 2>/dev/null || npm ci && npm run build 2>/dev/null
echo "Bot built."

echo ""
echo "=== Restarting All Services ==="
pm2 start /var/www/mbpp/ecosystem.config.js 2>/dev/null || pm2 reload all
pm2 save

echo ""
echo "=== Reloading Nginx ==="
nginx -t && systemctl reload nginx

echo ""
echo "============================================"
echo " Deploy Complete!"
echo "============================================"
pm2 status
