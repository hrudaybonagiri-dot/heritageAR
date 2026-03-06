# Deployment Checklist

Quick reference for deploying AR Heritage platform.

## Pre-Deployment

- [ ] Test locally: `npm run dev` (both frontend and backend)
- [ ] Build frontend: `npm run build`
- [ ] Check for errors: `npm run lint`
- [ ] Commit all changes: `git add . && git commit -m "Ready for deployment"`
- [ ] Push to GitHub: `git push origin main`

## Backend Deployment (Choose One)

### Option A: Render

1. [ ] Go to https://render.com
2. [ ] New Web Service → Connect GitHub repo
3. [ ] Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. [ ] Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=<generate-random-string>
   CORS_ORIGINS=https://your-app.vercel.app
   ```
5. [ ] Deploy and note URL: `https://ar-heritage-backend.onrender.com`

### Option B: Railway

1. [ ] Go to https://railway.app
2. [ ] New Project → Deploy from GitHub
3. [ ] Select repository
4. [ ] Set Root Directory: `backend`
5. [ ] Add Environment Variables (same as above)
6. [ ] Generate Domain and note URL

## Frontend Deployment (Vercel)

1. [ ] Go to https://vercel.com
2. [ ] Import Project → Select GitHub repo
3. [ ] Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. [ ] Add Environment Variable:
   ```
   VITE_API_URL=<your-backend-url>
   ```
5. [ ] Deploy and note URL: `https://your-app.vercel.app`

## Post-Deployment

1. [ ] Update backend CORS with frontend URL
2. [ ] Test frontend: Visit `https://your-app.vercel.app`
3. [ ] Test API connection: Check Explore Heritage page
4. [ ] Test AR Viewer: Try viewing a monument in 3D
5. [ ] Check browser console for errors
6. [ ] Test on mobile device (for AR mode)

## Verification

- [ ] Home page loads correctly
- [ ] Explore Heritage shows monuments
- [ ] Search and filters work
- [ ] AR Viewer loads 3D models
- [ ] Monument Details display correctly
- [ ] No CORS errors in console
- [ ] API calls successful
- [ ] WebXR AR mode works on mobile

## URLs to Save

```
Frontend: https://your-app.vercel.app
Backend:  https://your-backend-url
Health:   https://your-backend-url/health
API:      https://your-backend-url/api/monuments
```

## If Something Goes Wrong

### CORS Errors
- Check CORS_ORIGINS includes your frontend URL
- Ensure no trailing slashes
- Redeploy backend

### API Not Connecting
- Verify VITE_API_URL is correct
- Check backend is running: `curl https://backend-url/health`
- Check browser Network tab

### Build Failures
- Check logs in deployment platform
- Test build locally: `npm run build`
- Verify all dependencies installed

## Quick Commands

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test backend health
curl https://your-backend-url/health

# Test API endpoint
curl https://your-backend-url/api/monuments

# Local development
npm run dev

# Build for production
npm run build
```

## Done! ✅

Your AR Heritage platform is now live and accessible worldwide!

