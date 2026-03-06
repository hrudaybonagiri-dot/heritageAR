# Cloud Deployment Guide

Complete guide for deploying AR Heritage platform to production.

## Architecture

```
Frontend (Vercel)
    ↓
Backend (Render/Railway)
    ↓
Database (JSON/PostgreSQL)
```

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render or Railway account (free tier available)
- Git installed locally

---

## Part 1: Backend Deployment

### Option A: Deploy to Render

#### Step 1: Prepare Repository

1. **Commit all changes:**
```bash
cd ar-heritage-unfold-main
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `ar-heritage-unfold-main` repository

#### Step 4: Configure Service

**Basic Settings:**
- Name: `ar-heritage-backend`
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
Click "Advanced" → Add Environment Variables:

```
NODE_ENV=production
PORT=5001
JWT_SECRET=<generate-secure-random-string>
CORS_ORIGINS=https://your-app.vercel.app
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://ar-heritage-backend.onrender.com`

#### Step 6: Test Backend

```bash
curl https://ar-heritage-backend.onrender.com/health
```

Should return: `{"status":"ok"}`

---

### Option B: Deploy to Railway

#### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

#### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `ar-heritage-unfold-main` repository

#### Step 3: Configure Service

1. Railway will auto-detect Node.js
2. Set Root Directory: `backend`
3. Add Environment Variables:

```
NODE_ENV=production
PORT=5001
JWT_SECRET=<generate-secure-random-string>
CORS_ORIGINS=https://your-app.vercel.app
```

#### Step 4: Deploy

1. Railway will automatically deploy
2. Click "Settings" → "Generate Domain"
3. Note your backend URL: `https://your-app.up.railway.app`

#### Step 5: Test Backend

```bash
curl https://your-app.up.railway.app/health
```

---

## Part 2: Frontend Deployment

### Deploy to Vercel

#### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

#### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import `ar-heritage-unfold-main` repository
3. Vercel will auto-detect Vite

#### Step 3: Configure Project

**Framework Preset:** Vite
**Root Directory:** `./` (leave as root)
**Build Command:** `npm run build`
**Output Directory:** `dist`

**Environment Variables:**
Add the following:

```
VITE_API_URL=https://ar-heritage-backend.onrender.com
```

Or if using Railway:
```
VITE_API_URL=https://your-app.up.railway.app
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

#### Step 5: Update Backend CORS

Go back to your backend service (Render/Railway) and update:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Redeploy backend if needed.

---

## Part 3: Post-Deployment Configuration

### Update Environment Variables

#### Backend (Render/Railway)

Update `.env` or environment variables:
```
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
```

#### Frontend (Vercel)

Update environment variables:
```
VITE_API_URL=https://ar-heritage-backend.onrender.com
```

### Test Full Application

1. **Visit Frontend:**
   ```
   https://your-app.vercel.app
   ```

2. **Test API Connection:**
   - Go to Explore Heritage
   - Check if monuments load
   - Try AR Viewer
   - Check browser console for errors

3. **Test All Features:**
   - [ ] Home page loads
   - [ ] Explore Heritage shows monuments
   - [ ] Search and filters work
   - [ ] AR Viewer loads 3D models
   - [ ] Monument Details display
   - [ ] Admin Upload form works

---

## Part 4: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain: `arheritage.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Update Backend CORS

Add your custom domain to CORS_ORIGINS:
```
CORS_ORIGINS=https://arheritage.com,https://www.arheritage.com,https://your-app.vercel.app
```

---

## Part 5: Monitoring & Maintenance

### Render Monitoring

1. **Logs:** Dashboard → Logs tab
2. **Metrics:** Dashboard → Metrics tab
3. **Health Checks:** Automatic via `/health` endpoint

### Railway Monitoring

1. **Logs:** Project → Deployments → View Logs
2. **Metrics:** Project → Metrics tab
3. **Alerts:** Configure in Settings

### Vercel Monitoring

1. **Analytics:** Project → Analytics
2. **Logs:** Project → Deployments → Function Logs
3. **Performance:** Built-in Web Vitals

---

## Troubleshooting

### Backend Issues

#### 1. Backend Not Starting

**Check Logs:**
- Render: Dashboard → Logs
- Railway: Deployments → View Logs

**Common Issues:**
- Missing environment variables
- Wrong Node version
- Port binding issues

**Solution:**
```bash
# Ensure package.json has correct start script
"scripts": {
  "start": "node src/server-simple.js"
}
```

#### 2. CORS Errors

**Symptom:** Frontend can't connect to backend

**Solution:**
1. Check CORS_ORIGINS includes your frontend URL
2. Ensure no trailing slashes
3. Redeploy backend after changes

#### 3. 502 Bad Gateway

**Causes:**
- Backend crashed
- Health check failing
- Port not binding correctly

**Solution:**
1. Check logs for errors
2. Verify PORT environment variable
3. Test health endpoint

### Frontend Issues

#### 1. API Connection Failed

**Check:**
1. VITE_API_URL is correct
2. Backend is running
3. CORS is configured
4. Network tab in browser DevTools

**Solution:**
```bash
# Verify environment variable
echo $VITE_API_URL

# Test backend directly
curl https://your-backend-url/health
```

#### 2. Build Failures

**Common Issues:**
- TypeScript errors
- Missing dependencies
- Environment variables not set

**Solution:**
```bash
# Test build locally
npm run build

# Check for errors
npm run lint
```

#### 3. 404 on Routes

**Symptom:** Direct URLs return 404

**Solution:**
Ensure `vercel.json` has rewrites configured (already included).

---

## Environment Variables Reference

### Backend

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment | `production` |
| PORT | Yes | Server port | `5001` |
| JWT_SECRET | Yes | JWT signing key | `<random-string>` |
| CORS_ORIGINS | Yes | Allowed origins | `https://app.vercel.app` |

### Frontend

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| VITE_API_URL | Yes | Backend URL | `https://backend.onrender.com` |

---

## Deployment Checklist

### Pre-Deployment

- [ ] All code committed to Git
- [ ] Environment variables documented
- [ ] Build tested locally
- [ ] Dependencies up to date
- [ ] Security audit passed

### Backend Deployment

- [ ] Service created on Render/Railway
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check passing
- [ ] API endpoints responding

### Frontend Deployment

- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] Build successful
- [ ] Site accessible
- [ ] API connection working

### Post-Deployment

- [ ] CORS configured correctly
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Monitoring enabled
- [ ] Custom domain configured (if applicable)

---

## Costs

### Free Tier Limits

**Render (Free):**
- 750 hours/month
- Sleeps after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Railway (Free Trial):**
- $5 credit/month
- No sleep
- 512 MB RAM
- Shared CPU

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

### Upgrade Recommendations

**For Production:**
- Render: $7/month (Starter)
- Railway: $5/month (usage-based)
- Vercel: Free tier usually sufficient

---

## Security Best Practices

### Backend

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **CORS:**
   - Only allow specific origins
   - Don't use wildcards in production

3. **Rate Limiting:**
   - Already configured (100 req/15min)
   - Adjust as needed

### Frontend

1. **API Keys:**
   - Never expose in client code
   - Use environment variables
   - Prefix with `VITE_` for Vite

2. **HTTPS:**
   - Vercel provides automatic HTTPS
   - Always use secure connections

---

## Continuous Deployment

### Automatic Deployments

Both Render/Railway and Vercel support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build:**
   - Backend redeploys automatically
   - Frontend redeploys automatically

3. **Preview Deployments:**
   - Vercel creates preview for each PR
   - Test before merging

### Manual Deployments

**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

**Railway:**
- Automatic on every push

**Vercel:**
- Dashboard → Deployments → Redeploy

---

## Rollback

### Render

1. Go to Dashboard → Deployments
2. Find previous successful deployment
3. Click "Rollback to this version"

### Railway

1. Go to Deployments
2. Click on previous deployment
3. Click "Redeploy"

### Vercel

1. Go to Deployments
2. Find previous deployment
3. Click "..." → "Promote to Production"

---

## Support Resources

### Documentation

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

### Community

- [Render Community](https://community.render.com)
- [Railway Discord](https://discord.gg/railway)
- [Vercel Discord](https://vercel.com/discord)

---

## Next Steps

After successful deployment:

1. **Monitor Performance:**
   - Check response times
   - Monitor error rates
   - Review logs regularly

2. **Set Up Alerts:**
   - Downtime notifications
   - Error rate thresholds
   - Performance degradation

3. **Optimize:**
   - Enable caching
   - Compress assets
   - Optimize images

4. **Scale:**
   - Upgrade plans as needed
   - Add database if required
   - Implement CDN for assets

---

## Quick Reference

### URLs After Deployment

```
Frontend: https://your-app.vercel.app
Backend:  https://ar-heritage-backend.onrender.com
         or https://your-app.up.railway.app
Health:   https://backend-url/health
API:      https://backend-url/api/monuments
```

### Common Commands

```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally
npm run dev

# Build frontend
npm run build

# Test production build
npm run preview
```

---

## Success! 🎉

Your AR Heritage platform is now deployed and accessible worldwide!

- Frontend: Fast, global CDN delivery
- Backend: Reliable API service
- WebXR: AR mode works on mobile devices
- Monitoring: Built-in analytics and logs

Share your deployed app and start preserving cultural heritage!

