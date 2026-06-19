#!/bin/bash
echo "=== Testing inbound email to dev@mbpproperties.com ==="

# Try TLS SMTP (port 587)
echo "EHLO mbpproperties.com" | timeout 5 openssl s_client -starttls smtp -connect 51.89.113.223:587 -quiet 2>/dev/null | head -5
echo "Exit: $?"
