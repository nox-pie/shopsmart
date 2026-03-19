#!/bin/bash

# ==========================================
# Idempotent Deployment Script for ShopSmart
# ==========================================
set -e # Exit on any failure

echo "[INFO] Starting deployment process..."

# 1. Idempotent Repository Setup
TARGET_DIR="$HOME/shopsmart"
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "[INFO] Pulling latest code..."
git pull origin main || echo "[WARN] Git pull failed, but continuing..."

# 2. Idempotent Backend Setup
echo "[INFO] Setting up backend..."
cd server
npm ci --prefer-offline --no-audit

# Safely start/restart PM2 process idempotently
if command -v pm2 > /dev/null; then
    if pm2 status | grep -q "shopsmart-backend"; then
        echo "[INFO] Restarting existing backend service..."
        pm2 restart shopsmart-backend
    else
        echo "[INFO] Starting new backend service..."
        pm2 start src/index.js --name "shopsmart-backend"
    fi
else
    echo "[WARN] PM2 is not installed globally. Could not restart backend."
fi

# 3. Idempotent Frontend Setup
echo "[INFO] Setting up frontend..."
cd ../client
npm ci --prefer-offline --no-audit
npm run build

echo "[INFO] Deploying frontend to web root..."
WEB_ROOT="/var/www/shopsmart/client"
sudo mkdir -p "$WEB_ROOT"
# Safely clear old build assets and move new ones
sudo rm -rf "$WEB_ROOT/dist"
sudo cp -r dist "$WEB_ROOT/"

# 4. Idempotent Service Restart
echo "[INFO] Reloading Nginx..."
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
else
    echo "[WARN] Nginx is not running or installed."
fi

echo "[INFO] Deployment complete!"
exit 0
