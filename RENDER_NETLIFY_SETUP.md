# Render PostgreSQL + Netlify Setup Guide
# Cost-Free Alternative Deployment

## Overview
This guide replaces Supabase + Vercel with:
- **Database**: Render PostgreSQL (Free: 512MB RAM, 1GB storage)
- **Frontend**: Netlify (Free: 100GB bandwidth, custom domains)
- **Backend**: Render (Free: 750 hours/month)

---

## Step 1: Create Render PostgreSQL Database

### 1.1 Create Database
1. Go to https://render.com/dashboard
2. Click **"New +"** > **"PostgreSQL"**
3. Configure:
   - **Name**: `xod-database`
   - **Database**: `xod_prod`
   - **User**: `xod_user`
   - **Region**: Choose closest to you (same as your backend if possible)
4. Click **"Create Database"**
5. Wait for provisioning (2-3 minutes)

### 1.2 Get Connection Details
1. In Render dashboard, go to your new PostgreSQL service
2. Click **"Connect"** tab
3. Copy the **"External Database URL"**
   - Format: `postgresql://xod_user:password@host:5432/xod_prod`
   - Example: `postgresql://xod_user:abc123def@postgresql-12345.onrender.com:5432/xod_prod`

### 1.3 Convert to JDBC Format
For Spring Boot, convert the connection string:
```
Original: postgresql://xod_user:abc123def@postgresql-12345.onrender.com:5432/xod_prod
JDBC:     jdbc:postgresql://postgresql-12345.onrender.com:5432/xod_prod?sslmode=require
```

---

## Step 2: Deploy/Update Backend on Render

### 2.1 Environment Variables
Update your Render backend service with these variables:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://[your-db-host]:5432/xod_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=xod_user
SPRING_DATASOURCE_PASSWORD=[your-generated-password]
APP_JWT_SECRET=dieu_merci_sudo_random_32_chars_min
APP_JWT_EXPIRATION_MS=28800000
APP_CORS_ALLOWED_ORIGINS=https://[your-netlify-site].netlify.app
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

**Replace:**
- `[your-db-host]`: The host from your Render PostgreSQL URL
- `[your-generated-password]`: The password Render generated
- `[your-netlify-site]`: Your Netlify site name (update after Step 3)

### 2.2 Deploy Backend
If you haven't deployed the backend yet:
1. Follow `RENDER_DEPLOYMENT.md` but use the new database variables above

If you already have a backend deployed:
1. Go to your Render backend service
2. Click **"Environment"** tab
3. Update the database variables
4. Click **"Manual Deploy"** > **"Deploy latest commit"**

### 2.3 Verify Backend
Test the health endpoint:
```bash
curl https://your-backend-service.onrender.com/actuator/health
# Should return: {"status":"UP","components":{"db":{"status":"UP"}}}
```

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub (recommended for easy deploys)

### 3.2 Import Project
1. Click **"Add new site"** > **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Select repository: `MERCIA-lab/Financial-Advisor-System`

### 3.3 Configure Build Settings
```
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

### 3.4 Add Environment Variable
In **"Environment variables"** section:
```
Key: VITE_API_BASE_URL
Value: https://your-render-backend.onrender.com
```

### 3.5 Deploy
1. Click **"Deploy site"**
2. Wait for build (2-3 minutes)
3. Get your site URL (example: `https://amazing-site.netlify.app`)

---

## Step 4: Update Backend CORS

### 4.1 Get Netlify URL
From your Netlify dashboard, copy the site URL (e.g., `https://amazing-site.netlify.app`)

### 4.2 Update Render Backend
1. Go to Render dashboard > your backend service
2. Click **"Environment"** tab
3. Update `APP_CORS_ALLOWED_ORIGINS`:
   ```
   APP_CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
   ```
4. Click **"Save Changes"**
5. The service will auto-redeploy (2-3 minutes)

---

## Step 5: Test the Complete System

### 5.1 Access Frontend
Open your Netlify URL: `https://your-site.netlify.app`

### 5.2 Login Test
- **Email**: `advisor@xod.local`
- **Password**: `password`

### 5.3 Feature Tests
- ✅ Dashboard loads with metrics
- ✅ Client list displays
- ✅ Can add/edit/delete clients
- ✅ Portfolio management works
- ✅ API calls succeed (check Network tab in browser dev tools)

### 5.4 API Verification
```bash
# Test backend health
curl https://your-backend.onrender.com/actuator/health

# Test API endpoints
curl -H "Authorization: Bearer [your-jwt-token]" \
  https://your-backend.onrender.com/api/clients
```

---

## Troubleshooting

### Database Connection Issues
- Check Render PostgreSQL service is running
- Verify JDBC URL format: `jdbc:postgresql://host:5432/xod_prod?sslmode=require`
- Ensure username/password are correct
- Check if database is in the same region as backend

### Frontend Build Fails
- Ensure base directory is `frontend` (not root)
- Check build command is `npm run build`
- Verify publish directory is `dist`

### CORS Errors
- Update `APP_CORS_ALLOWED_ORIGINS` with exact Netlify URL
- Include `https://` protocol
- No trailing slash

### Login Fails
- Check JWT secret matches between frontend/backend
- Verify database has the default advisor user
- Check backend logs in Render dashboard

---

## URLs After Deployment

```
Frontend:  https://[your-netlify-site].netlify.app
Backend:   https://[your-render-backend].onrender.com
Database:  Render PostgreSQL (postgresql://xod_user:***@[host]:5432/xod_prod)
```

---

## Cost Summary

| Service | Cost | Limits |
|---------|------|--------|
| Render PostgreSQL | **FREE** | 512MB RAM, 1GB storage |
| Render Backend | **FREE** | 750 hours/month |
| Netlify Frontend | **FREE** | 100GB bandwidth, 300 build minutes |

**Total Monthly Cost: $0**

---

## Next Steps
1. ✅ Create Render PostgreSQL database
2. ✅ Deploy/update Render backend with new DB variables
3. ✅ Deploy frontend to Netlify
4. ✅ Update CORS with Netlify URL
5. ✅ Test the complete system

Your system will be fully functional with professional URLs and zero monthly cost!