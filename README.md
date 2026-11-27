# LAUGH TALE by UNTOLD — Event Ticketing Platform

> **Event Date:** Sunday, December 06, 2026 · 12:00 PM – 6:00 PM  
> **Venue:** Pawffe, 2-91, Beach Rd, Gudla Vani Palem, Sagar Nagar, Endada, Vizag, Andhra Pradesh 530045  
> **Ticket Price:** ₹349 (Early Bird Tier)

---

## 🏴‍☠️ Project Overview
This is the official event ticketing website for **LAUGH TALE** (by UNTOLD), built with Next.js (App Router), Tailwind CSS, **PhonePe Payment Gateway (UPI, GPay, PhonePe, Cards, Netbanking)**, Resend/SMTP email automation, and real-time Google Sheets backup.

The frontend is pixel-perfect refactored from **Google Stitch** (Screen: `Laugh Tale - Editorial Landing Page`, Project ID: `3228457312249444551`).

---

## ⚡ Features Built

1. **Stitch Editorial Design Preserved**:
   - Monolithic cinematic typography (`Cinzel`, `Instrument Serif`, `Space Mono`, `Plus Jakarta Sans`, `Bebas Neue`).
   - Dark aesthetic, glowing atmospheric background radial gradients, and glassmorphism.
   - Synchronized live countdown timer to Sunday, Dec 06.
   - Running marquee ticker and high-impact center billboard.

2. **Checkout & Attendee Modal**:
   - Opens on clicking "Claim Your Bounty" / "Buy Pass (₹349)" / "Get Pass".
   - Collects: Full Name, Email Address, WhatsApp Phone, and Pass Quantity (1–10).
   - Live real-time pricing calculation: `Quantity × ₹349`.

3. **Payment Gateway Integration (PhonePe PG)**:
   - `POST /api/create-order`: Generates PhonePe standard checkout request with SHA-256 `X-VERIFY` checksum.
   - `GET / POST /api/phonepe/callback`: Validates PhonePe S2S/redirect callback with PhonePe Server Status API.
   - `POST /api/verify-payment`: Direct verification endpoint with Sandbox simulation mode.
   - Generates unique Pass ID (e.g., `LT-7KP2`).
   - Dedicated Ticket Confirmation screen at `/ticket/[passId]`.

4. **Automated Dual-Email Dispatch**:
   - Immediately triggers two emails upon payment confirmation via **Resend** (or business SMTP via **Nodemailer**):
     - **To Buyer:** Ticket confirmation, Pass ID, event logistics, house rules, and QR protocol.
     - **To Organizer (`ORGANIZER_EMAIL`):** Real-time booking lead notification with full attendee info.

5. **Attendee List Backup & Reporting**:
   - **Offline/Server Backup:** Saved atomically in `data/attendees.json`.
   - **Google Sheets Webhook:** Appends rows to your live Google Sheet using `google-sheets-script.js`.
   - **Admin API:** `GET /api/attendees` exposes total revenue, pass counts, and attendee roster.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your PhonePe credentials:
```env
# PhonePe Credentials (from PhonePe Merchant Dashboard)
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=UAT # Switch to PROD when going live

# Email Service (Resend or SMTP)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Laugh Tale <onboarding@resend.dev>

# Organizer Email Notification
ORGANIZER_EMAIL=untold@untoldentertainments.in

# Google Sheet Webhook (Optional)
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec

# Application Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing PhonePe Payments

1. **Local Sandbox Mode (Without Keys):**
   - If keys are left empty in `.env.local`, the site automatically runs in safe sandbox simulation, instantly issuing a valid `LT-XXXX` pass and logging mock email dispatches.
2. **PhonePe UAT / Sandbox Mode (With Test Keys):**
   - Set `PHONEPE_ENV=UAT` in `.env.local`.
   - Enter your PhonePe UAT Merchant ID and Salt Key.
   - PhonePe will open the standard PhonePe test checkout page where you can pay via test UPI or simulated card.
   - Upon success, PhonePe redirects back to `/ticket/[passId]`.
3. **Live Production Mode:**
   - Change `PHONEPE_ENV=PROD`.
   - Enter your PhonePe Production Merchant ID & Salt Key.
   - Set `NEXT_PUBLIC_BASE_URL` to your live domain (e.g., `https://your-domain.vercel.app`).

---

## 📊 Setting Up Google Sheets Master List

1. Create a Google Sheet named **Laugh Tale Attendees**.
2. Put the following headers in Row 1:
   `Timestamp | Pass ID | Name | Email | Phone | Quantity | Amount Paid | Payment ID | Order ID | Status | Venue`
3. Click **Extensions > Apps Script**, paste the contents of `google-sheets-script.js`, and click **Deploy > New Deployment**.
4. Set **Who has access** to **Anyone**, copy the Web App URL, and paste it into `GOOGLE_SHEET_WEBHOOK_URL` in `.env.local`.
