#!/bin/bash
set -e

# ============================================
# MBPP Properties — VPS Setup Script
# Contabo VPS 20 | Ubuntu 24.04
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC}  $1"; }
info() { echo -e "${CYAN}[...]${NC} $1"; }

echo "============================================"
echo " MBPP Properties — VPS Automated Setup"
echo " Contabo VPS 20  |  Ubuntu 24.04"
echo " $(date)"
echo "============================================"

# ---- Phase 1: System Update & Essentials ----
info "Updating system packages..."
apt update -qq && apt upgrade -y -qq
apt install -y -qq curl wget git ufw fail2ban unzip htop

# ---- Create mbpp user if not exists ----
if ! id -u mbpp &>/dev/null; then
    info "Creating mbpp user..."
    useradd -m -s /bin/bash -G sudo mbpp
    echo "mbpp:mbpp2026!" | chpasswd
    usermod -aG sudo mbpp
    mkdir -p /home/mbpp/.ssh
    cp /root/.ssh/authorized_keys /home/mbpp/.ssh/ 2>/dev/null || true
    chown -R mbpp:mbpp /home/mbpp/.ssh
    log "User mbpp created"
else
    info "User mbpp already exists — skipping"
fi

# ---- Firewall ----
ufw --force reset >/dev/null 2>&1
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
log "UFW firewall active (ports 22, 80, 443)"

# ---- Fail2ban ----
systemctl enable fail2ban --now 2>/dev/null || true
log "fail2ban running"

# ---- Phase 2: Node.js 22 ----
if ! command -v node &>/dev/null; then
    info "Installing Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install nodejs -y -qq
    log "Node.js $(node --version)"
else
    info "Node.js $(node --version) already installed"
fi

# ---- PM2 ----
if ! command -v pm2 &>/dev/null; then
    info "Installing PM2..."
    npm install -g pm2
    log "PM2 $(pm2 --version)"
else
    info "PM2 $(pm2 --version) already installed"
fi

# ---- Nginx ----
if ! command -v nginx &>/dev/null; then
    info "Installing Nginx..."
    apt install nginx -y -qq
fi
systemctl enable nginx --now
log "Nginx $(nginx -v 2>&1 | cut -d'/' -f2)"

# ---- Phase 3: PostgreSQL 16 ----
if ! command -v psql &>/dev/null; then
    info "Installing PostgreSQL 16..."
    apt install -y -qq postgresql-common
    /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
    apt install postgresql-16 -y -qq
    systemctl enable postgresql --now
fi
log "PostgreSQL $(psql --version | awk '{print $NF}')"

# ---- Create database if not exists ----
info "Setting up database..."
su - postgres -c "psql -tc \"SELECT 1 FROM pg_user WHERE usename='mbpp_user'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE USER mbpp_user WITH PASSWORD 'Mbpp2026!Secure';\""

su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='propease'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE DATABASE propease OWNER mbpp_user;\""

su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE propease TO mbpp_user;\""
log "Database propease ready"

# ---- Phase 4: Project Directories ----
info "Creating project directories..."
mkdir -p /var/www/mbpp/{api,frontend,bot,uploads,backups,logs}
chown -R mbpp:mbpp /var/www/mbpp
log "Directories created at /var/www/mbpp/"

# ---- Phase 5: Uploads Directory ----
info "Setting up uploads..."
mkdir -p /var/www/mbpp-uploads
chown -R mbpp:mbpp /var/www/mbpp-uploads
chmod 755 /var/www/mbpp-uploads
log "Uploads dir ready at /var/www/mbpp-uploads/"

# ---- Daily backup cron ----
info "Configuring daily backups..."
cat > /home/mbpp/backup.sh << 'BACKUP_EOF'
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR=/var/www/mbpp/backups
mkdir -p $BACKUP_DIR
pg_dump -U mbpp_user propease -Fc > $BACKUP_DIR/mbpp_$DATE.dump
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
echo "Backup done: $DATE ($(du -h $BACKUP_DIR/mbpp_$DATE.dump | cut -f1))"
BACKUP_EOF
chmod +x /home/mbpp/backup.sh
chown mbpp:mbpp /home/mbpp/backup.sh

(crontab -l 2>/dev/null | grep -v "backup.sh"; echo "0 3 * * * /home/mbpp/backup.sh >> /var/www/mbpp/logs/backup.log 2>&1") | crontab -
log "Daily backup configured (3 AM daily, 30-day retention)"

# ---- Auto-renew SSL cron ----
(crontab -l 2>/dev/null | grep -v "certbot"; echo "0 2 * * 1 certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab - 2>/dev/null || true

# ---- PM2 startup ----
info "Configuring PM2 auto-start..."
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "============================================"
echo -e " ${GREEN}VPS Setup Complete!${NC}"
echo "============================================"
echo ""
echo " Next steps:"
echo "   1. Upload project files to /var/www/mbpp/"
echo "   2. Run: bash scripts/deploy.sh"
echo ""
echo " STATUS:"
echo "   Node.js:   $(node --version)"
echo "   PM2:       $(pm2 --version)"
echo "   Nginx:     $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "   PostgreSQL: $(psql --version | awk '{print $NF}')"
echo "   Firewall:  active (22, 80, 443)"
echo "   fail2ban:  running"
echo "   Database:  propease (user: mbpp_user)"
echo "   Directory: /var/www/mbpp/"
echo ""
