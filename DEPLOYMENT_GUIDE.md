# 🚀 Foodie App Deployment Guide

## Deployment Architecture

**Frontend**: Netlify (Static React App)  
**Backend**: Render.com (Node.js + Socket.IO)  
**Database**: MongoDB Atlas (Already configured ✅)

---

## Prerequisites

- ✅ MongoDB Atlas connected (Done!)
- ⏳ GitHub account
- ⏳ Netlify account (free)
- ⏳ Render account (free)

---

## Step 1: Push Code to GitHub

```bash
cd C:\Users\ashan\OneDrive\Desktop\Foodie
git init
git add .
git commit -m "Initial commit - Foodie delivery app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foodie-app.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `foodie-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 2.3 Add Environment Variables
Click **"Environment"** and add:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://foodie-backend-xxxx.onrender.com`

---

## Step 3: Update Frontend for Production

### 3.1 Update `.env.production`
Replace `YOUR_RENDER_APP_NAME` with your actual Render app name:

```bash
VITE_API_URL=https://foodie-backend-xxxx.onrender.com
```

### 3.2 Update API Calls (if needed)
The frontend should use `import.meta.env.VITE_API_URL` for API calls.

Check files and update hardcoded `http://localhost:5000` to use environment variable.

---

## Step 4: Deploy Frontend to Netlify

### 4.1 Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### 4.2 Deploy Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** and select your repository
3. Configure:
   - **Branch**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4.3 Environment Variables
Add in Netlify dashboard under **Site settings** → **Environment variables**:

```
VITE_API_URL=https://foodie-backend-xxxx.onrender.com
```

### 4.4 Deploy
1. Click **"Deploy site"**
2. Wait for build (2-5 minutes)
3. Your site will be live at: `https://random-name.netlify.app`

---

## Step 5: Update Backend CORS

Update `backend/src/server.js` to allow your Netlify domain:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://your-app-name.netlify.app'  // Add your Netlify URL
    ],
    credentials: true
};
```

Push changes and Render will auto-deploy.

---

## Step 6: Configure Custom Domain (Optional)

### Netlify:
1. **Site settings** → **Domain management**
2. Add custom domain
3. Update DNS records

### Render:
1. **Settings** → **Custom Domain**
2. Add domain and update DNS

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds

**Netlify Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Instant loading

### MongoDB Atlas
- Ensure **Network Access** allows all IPs: `0.0.0.0/0`
- Or add Render's IP addresses

---

## Testing Deployment

1. **Frontend**: Visit your Netlify URL
2. **Backend**: Visit `https://your-backend.onrender.com/api/menu`
3. **Test features**:
   - User registration/login
   - Place order
   - Track order with live location
   - Admin dashboard

---

## Troubleshooting

### Backend not responding
- Check Render logs
- Verify environment variables
- Check MongoDB connection

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Check browser console for errors

### Socket.IO not working
- Ensure Render backend is running
- Check WebSocket connection in browser DevTools

---

## Cost Estimate

**Total Monthly Cost**: **$0** (Free tier)

- MongoDB Atlas: Free (512MB)
- Render: Free (750 hours)
- Netlify: Free (100GB bandwidth)

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up custom domain
3. ✅ Enable HTTPS (automatic on both platforms)
4. ✅ Monitor usage and performance
5. ✅ Set up error tracking (optional: Sentry)

---

## Support

If you encounter issues:
1. Check Render logs
2. Check Netlify build logs
3. Verify environment variables
4. Test API endpoints directly

Your Foodie app is now live! 🎉
