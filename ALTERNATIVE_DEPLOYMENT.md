# Cost-Effective Alternative Deployment
# Free/Low-Cost Alternatives to Vercel + Supabase

## Overview
Since Vercel and Supabase pricing is an issue, here are working alternatives that maintain full functionality with minimal or no cost:

### Current Setup (Paid)
- **Database**: Supabase PostgreSQL ($25+/month for production)
- **Frontend**: Vercel ($0-20+/month depending on usage)
- **Backend**: Render (Free tier available)

### Alternative Setup (Free/Low-Cost)
- **Database**: Render PostgreSQL (Free: 512MB RAM, 1GB storage)
- **Frontend**: Netlify (Free: 100GB bandwidth, custom domains)
- **Backend**: Render (Free tier maintained)

---

## Alternative 1: Render PostgreSQL + Netlify (Recommended)

### 1. Database Setup (Render PostgreSQL - FREE)

**Step A: Create Render PostgreSQL Database**
1. Go to https://render.com
2. Click "New +" > "PostgreSQL"
3. Configure:
   - **Name**: xod-database
   - **Database**: xod_prod
   - **User**: xod_user
   - **Region**: Choose closest to you
4. Click "Create Database"
5. Wait for provisioning (2-3 minutes)
6. Copy the **External Database URL** (looks like: `postgresql://xod_user:password@host:5432/xod_prod`)

**Step B: Update Connection String**
Convert to JDBC format for Spring Boot:
```
jdbc:postgresql://[host]:5432/xod_prod?sslmode=require
```

### 2. Backend Deployment (Render - FREE)

**Environment Variables for Render Backend:**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://[your-render-db-host]:5432/xod_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=xod_user
SPRING_DATASOURCE_PASSWORD=[your-render-db-password]
APP_JWT_SECRET=dieu_merci_sudo_random_32_chars_min
APP_JWT_EXPIRATION_MS=28800000
APP_CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

### 3. Frontend Deployment (Netlify - FREE)

**Step A: Deploy to Netlify**
1. Go to https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repo: https://github.com/MERCIA-lab/Financial-Advisor-System.git
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-render-backend.onrender.com
   ```
6. Click "Deploy site"
7. Get your Netlify URL (example: `https://amazing-site.netlify.app`)

**Step B: Update Backend CORS**
In Render backend environment variables, update:
```env
APP_CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

---

## Alternative 2: Railway + Firebase Hosting

### Database: Railway PostgreSQL (Free: 512MB)
### Frontend: Firebase Hosting (Free: 10GB storage, 360MB/day)

**Railway Setup:**
1. Go to https://railway.app
2. Create account and project
3. Add PostgreSQL database
4. Get connection string
5. Use JDBC format: `jdbc:postgresql://[host]:5432/railway?sslmode=require`

**Firebase Hosting Setup:**
1. Go to https://firebase.google.com
2. Create project
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Login: `firebase login`
5. Initialize: `firebase init` (select Hosting)
6. Deploy: `firebase deploy`

---

## Alternative 3: PlanetScale + Netlify

### Database: PlanetScale MySQL (Free: 1 database, 1GB storage)
### Frontend: Netlify (Free)

**PlanetScale Setup:**
1. Go to https://planetscale.com
2. Create database
3. Get connection string
4. Update Spring Boot to use MySQL driver instead of PostgreSQL

**Note**: Would require changing from PostgreSQL to MySQL in the application.

---

## Alternative 4: MongoDB Atlas + GitHub Pages

### Database: MongoDB Atlas (Free: 512MB storage)
### Frontend: GitHub Pages (Free, unlimited)

**MongoDB Atlas Setup:**
1. Go to https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Would require changing backend to use MongoDB instead of PostgreSQL

**GitHub Pages Setup:**
1. Go to your GitHub repo Settings > Pages
2. Source: GitHub Actions
3. Create workflow for Vite build and deploy

---

## Alternative 5: SQLite + Render Static Sites

### Database: SQLite (Free, file-based)
### Frontend: Render Static Site (Free)

**SQLite Setup:**
- No external database needed
- SQLite file stored with the application
- Perfect for demos/development

**Render Static Site Setup:**
1. In Render dashboard
2. New > Static Site
3. Connect GitHub repo
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `dist`

---

## Recommended Alternative: Render PostgreSQL + Netlify

### Why This Works Best:
- ✅ **Database**: Render PostgreSQL (512MB free, same region as backend)
- ✅ **Backend**: Render (750 hours free/month)
- ✅ **Frontend**: Netlify (100GB free bandwidth)
- ✅ **Same Technology Stack**: PostgreSQL maintained
- ✅ **No Code Changes Required**
- ✅ **Professional URLs**: yoursite.netlify.app

### Migration Steps:

1. **Create Render PostgreSQL Database**
2. **Update Backend Environment Variables** with new DB connection
3. **Redeploy Backend** (if already deployed) or deploy new
4. **Deploy Frontend to Netlify** instead of Vercel
5. **Update CORS** with Netlify URL
6. **Test Everything**

### Cost Comparison:
- **Before**: Supabase ($25+), Vercel ($0-20), Render (Free) = $25-45/month
- **After**: Render DB (Free), Netlify (Free), Render (Free) = **$0/month**

Would you like me to create the specific deployment instructions for the Render PostgreSQL + Netlify setup?