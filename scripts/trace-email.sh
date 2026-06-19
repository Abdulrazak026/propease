#!/bin/bash
echo "=== Trace MX delivery path for mbpproperties.com ==="
echo "1. MX resolves to:"
dig +short mx mbpproperties.com
echo ""
echo "2. mail.mbpproperties.com resolves to:"
dig +short mail.mbpproperties.com
echo ""
echo "3. SMTP test on port 587:"
echo "QUIT" | timeout 3 openssl s_client -starttls smtp -connect 51.89.113.223:587 2>&1 | grep -E "220|Connec|refused|timeout"
echo ""
echo "4. Checking if there's a secondary mail server (Amazon SES):"
dig +short mx send.mbpproperties.com
