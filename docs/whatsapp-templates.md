# ============================================
# WhatsApp Business API Message Templates
# Submit these for Meta approval via:
# Meta Developer Portal -> WhatsApp -> Message Templates
# ============================================

# These templates are used for proactive messages (initiated by the business)
# Interactive messages (buttons/lists) within the 24-hour window DON'T need templates

# ============================================
# TEMPLATE 1: Welcome Message
# ============================================
# Category: Marketing
# Language: English
# Content:
#   "Welcome to MBPP Properties! 🏠
#
#   We're a real estate company based in Kano, Nigeria. We help people find verified properties to buy, rent, and sell.
#
#   Reply with one of these options:
#   1️⃣ Buy a property
#   2️⃣ Rent a property
#   3️⃣ Sell your property
#   4️⃣ Become an agent
#   5️⃣ Talk to support"

# ============================================
# TEMPLATE 2: New Listing Alert
# ============================================
# Category: Marketing
# Language: English
# Content:
#   "🏠 New listing! {{1}} in {{2}} for {{3}}
#   {{4}} bedrooms, {{5}} bathrooms
#   💰 {{6}}
#
#   View: {{7}}"

# Variables:
#   {{1}} = property_type (House, Flat, etc.)
#   {{2}} = location
#   {{3}} = listing_type (sale/rent)
#   {{4}} = bedrooms
#   {{5}} = bathrooms
#   {{6}} = price
#   {{7}} = listing URL

# ============================================
# TEMPLATE 3: Viewing Reminder
# ============================================
# Category: Utility
# Language: English
# Content:
#   "📅 Reminder: Your viewing of {{1}} is tomorrow at {{2}}.
#
#   📍 Location: {{3}}
#   👤 Agent: {{4}}
#
#   Reply CONFIRM to confirm or CANCEL to reschedule."

# Variables:
#   {{1}} = listing title
#   {{2}} = viewing time
#   {{3}} = address
#   {{4}} = agent name

# ============================================
# TEMPLATE 4: Inquiry Response
# ============================================
# Category: Utility
# Language: English
# Content:
#   "💬 Our team has responded to your inquiry about {{1}}:
#
#   {{2}}
#
#   Questions? Reply to this message."

# Variables:
#   {{1}} = listing title
#   {{2}} = response text

# ============================================
# TEMPLATE 5: Price Drop Alert
# ============================================
# Category: Marketing
# Language: English
# Content:
#   "📉 Price drop! {{1}} in {{2}} was {{3}}, now {{4}}
#   Save {{5}}!
#
#   View: {{6}}"

# Variables:
#   {{1}} = listing title
#   {{2}} = location
#   {{3}} = old price
#   {{4}} = new price
#   {{5}} = amount saved
#   {{6}} = listing URL

# ============================================
# Steps to Submit Templates:
# ============================================
# 1. Go to Meta Business Suite -> WhatsApp Manager
# 2. Go to your WhatsApp Business Account
# 3. Click "Message Templates"
# 4. Click "Create Template"
# 5. Fill in:
#    - Name: (use names above)
#    - Category: Marketing/Utility
#    - Language: English
#    - Content: (copy from above)
#    - Variables: {{1}}, {{2}}, etc.
# 6. Submit for review
# 7. Wait for approval (usually 1-3 days)
# 8. Test by sending via the template message API

# ============================================
# Important Notes:
# ============================================
# - Buttons and lists DON'T need templates (sent within 24hr window)
# - Service conversations (replies to users) are FREE
# - Template messages (proactive notifications) cost ~$0.001 each
# - Marketing templates need "Marketing" category
# - Utility templates need "Utility" category
# - Templates are approved per language
# - You can have up to 256 templates per WhatsApp Business Account
