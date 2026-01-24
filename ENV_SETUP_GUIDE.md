# 🔑 Environment Variables Setup Guide

This guide will help you set up all the API keys and environment variables needed to run Workplace-AI.

---

## 📋 Quick Setup Checklist

### Required (Must Have):
- [ ] PostgreSQL Database
- [ ] JWT Secret
- [ ] OpenAI API Key
- [ ] Email (Gmail or SMTP)

### Recommended (Should Have):
- [ ] Sentry (Error Tracking)
- [ ] Clerk (User Authentication)

### Optional (Nice to Have):
- [ ] Analytics (Google Analytics, PostHog)
- [ ] Payment Processing (Stripe)
- [ ] File Storage (AWS S3)

---

## 🚀 Step-by-Step Setup

### 1. Database (REQUIRED) - 5 minutes

**Option A: Local PostgreSQL (Development)**
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb workplace_ai

# Your DATABASE_URL:
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/workplace_ai
```

**Option B: Cloud PostgreSQL (Production)**

**Render.com** (Recommended - Free tier available)
1. Go to https://render.com
2. Sign up for free account
3. Click "New +" → "PostgreSQL"
4. Name: `workplace-ai-db`
5. Free tier is fine for MVP
6. Click "Create Database"
7. Copy "External Database URL"
8. Paste into `.env` as `DATABASE_URL`

**Supabase** (Alternative - Free tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (URI)
5. Replace `[YOUR-PASSWORD]` with your password
6. Paste into `.env` as `DATABASE_URL`

**Railway** (Alternative - $5/month)
1. Go to https://railway.app
2. Create new project → PostgreSQL
3. Copy connection string
4. Paste into `.env` as `DATABASE_URL`

---

### 2. JWT Secret (REQUIRED) - 1 minute

Generate a secure random string:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option C: Online Generator**
- Go to https://randomkeygen.com
- Copy a "CodeIgniter Encryption Key"

Copy the generated string and add to `.env`:
```env
JWT_SECRET=your-generated-secret-here-minimum-32-characters
```

⚠️ **IMPORTANT**: Use a different secret for production!

---

### 3. OpenAI API Key (REQUIRED) - 5 minutes

1. **Create Account**
   - Go to https://platform.openai.com
   - Sign up or log in

2. **Add Credits**
   - Go to Billing → Add payment method
   - Add at least $20 credit
   - Set usage limits if desired

3. **Create API Key**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "Workplace-AI"
   - Copy the key (starts with `sk-`)
   - ⚠️ Save it now - you can't see it again!

4. **Add to .env**
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

**Cost Estimate:**
- Simulation: ~$0.05 per run
- Task execution: ~$0.10 per task
- $20 credit = ~200-400 operations

---

### 4. Email Setup (REQUIRED) - 5 minutes

**Option A: Gmail (Recommended for Quick Start)**

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification" if not enabled

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Add to .env**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```
   (Remove spaces from app password)

**Option B: SendGrid (Production Alternative)**

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Create API key
4. Add to `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

---

### 5. Sentry Error Tracking (RECOMMENDED) - 5 minutes

1. **Create Account**
   - Go to https://sentry.io
   - Sign up (free tier: 5,000 errors/month)

2. **Create Project**
   - Click "Create Project"
   - Platform: "Node.js"
   - Name: "workplace-ai-backend"
   - Click "Create Project"

3. **Get DSN**
   - Copy the DSN (looks like: `https://abc123@o456.ingest.sentry.io/789`)

4. **Add to .env**
   ```env
   SENTRY_DSN=https://your-key@o123.ingest.sentry.io/456
   ```

5. **Optional: Create Frontend Project**
   - Create another project for frontend
   - Platform: "React"
   - Add DSN to `frontend/.env` as `VITE_SENTRY_DSN`

---

### 6. Clerk Authentication (RECOMMENDED) - 10 minutes

1. **Create Account**
   - Go to https://clerk.com
   - Sign up (free tier: 5,000 MAU)

2. **Create Application**
   - Click "Create Application"
   - Name: "Workplace-AI"
   - Choose authentication methods (Email, Google, etc.)
   - Click "Create Application"

3. **Get API Keys**
   - Go to "API Keys" in sidebar
   - Copy "Publishable Key" (starts with `pk_`)
   - Copy "Secret Key" (starts with `sk_`)

4. **Add to Backend .env**
   ```env
   CLERK_API_KEY=pk_test_your-publishable-key
   CLERK_SECRET_KEY=sk_test_your-secret-key
   ```

5. **Add to Frontend .env**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
   ```

---

### 7. Optional Services

#### Google Analytics (Optional)
1. Go to https://analytics.google.com
2. Create property
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to `frontend/.env`:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

#### Stripe Payment Processing (Future)
1. Go to https://stripe.com
2. Create account
3. Get API keys from Dashboard
4. Add to `backend/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_your-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your-key
   ```

#### AWS S3 File Storage (Future)
1. Go to AWS Console
2. Create S3 bucket
3. Create IAM user with S3 access
4. Add to `backend/.env`:
   ```env
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=workplace-ai-storage
   ```

---

## 🧪 Testing Your Setup

### 1. Test Database Connection
```bash
cd backend
npx prisma db push
```
✅ Should connect without errors

### 2. Test OpenAI API
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```
✅ Should return list of models

### 3. Test Email
```bash
# Start your backend
npm run dev

# Trigger a deployment (which sends email)
curl -X POST http://localhost:3001/api/deployments \
  -H "Content-Type: application/json" \
  -d '{"org_id": 1, "agent_id": 1, "environment": "production"}'
```
✅ Should receive email

### 4. Test Sentry
```bash
# Start backend with Sentry configured
npm run dev

# Trigger an error
curl http://localhost:3001/api/nonexistent
```
✅ Error should appear in Sentry dashboard

---

## 🔒 Security Best Practices

### DO:
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate secrets every 90 days
- ✅ Use strong, random JWT secrets (32+ characters)
- ✅ Store production secrets in a vault (AWS Secrets Manager, etc.)
- ✅ Use environment variables, never hardcode
- ✅ Add `.env` to `.gitignore`

### DON'T:
- ❌ Commit `.env` files to git
- ❌ Share secrets via email or Slack
- ❌ Use the same secret across environments
- ❌ Use weak or predictable secrets
- ❌ Expose secrets in logs or error messages
- ❌ Use production keys in development

---

## 🆘 Troubleshooting

### "DATABASE_URL is required"
- Make sure `.env` file exists in `backend/` directory
- Check that `DATABASE_URL` is set and not commented out
- Verify the connection string format is correct

### "Invalid OpenAI API key"
- Check key starts with `sk-`
- Verify you copied the entire key
- Make sure you have credits in your OpenAI account
- Try creating a new API key

### "Email sending failed"
- For Gmail: Make sure you're using app password, not regular password
- Check 2-Step Verification is enabled
- Try removing spaces from app password
- Check EMAIL_USER and EMAIL_PASSWORD are both set

### "Sentry not receiving errors"
- Check SENTRY_DSN is set correctly
- Verify DSN format: `https://key@o123.ingest.sentry.io/456`
- Make sure NODE_ENV is set to 'production' or errors are being thrown
- Check Sentry project is active

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:5432/db` | Render, Supabase, Railway |
| `JWT_SECRET` | ✅ Yes | `abc123...` (32+ chars) | Generate with Node/OpenSSL |
| `OPENAI_API_KEY` | ✅ Yes | `sk-...` | platform.openai.com/api-keys |
| `EMAIL_USER` | ✅ Yes | `you@gmail.com` | Your Gmail account |
| `EMAIL_PASSWORD` | ✅ Yes | `abcd efgh ijkl mnop` | myaccount.google.com/apppasswords |
| `SENTRY_DSN` | ⚠️ Recommended | `https://...@sentry.io/...` | sentry.io |
| `CLERK_API_KEY` | ⚠️ Recommended | `pk_test_...` | clerk.com |
| `CLERK_SECRET_KEY` | ⚠️ Recommended | `sk_test_...` | clerk.com |
| `GOVERNOR_BUDGET_CAP` | ❌ Optional | `1000` | Default: 1000 |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ Optional | `100` | Default: 100 |

### Frontend (.env)

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:3001` | Your backend URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | ⚠️ Recommended | `pk_test_...` | clerk.com |
| `VITE_GA_MEASUREMENT_ID` | ❌ Optional | `G-XXXXXXXXXX` | analytics.google.com |

---

## 🎯 Minimum Viable Setup

**For local development, you only need:**

1. **Database** - Local PostgreSQL or free Render.com
2. **JWT Secret** - Generate with Node.js
3. **OpenAI API Key** - $20 credit
4. **Gmail** - Free app password

**Total cost: $20** (OpenAI credit)

**Time to setup: 20-30 minutes**

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier | Recommended |
|---------|-----------|-----------|-------------|
| **Database** | Render (512MB) | $7/month (1GB) | Free tier OK for MVP |
| **OpenAI** | - | $20 credit | $20 one-time |
| **Email** | Gmail (free) | SendGrid $15/mo | Gmail free tier |
| **Sentry** | 5K errors/mo | $26/mo (50K) | Free tier OK |
| **Clerk** | 5K MAU | $25/mo (10K) | Free tier OK |
| **Total** | **$20** | **$68/month** | **Start with $20** |

---

## ✅ Final Checklist

Before running the app:

- [ ] Created `backend/.env` file
- [ ] Created `frontend/.env` file
- [ ] Set `DATABASE_URL` (tested connection)
- [ ] Generated and set `JWT_SECRET` (32+ characters)
- [ ] Got OpenAI API key and added credit
- [ ] Set up Gmail app password
- [ ] (Optional) Set up Sentry
- [ ] (Optional) Set up Clerk
- [ ] Ran `npm install` in both backend and frontend
- [ ] Ran `npx prisma generate` in backend
- [ ] Ran `npx prisma migrate dev` in backend
- [ ] Tested with `npm run dev`

---

**Need help?** Check the troubleshooting section or review the example `.env` files!
