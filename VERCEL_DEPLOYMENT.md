# Vercel Deployment Configuration
# Frontend Deploy to Vercel with Render Backend

## Step-by-Step Vercel Setup

### 1. Deploy Frontend to Vercel

**Step A: Import Project**
1. Go to https://vercel.com
2. Click "Add New..." > "Project"
3. Click "Import Git Repository"
4. Enter: https://github.com/MERCIA-lab/Financial-Advisor-System.git
5. Click Import

**Step B: Configure Project**
- **Project Name**: xod-frontend
- **Framework Preset**: Vite
- **Root Directory**: ./frontend
- **Build Command**: npm run build (should auto-detect)
- **Output Directory**: dist

**Step C: Environment Variables**
Click "Environment Variables" and add:

```env
VITE_API_BASE_URL=https://xod-backend.onrender.com
```

(Replace with your actual Render backend URL after it's deployed; the frontend automatically adds `/api` if needed)

**Step D: Deploy**
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Get your Vercel URL (example: https://xod-frontend.vercel.app)

### 2. Update Backend CORS

After Vercel deployment, update Render environment variable:

**In Render Dashboard:**
1. Go to https://render.com/dashboard
2. Select your backend service: xod-backend
3. Go to "Environment" tab
4. Edit `APP_CORS_ALLOWED_ORIGINS`
5. Set to your Vercel URL: https://YOUR_VERCEL_URL.vercel.app
6. Save and redeploy

---

## Vercel Environment Variable

| Variable | Value |
|----------|-------|
| VITE_API_BASE_URL | https://xod-backend.onrender.com |

---

## Expected URLs After Deployment

```
Frontend:  https://xod-frontend.vercel.app
Backend:   https://xod-backend.onrender.com/api
Database:  Supabase (postgres.db.gcvubfnayeaukyiomwhf.supabase.co)
```

---

## Test the Deployment

### 1. Access Frontend
```
https://xod-frontend.vercel.app
```

### 2. Login with Default Credentials
```
Email:    advisor@xod.local
Password: password
```

### 3. Test Features
- View Dashboard
- Manage Clients
- Add Securities
- Update Portfolio

### 4. Verify API Connection
```bash
curl https://xod-backend.onrender.com/actuator/health
# Should return: {"status":"UP"}
```

---

## Troubleshooting

### Frontend not connecting to backend
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Verify backend CORS includes Vercel URL
- Check browser console for errors

### Login fails
- Check backend is running: https://xod-backend.onrender.com/actuator/health
- Verify database connection credentials
- Check JWT secret is set correctly

### Database connection errors
- Verify Supabase connection string is correct
- Check password is correct: Dieu_Merci
- Ensure SSL mode is set to require

---

## Next Steps
1. ✅ Deploy backend to Render (see RENDER_DEPLOYMENT.md)
2. ✅ Deploy frontend to Vercel (this file)
3. Update backend CORS with Vercel URL
4. Test the live application
5. Monitor with Grafana