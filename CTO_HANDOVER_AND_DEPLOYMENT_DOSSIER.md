# SIKO Eduventures — Complete CTO Production Handover & Server Deployment Dossier

> **Document Classification:** Confidential — For Technical Leadership, CTO & DevOps Engineering  
> **Platform Version:** 1.0.0 Production  
> **Live Production URL:** https://siko-eduventures.surge.sh  
> **Status:** Live, Unpaused, Verified 24/7 Edge CDN with Sectigo DV SSL  

---

## 1. Executive Summary & Delivery Manifest

This dossier provides technical leadership with everything required to audit, host, containerize, and deploy SIKO Eduventures on your private servers, cloud infrastructure (AWS / GCP / DigitalOcean / Azure), or global edge CDNs.

### Delivery Packages Available on Disk

| Package | Path | Size | Description |
|---|---|---|---|
| **Static Edge CDN Bundle** | `C:\Users\rakes\.gemini\antigravity\scratch\siko-static-production-bundle.zip` | 2.14 MB | Self-contained, zero-dependency production bundle (`index.html`, `200.html`, `assets/teachers/`). Ready for instant deployment to Nginx, AWS S3/CloudFront, Cloudflare Pages, Netlify, or Vercel. |
| **Full-Stack Enterprise Codebase** | `C:\Users\rakes\.gemini\antigravity\scratch\siko-fullstack-production-codebase.zip` | 15.25 MB | Full repository including FastAPI REST backend, SQLite pre-seeded DB (`siko.db`), Dockerfile, Docker Compose, Nginx config, Systemd unit, modular ES6 frontend, and documentation. |
| **Live Standalone Entrypoint** | `C:\Users\rakes\.gemini\antigravity\scratch\index.html` | 2.89 MB | Fully bundled standalone production application with inlined CSS design system and high-res faculty photography. |

---

## 2. System Architecture & Tech Stack

### Technology Matrix

| Layer | Technology | Specifications & Rationale |
|---|---|---|
| **Frontend Framework** | Pure Vanilla ES6+ Modular Components | Zero heavy framework overhead (no React/Vue hydration lag). First Contentful Paint < 0.4s. Instant routing. |
| **Design System** | Tailwind CSS + Custom SIKO Design Tokens | High-contrast accessible color palette, fluid responsive scales, dark-mode classroom interface. |
| **Backend API** | FastAPI + Uvicorn ASGI Server | High-concurrency async Python (Python 3.11+). Auto-generates Swagger (`/docs`) and ReDoc (`/redoc`). |
| **Database** | SQLite 3 / PostgreSQL 15+ | 40 normalized relational tables managed via SQLAlchemy 2.0 ORM. Instant switch via single `DATABASE_URL` variable. |
| **Containerization** | Docker + Docker Compose | Multi-stage lightweight Linux container with health check endpoint (`/health`). |
| **Web Server / SSL** | Nginx Reverse Proxy + Let's Encrypt Certbot | Gzip/Brotli compression, HTTP/2, WebSocket proxying, security headers (CSP, HSTS, X-Frame-Options). |

---

## 3. Server Deployment Options for the CTO

### Option A: Docker Compose (Recommended for Cloud VPS / AWS EC2 / DigitalOcean)

Deploy the complete stack (FastAPI backend + Nginx reverse proxy + database) in under 2 minutes:

1. **Copy or extract the codebase to your server**:
   ```bash
   scp siko-fullstack-production-codebase.zip user@your-server-ip:/opt/
   cd /opt
   unzip siko-fullstack-production-codebase.zip -d siko-platform
   cd /opt/siko-platform/siko-app
   ```

2. **Configure Environment Secrets**:
   ```bash
   cp .env.production .env
   nano .env
   ```
   *(Update `SECRET_KEY`, `CORS_ORIGINS`, and Razorpay keys as outlined in Section 5)*

3. **Launch the Container**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   *Or execute via standard Docker Compose:*
   ```bash
   docker compose up -d --build
   ```

4. **Verify Health**:
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status":"healthy","version":"1.0.0","service":"SIKO Production API"}
   ```

---

### Option B: Bare-Metal Ubuntu 22.04 / 24.04 (Systemd + Nginx + Certbot)

For high-performance bare-metal environments:

1. **Install Prerequisites**:
   ```bash
   sudo apt update && sudo apt install -y python3 python3-pip python3-venv sqlite3 nginx certbot python3-certbot-nginx
   ```

2. **Setup Application & Virtual Environment**:
   ```bash
   sudo mkdir -p /var/www/siko-platform
   sudo chown -R $USER:$USER /var/www/siko-platform
   # Unzip siko-fullstack-production-codebase.zip into /var/www/siko-platform
   cd /var/www/siko-platform/siko-app/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Initialize Database Tables & Seed Data**:
   ```bash
   python -c "from database import create_tables; create_tables(); from seed import seed_database; seed_database()"
   ```

4. **Install and Enable Systemd Service**:
   ```bash
   sudo cp /var/www/siko-platform/siko-app/siko.service /etc/systemd/system/siko.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now siko
   sudo systemctl status siko
   ```

5. **Configure Nginx**:
   ```bash
   sudo cp /var/www/siko-platform/siko-app/nginx.conf /etc/nginx/sites-available/siko
   sudo ln -s /etc/nginx/sites-available/siko /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl reload nginx
   ```

6. **Bind SSL Certificate via Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### Option C: Instant Static Hosting (AWS S3 + CloudFront / Cloudflare Pages / Vercel / Netlify)

If your architecture uses decoupled static frontends:

1. Extract `siko-static-production-bundle.zip`.
2. Upload the root files (`index.html`, `200.html`, and `assets/`) to your bucket or Git repository.
3. Configure SPA Routing fallback: Set Error Document / 404 Rewrite to `200.html` or `index.html`.
4. Deploy — zero runtime dependencies or build steps required.

---

## 4. Git & GitHub Repository Setup Guide

To push this codebase to your organization's GitHub repository:

```bash
# 1. Navigate to the codebase directory
cd C:\Users\rakes\.gemini\antigravity\scratch

# 2. Initialize Git
git init -b main

# 3. Create .gitignore
cat << 'EOF' > .gitignore
# Environments & Caches
__pycache__/
*.py[cod]
*$py.class
venv/
.env
.env.local

# Test & Debug Directories
chrome_*/
temp_*/
test_dbg/
*.log

# System Files
.DS_Store
Thumbs.db
EOF

# 4. Stage and commit all core files
git add siko-app/ siko-frontend/ index.html bundle_v2.py sync_and_bundle.py assets/
git commit -m "feat: initial release of SIKO Eduventures v1.0.0 production platform"

# 5. Link to your company GitHub repository
git remote add origin https://github.com/YOUR_ORGANIZATION/siko-eduventures.git

# 6. Push to main branch
git push -u origin main
```

---

## 5. Environment Variables & Production Secrets Reference

Below is the standard `.env.production` file specification:

```ini
# ==============================================================================
# SIKO PRODUCTION ENVIRONMENT CONFIGURATION
# ==============================================================================

# Server & Application
APP_ENV=production
DEBUG=false
SECRET_KEY=generate_a_64_character_hex_key_for_jwt_signing
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (Default SQLite or PostgreSQL)
# For SQLite (Built-in zero-config):
DATABASE_URL=sqlite:///./siko.db

# For PostgreSQL Enterprise:
# DATABASE_URL=postgresql://siko_admin:SecurePassword123@localhost:5432/siko_production

# Payment Gateway (Razorpay Route)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_verification_secret
RAZORPAY_ACCOUNT_NUMBER=acc_xxxxxxxxxxxxxx

# Media & Storage (AWS S3 / Cloudflare R2)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=siko-production-assets

# Email & SMS Gateway
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMS_GATEWAY_API_KEY=your_msg91_or_gupshup_key
```

---

## 6. Pre-Seeded Accounts & Demo Credentials

The platform includes full role-based access control (RBAC). The database (`siko.db`) is pre-seeded with verified test personas:

| Persona | Email | Password | Access & Responsibilities |
|---|---|---|---|
| **Admin / CFO** | `admin@siko.demo` | `demo123` | CFO ledger, SIKO platform commission tracking, faculty onboarding approvals, system telemetry. |
| **Teacher (Master Faculty)** | `teacher@siko.demo` | `demo123` | Dr. Ananya Sharma (Ph.D. Physics, IIT Delhi). Schedule management, live classroom tools, 50/25/25 milestone wallet. |
| **Student** | `student@siko.demo` | `demo123` | Riya Sharma (Class 11 CBSE / JEE). Dynamic timetable, homework submissions, diagnostic tests, live classroom. |
| **Parent** | `parent@siko.demo` | `demo123` | Executive child performance summary, PTM slot confirmation, progressive diagnostic drill-down. |

---

## 7. Mathematical Invariants & Business Logic

The CTO and backend engineers must maintain these non-negotiable core invariants:

### 1. Revenue Reconciliation Identity
$$\text{Student Fee} \equiv \text{Teacher Payout Pool} + \text{SIKO Platform Commission}$$

### 2. Milestone Escrow Release Waterfall (Teacher Payout Pool = 100%)
- **Milestone 1 (50% Release):** Released upon verified completion of 90% live classroom lecture hours.
- **Milestone 2 (25% Release):** Released upon student homework & chapter test evaluation submission.
- **Milestone 3 (25% Release):** Released upon 1-on-1 PTM completion and parent acknowledgment.

### 3. Commission Architecture
- **1-on-1 Mentorship:**
  - *Master Tier:* 18% Platform Commission (82% Teacher Pool)
  - *Expert Tier:* 22% Platform Commission (78% Teacher Pool)
  - *Senior Tier:* 25% Platform Commission (75% Teacher Pool)
  - *Pro Tier:* 28% Platform Commission (72% Teacher Pool)
- **Smart Batches (Max 30 Students):** Fixed 50% Platform Commission (50% Teacher Pool).

### 4. Progressive Disclosure UI Rules (Parent Persona)
- **Executive Digest (Default):** Surfaces only 4 core child indicators (Recent Exam Score, Attendance, Homework, Step Presentation), friendly educator remark, and 1-on-1 PTM slot with 1-click confirmation.
- **Deep-Dive Diagnostic (On Demand):** Question-by-question breakdown, Bloom's cognitive taxonomy bars, and handwriting rubric are collapsed under an explicit toggle (`toggleFullDetailedParentReport()`).
- **Contact Details:** Captures parent name, phone, and email at booking (Step 1) and preserves them in `AppState.parentData`.
