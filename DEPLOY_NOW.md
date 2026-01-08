# 🚀 Quick Deployment Script

## Step 1: Update Frontend API URLs (IMPORTANT!)

Before deploying, you need to replace all hardcoded `http://localhost:5000` with the API_URL config.

I've created `frontend/src/config/api.js` for you. Now import and use it in your files.

**Example:**
```javascript
// Before:
const res = await axios.get('http://localhost:5000/api/food');

// After:
import API_URL from '../config/api';
const res = await axios.get(`${API_URL}/api/food`);
```

**Files to update** (26 occurrences total):
- AdminOrders.jsx
- TrackOrder.jsx
- Register.jsx
- MyOrders.jsx
- Home.jsx
- Login.jsx
- DeliveryDashboard.jsx
- AdminDashboard.jsx
- Cart.jsx
- FoodCard.jsx

---

## Step 2: Initialize Git Repository

```bash
cd C:\Users\ashan\OneDrive\Desktop\Foodie
git init
git add .
git commit -m "Initial commit - Foodie delivery app with live tracking"
```

---

## Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `foodie-delivery-app`
3. Make it **Public** or **Private**
4. Click **Create repository**

---

## Step 4: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/foodie-delivery-app.git
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy Backend to Render

1. **Sign up**: [render.com](https://render.com) (use GitHub)
2. **New Web Service** → Connect repository
3. **Settings**:
   - Name: `foodie-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables** (copy from `backend/.env`):
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
5. **Deploy** → Copy your URL: `https://foodie-backend-xxxx.onrender.com`

---

## Step 6: Update Frontend Production Config

Edit `frontend/.env.production`:
```
VITE_API_URL=https://foodie-backend-xxxx.onrender.com
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

---

## Step 7: Deploy Frontend to Netlify

1. **Sign up**: [netlify.com](https://netlify.com) (use GitHub)
2. **New site from Git** → Choose repository
3. **Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://foodie-backend-xxxx.onrender.com
   ```
5. **Deploy** → Your site: `https://random-name.netlify.app`

---

## Step 8: Update Backend CORS

Add your Netlify URL to `backend/src/server.js`:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://your-site.netlify.app'  // Add this
    ],
    credentials: true
};
```

Commit and push → Render auto-deploys!

---

## ✅ Done!

Your app is now live at:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://foodie-backend-xxxx.onrender.com

---

## 🎯 Quick Test Checklist

- [ ] Register new user
- [ ] Login works
- [ ] Browse menu
- [ ] Add to cart
- [ ] Place order
- [ ] Track order (live map)
- [ ] Delivery dashboard (location sharing)
- [ ] Owner dashboard (manage orders)

---

## ⚠️ Important Notes

1. **First load slow**: Render free tier sleeps after 15min → first request takes 30-60s
2. **MongoDB Atlas**: Ensure Network Access allows `0.0.0.0/0`
3. **HTTPS only**: Both platforms use HTTPS automatically
4. **Auto-deploy**: Push to GitHub → auto-deploys on both platforms

---

## 📊 Free Tier Limits

- **Render**: 750 hours/month (enough for 1 app)
- **Netlify**: 100GB bandwidth, 300 build minutes
- **MongoDB Atlas**: 512MB storage

All FREE! 🎉
