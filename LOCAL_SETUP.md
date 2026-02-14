# 🚀 Local Setup Instructions

## Quick Setup (If PostgreSQL is installed)

PostgreSQL is **not currently installed** on your system. You have two options:

---

## OPTION 1: Install PostgreSQL Locally (Recommended for Development)

```bash
# Install PostgreSQL via Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb workplace_ai

# Then run Prisma migrations
cd backend
npx prisma generate
npx prisma migrate dev --name init

# Start backend
npm run dev
```

---

## OPTION 2: Use Cloud Database (Fastest - No Installation)

### Using Supabase (FREE, 5 minutes)

1. **Sign up:** https://supabase.com
2. **Create project** → Wait 2 minutes for provisioning
3. **Get connection string:**
   - Go to: Settings → Database → Connection String
   - Copy the "URI" format (starts with `postgresql://`)
4. **Update backend/.env:**
   ```bash
   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
5. **Run migrations:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate deploy
   npm run dev
   ```

---

## Current Status

✅ Dependencies installed (704 packages)
✅ Environment files created
✅ Prisma schema fixed (removed invalid @map)
❌ PostgreSQL not installed locally
❌ Need to either install locally OR use cloud database

---

## After Database is Ready

### Start Backend (Terminal 1)
```bash
cd /Users/harshmriduhash/Desktop/workplace-ai/backend
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd /Users/harshmriduhash/Desktop/workplace-ai/frontend  
npm run dev
```

### Open in Browser
```
http://localhost:3000
```

---

## Verification

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"...","config":{...}}
```

---

## Recommendation

**For quick testing:** Use Supabase (Option 2) - no installation needed  
**For long-term development:** Install PostgreSQL (Option 1) - faster and offline access
