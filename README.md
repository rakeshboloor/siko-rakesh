# SIKO Eduventures — Production Platform

> **Live Edge Deployment:** [https://siko-eduventures.surge.sh](https://siko-eduventures.surge.sh)  
> **Status:** Production 1.0.0 Verified  

SIKO Eduventures is an enterprise-grade personalised learning platform combining human master teachers, adaptive AI workflows, and live interactive classrooms.

## Quickstart Deployment

### 1. Static Edge Hosting (Nginx / S3 / Cloudflare Pages / Vercel)
Deploy `index.html` and `200.html` to any static web host.

### 2. Full-Stack Containerized (Docker Compose)
```bash
cd siko-app
cp .env.production .env
docker compose up -d --build
```

### 3. Architecture & Documentation
Read [`CTO_HANDOVER_AND_DEPLOYMENT_DOSSIER.md`](./CTO_HANDOVER_AND_DEPLOYMENT_DOSSIER.md) and [`siko-app/CTO_DEPLOYMENT_GUIDE.md`](./siko-app/CTO_DEPLOYMENT_GUIDE.md) for full server setup, database schema, and Razorpay configuration.
