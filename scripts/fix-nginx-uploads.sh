#!/bin/bash
sed -i 's|/var/www/mbpp-uploads/|/var/www/mbpp/api/uploads/|' /etc/nginx/sites-available/mbpproperties.com
nginx -t
systemctl reload nginx
echo "Nginx uploads path fixed"
