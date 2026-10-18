# SIKO Eduventures — Production Deployment & CTO Handover Guide

> **Confidential — For SIKO Technical Leadership & CTO**  
> **Platform Version:** 1.0.0 Production  
> **Architecture:** Full-Stack Modular SPA + FastAPI Production REST Backend + SQLite/PostgreSQL Database

---

## 1. System Architecture Overview

SIKO Eduventures is built as a production-grade, highly scalable platform supporting 5 roles:
- **Guests & Admissions:** Public course finder, teacher marketplace, smart batches, AI doubt solver, multi-subject discount enrollment wizard.
- **Students:** Learning DNA diagnostic, personalized timetable, interactive live classroom, homework & tests, adaptive topic arena.
- **Teachers / Faculty:** 5-step joining & orientation workflow, class scheduling, live teaching tools, 50/25/25 milestone escrow wallet.
- **Parents:** Live telemetry, attendance, certified faculty evaluation feedback, PTM scheduler.
- **CFO & Staff Admin:** Automated financial waterfall engine, channel-wise revenue reconciliation, batch governance, audit logs.

### Technology Stack
| Layer | Technology |
|---|---|
| **Backend API** | FastAPI (Python 3.11+), Uvicorn, SQLAlchemy 2.0 ORM |
| **Database** | SQLite (default out-of-the-box in `siko.db`) or PostgreSQL 15+ |
| **Authentication** | JWT Bearer Tokens (`python-jose`) + PBKDF2 Password Hashing |
| **Reverse Proxy** | Nginx with Gzip compression, WebSocket support & SSL termination |
| **Containerization** | Docker + Docker Compose |
| **Frontend** | Vanilla ES6+ Modular Components, Tailwind CSS, PWA Service Worker |

---

## 2. Quickstart Deployment (Under 2 Minutes)

### Option A: Using Docker Compose (Recommended)

1. Clone or copy the `siko-app` directory to your target cloud server (Ubuntu 22.04 / 24.04 LTS):
   ```bash
   scp -r siko-app root@your-server-ip:/opt/siko-app
   cd /opt/siko-app
   ```

2. Configure environment keys:
   ```bash
   cp .env.production .env
   nano .env
   ```
   *(Add your live Razorpay API keys as described in Section 4)*

3. Run the automated deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. Verify deployment:
   ```bash
   curl http://localhost:8000/health
   # Returns: {"status":"healthy","version":"1.0.0","service":"SIKO Production API"}
   ```

---

### Option B: Bare-Metal Setup via Systemd (Ubuntu/Debian)

1. **Install Prerequisites:**
   ```bash
   sudo apt update && sudo apt install -y python3 python3-pip python3-venv sqlite3 nginx
   ```

2. **Setup Application & Virtual Environment:**
   ```bash
   cd /opt/siko-app/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Initialize Database & Seed Data:**
   ```bash
   python -c "from database import create_tables; create_tables(); from seed import seed_database; seed_database()"
   ```

4. **Install Systemd Service:**
   ```bash
   sudo cp /opt/siko-app/siko.service /etc/systemd/system/siko.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now siko
   sudo systemctl status siko
   ```

5. **Configure Nginx:**
   ```bash
   sudo cp /opt/siko-app/nginx.conf /etc/nginx/sites-available/siko
   sudo ln -s /etc/nginx/sites-available/siko /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl reload nginx
   ```

---

## 3. Database & Pre-Seeded Accounts

The database includes 40 relational tables with foreign keys and cascade rules. The default SQLite database (`siko.db`) is pre-seeded with all operational accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin / CFO** | `admin@siko.demo` | `demo123` | Full access to CFO ledger, SIKO earnings, teacher approvals |
| **Teacher** | `teacher@siko.demo` | `demo123` | Dr. Ananya Sharma (IIT Delhi PhD, Physics, Senior Gold Tier) |
| **Student** | `student@siko.demo` | `demo123` | Riya Sharma (Class 11, CBSE / JEE Main, Physics & Maths) |
| **Parent** | `parent@siko.demo` | `demo123` | Parent of Riya Sharma (Telemetry & PTM feedback enabled) |

### Switching to PostgreSQL (For Enterprise Scale)
In `.env`, simply uncomment and configure:
```ini
DATABASE_URL=postgresql://siko_admin:YourStrongPassword@localhost:5432/siko_production
```
SQLAlchemy handles all table schema creation automatically on startup.

---

## 4. Pending Configuration: Razorpay Route Integration

All payment verification logic and webhook handlers are already coded in `routers/payments.py` and `routers/escrow.py`. Only the following production credentials from your Razorpay Dashboard are required:

| Environment Variable | Description | Where to Obtain |
|---|---|---|
| `RAZORPAY_KEY_ID` | Production API Key ID | Razorpay Dashboard &rarr; Settings &rarr; API Keys |
| `RAZORPAY_KEY_SECRET` | Production API Key Secret | Razorpay Dashboard &rarr; Settings &rarr; API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | Razorpay Dashboard &rarr; Settings &rarr; Webhooks |
| `RAZORPAY_ACCOUNT_NUMBER` | Master Escrow Account ID | Razorpay Route &rarr; Linked Accounts |

Once entered into `.env`, reload the container:
```bash
docker compose restart siko-app
```

---

## 5. Automated Financial Engine & Immutable Invariants

The financial engine executes all calculations automatically without manual intervention. The following mathematical invariants are strictly enforced:

1. **Reconciliation Identity:**
   $$\text{Student Fee} \equiv \text{Teacher Payout Pool} + \text{SIKO Commission}$$

2. **Milestone Escrow Distribution (100% of Teacher Pool):**
   - **Milestone 1 (50%):** Released upon verified completion of 90% live classroom lecture hours.
   - **Milestone 2 (25%):** Released upon student homework & test submission and faculty evaluation.
   - **Milestone 3 (25%):** Released upon PTM completion and parent acknowledgment.

3. **Commission Tiers:**
   - **1-on-1 Mentorship:** Master (18%), Expert (22%), Senior (25%), Pro (28%).
   - **1-to-Many Smart Batches:** Fixed 50% Platform Commission.
   - **SIKO Net EBITDA:** $\text{Gross Commission} - 12\%\text{ Direct Infrastructure & Streaming Costs}$.

---

## 6. SSL / TLS Setup (Let's Encrypt)

To bind your live domain (e.g. `sikoeduventures.com`):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d sikoeduventures.com -d www.sikoeduventures.com
```
Certbot will automatically configure HTTPS redirects and auto-renewals in Nginx.

---

## 7. Operational Health & Monitoring

- **Health check:** `GET /health`
- **Swagger Documentation:** `GET /docs`
- **ReDoc Documentation:** `GET /redoc`
- **Application Logs:** `docker compose logs -f siko-app`
