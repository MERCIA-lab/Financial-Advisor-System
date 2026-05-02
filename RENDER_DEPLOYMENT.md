# Render Deployment Configuration
# Backend Deploy to Render with Supabase

## Step-by-Step Render Setup

### 1. Get Supabase Connection String
- Go to: https://gcvubfnayeaukyiomwhf.supabase.co
- Click Settings > Database
- Connection Pooling tab
- Copy connection string (looks like: postgresql://postgres.user:password@host:6543/postgres)
- Format: `jdbc:postgresql://db.gcvubfnayeaukyiomwhf.supabase.co:6543/postgres?sslmode=require`

### 2. Deploy to Render

**Step A: Create Web Service**
1. Go to https://render.com
2. Click "New +" > "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect your GitHub repo: https://github.com/MERCIA-lab/Financial-Advisor-System.git

**Step B: Configure Deployment**
- **Name**: xod-backend
- **Region**: Choose closest to you
- **Branch**: main
- **Root Directory**: backend
- **Environment**: Docker

**Step C: Set Environment Variables**
Add these in Render dashboard:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db.gcvubfnayeaukyiomwhf.supabase.co:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=Dieu_Merci
APP_JWT_SECRET=dieu_merci_sudo_random_32_chars_min
APP_JWT_EXPIRATION_MS=28800000
APP_CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_FRONTEND_URL
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

**Step D: Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy backend URL (example: https://xod-backend.onrender.com)
- Save this URL for Vercel setup

### 3. Verify Backend Deployment
```
Health check: https://xod-backend.onrender.com/actuator/health
Should return: {"status":"UP"}
```

---

## Render Environment Variables Details

| Variable | Value | Notes |
|----------|-------|-------|
| SPRING_DATASOURCE_URL | jdbc:postgresql://db.gcvubfnayeaukyiomwhf.supabase.co:6543/postgres?sslmode=require | Supabase connection |
| SPRING_DATASOURCE_USERNAME | postgres | Database user |
| SPRING_DATASOURCE_PASSWORD | Dieu_Merci | Your DB password |
| APP_JWT_SECRET | dieu_merci_sudo_random_32_chars_min | Min 32 characters |
| APP_JWT_EXPIRATION_MS | 28800000 | 8 hours in milliseconds |
| APP_CORS_ALLOWED_ORIGINS | https://your-vercel-url.vercel.app | Update after Vercel deploy |

---

**Next Step**: After backend is deployed, you'll get a URL. Use that for Vercel setup.