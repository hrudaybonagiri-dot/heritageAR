# AR Heritage - Deployment Ready! 🚀

Your AR Heritage platform is now configured for cloud deployment.

## Quick Start

### 1. Deploy Backend (5 minutes)

**Render (Recommended):**
1. Go to https://render.com
2. New Web Service → Connect your GitHub repo
3. Root Directory: `backend`
4. Add environment variables (see below)
5. Deploy!

**Railway (Alternative):**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Set Root Directory: `backend`
4. Add environment variables
5. Generate domain

### 2. Deploy Frontend (3 minutes)

**Vercel:**
1. Go to https://vercel.com
2. Import your GitHub repo
3. Add environment variable: `VITE_API_URL=<your-backend-url>`
4. Deploy!

### 3. Update CORS (1 minute)

Go back to your backend and update:
```
CORS_ORIGINS=https://your-app.vercel.app
```

## Environment Variables

### Backend (Render/Railway)

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=<generate-random-32-char-string>
CORS_ORIGINS=https://your-app.vercel.app
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend.onrender.com
```

## What's Included

✅ **Configuration Files:**
- `vercel.json` - Vercel deployment config
- `render.yaml` - Render deployment config
- `railway.json` - Railway deployment config
- `.env.example` - Environment variable templates

✅ **API Configuration:**
- `src/config/api.ts` - Centralized API endpoints
- Automatic URL switching (dev/prod)
- All pages updated to use config

✅ **CORS Setup:**
- Environment-based CORS origins
- Supports multiple domains
- Secure configuration

✅ **Documentation:**
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `deploy-checklist.md` - Quick checklist
- Troubleshooting tips

## Features

🌐 **Global Deployment:**
- Frontend on Vercel CDN (fast worldwide)
- Backend on Render/Railway (reliable API)
- Automatic HTTPS
- Custom domain support

📱 **WebXR AR Mode:**
- Works on deployed sites
- HTTPS enabled by default
- Mobile AR fully functional

🔒 **Security:**
- Environment variables for secrets
- CORS protection
- Rate limiting
- JWT authentication ready

## Testing Deployment

After deployment, test these:

1. **Home Page:** `https://your-app.vercel.app`
2. **API Health:** `https://your-backend-url/health`
3. **Monuments:** `https://your-backend-url/api/monuments`
4. **Explore Heritage:** Browse and search monuments
5. **AR Viewer:** Load 3D models
6. **Mobile AR:** Test on phone (Chrome/Safari)

## Costs

**Free Tier:**
- Render: 750 hours/month (sleeps after 15 min)
- Railway: $5 credit/month
- Vercel: 100 GB bandwidth/month

**Recommended for Production:**
- Render Starter: $7/month (no sleep)
- Railway: $5/month (usage-based)
- Vercel: Free tier sufficient

## Support

📚 **Documentation:**
- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Checklist](./deploy-checklist.md)
- [WebXR AR Guide](./WEBXR_AR_GUIDE.md)

🐛 **Troubleshooting:**
- Check deployment logs
- Verify environment variables
- Test API endpoints
- Check CORS configuration

## Next Steps

After deployment:

1. ✅ Test all features
2. ✅ Set up monitoring
3. ✅ Configure custom domain (optional)
4. ✅ Enable analytics
5. ✅ Share your app!

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  - React + TypeScript + Vite            │
│  - Three.js + WebXR                     │
│  - Global CDN                           │
│  - Automatic HTTPS                      │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTPS API Calls
                  │
┌─────────────────▼───────────────────────┐
│      Render/Railway (Backend)           │
│  - Node.js + Express                    │
│  - Monument Preservation API            │
│  - WebSocket Support                    │
│  - JSON Database                        │
└─────────────────────────────────────────┘
```

## URLs After Deployment

```
Frontend:  https://your-app.vercel.app
Backend:   https://ar-heritage-backend.onrender.com
API Docs:  https://backend-url/api
Health:    https://backend-url/health
```

## Ready to Deploy?

Follow the [Deployment Guide](./DEPLOYMENT_GUIDE.md) or use the [Quick Checklist](./deploy-checklist.md).

Your AR Heritage platform will be live in under 10 minutes! 🎉

---

**Questions?** Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.

