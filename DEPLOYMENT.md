# Deployment Guide - Workplace-AI MVP

## Overview
This guide covers deploying Workplace-AI to production using Vercel (Frontend) and Render/Railway (Backend).

## Prerequisites
- GitHub account (for deployment)
- PostgreSQL database (managed or self-hosted)
- Vercel account
- Render or Railway account

---

## Step 1: Prepare Database

### Option A: Managed PostgreSQL (Recommended)
Use one of:
- **Render PostgreSQL** (https://render.com)
- **Railway PostgreSQL** (https://railway.app)
- **Supabase PostgreSQL** (https://supabase.com)
- **AWS RDS**

Get your `DATABASE_URL` and save it.

### Option B: Local PostgreSQL
```bash
createdb workplace_ai
```

---

## Step 2: Frontend Deployment (Vercel)

### 2.1 Push to GitHub
```bash
cd workplace-ai-mvp
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/workplace-ai.git
git push -u origin main
```

### 2.2 Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Select "frontend" as root directory
5. Add environment variables:
   ```
   VITE_API_URL=https://workplace-ai-api.onrender.com
   ```
6. Click "Deploy"

**Result:** Frontend deployed at `https://workplace-ai-xxxxx.vercel.app`

---

## Step 3: Backend Deployment (Render)

### 3.1 Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configuration:
   - **Name:** workplace-ai-api
   - **Root Directory:** backend
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free or Starter

### 3.2 Add Environment Variables
In Render dashboard, add:
```
DATABASE_URL=postgresql://user:pass@host:5432/workplace_ai
JWT_SECRET=generate-random-secret-key-here
NODE_ENV=production
VERCEL_URL=https://workplace-ai-xxxxx.vercel.app
```

### 3.3 Add PostgreSQL Database
Option 1: Use Render PostgreSQL (same dashboard)
Option 2: Use external managed database (Supabase, Railway, etc.)

**Result:** API deployed at `https://workplace-ai-api.onrender.com`

---

## Step 4: Update Frontend API URL

After backend deployment, update frontend environment variable in Vercel:
```
VITE_API_URL=https://workplace-ai-api.onrender.com
```

Trigger redeploy in Vercel dashboard.

---

## Step 5: Verify Deployment

### Check Backend Health
```bash
curl https://workplace-ai-api.onrender.com/api/health
# Response: {"status":"ok","timestamp":"2026-01-23T..."}
```

### Test Frontend
1. Visit https://workplace-ai-xxxxx.vercel.app
2. You should see:
   - Navbar with Workplace-AI branding
   - Dashboard with initialized metrics
   - Agent Marketplace with hiring options

### Create Test Data
1. Go to "Agents" tab
2. Click "Hire Agent" on Support Agent
3. Go to "Simulations"
4. Run a simulation
5. Check "Analytics" for metrics

---

## Step 6: Custom Domain (Optional)

### Vercel Custom Domain
1. In Vercel project settings → "Domains"
2. Add your domain (e.g., `workplace-ai.com`)
3. Follow DNS setup instructions

### Render Custom Domain
1. In Render project settings → "Custom Domain"
2. Add domain for API (e.g., `api.workplace-ai.com`)
3. Follow DNS setup instructions

---

## Monitoring & Logging

### Vercel Logs
```bash
vercel logs <project-url>
```

### Render Logs
View in Render dashboard → Logs tab

### Database Monitoring
- **Render:** Dashboard → Database → Logs
- **Railway:** Dashboard → Logs
- **Supabase:** Dashboard → Database → Logs

---

## Scaling (Post-MVP)

### Increase Backend Resources
Render Dashboard → Settings → Instance Type (upgrade from Free/Starter)

### Database Optimization
- Add indexes on `org_id`, `agent_id`
- Set up automated backups
- Monitor query performance

### Caching
Add Redis layer between frontend and backend:
```
REDIS_URL=redis://...
```

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` environment variable
- Ensure database server is running
- Verify IP whitelist (for managed databases)

### "CORS errors"
- Check backend `cors()` middleware
- Ensure VERCEL_URL is set in backend env
- Verify API URL in frontend

### "Frontend deployment fails"
- Check build logs in Vercel
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

### "API returns 500 errors"
- Check Render logs
- Verify database connection
- Check environment variables

---

## Post-Deployment Checklist

- [ ] Database is running and accessible
- [ ] Backend is deployed and healthy
- [ ] Frontend is deployed and loads
- [ ] API calls work (test /api/health)
- [ ] Database tables are created
- [ ] Can hire agents from marketplace
- [ ] Can run simulations
- [ ] Can deploy agents
- [ ] Can view analytics
- [ ] Logged metrics appear correctly

---

## Security Hardening

1. **Update JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Enable HTTPS**
   - Vercel: Automatic
   - Render: Automatic

3. **Database Security**
   - Use strong password
   - Enable SSL connections
   - Restrict IP access

4. **Secrets Management**
   - Never commit .env files
   - Use platform secret managers
   - Rotate keys regularly

---

## Demo Credentials (for investor presentation)

**Organization:** Test Company (auto-created)
**Demo Flow:**
1. Marketplace → Hire Support Agent
2. Simulations → Run Simulation
3. Deployments → Deploy to Email
4. Governor → Set Budget Cap ($100)
5. Analytics → View ROI metrics

---

## Support
For deployment issues, check:
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
