# 🍔 Foodie - Full-Stack Food Delivery Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fodieee.netlify.app-brightgreen?style=for-the-badge&logo=netlify)](https://fodieee.netlify.app/)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2FExpress-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-black?style=for-the-badge&logo=socketdotio)](https://socket.io/)

**Foodie** is a feature-rich, full-stack food delivery application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time order tracking with Leaflet maps, multi-role access control (Customer, Restaurant Owner, Delivery Partner), and dynamic cart & checkout management.

🌐 **Live Demo:** [https://fodieee.netlify.app/](https://fodieee.netlify.app/)  
⚙️ **Backend API:** [https://foodie-backend-2bpt.onrender.com](https://foodie-backend-2bpt.onrender.com)

---

## 🚀 Features

### 👤 Customer Experience
- **Browse & Filter Menu:** Search for delicious meals across various categories and restaurants.
- **Cart & Checkout:** Add items to cart, manage quantities, and place orders smoothly.
- **Real-Time Order Tracking:** Watch your delivery partner move on an interactive **Leaflet Map** with live updates via **Socket.io**.
- **User Authentication:** Register & login with email/password or Google OAuth 2.0.

### 🏪 Restaurant Owner Dashboard
- **Menu Management:** Add, edit, and delete food items with image uploads via Cloudinary.
- **Order Management:** View incoming orders, accept/reject, and update order statuses (Preparing, Ready for Pickup, Out for Delivery, Delivered).

### 🛵 Delivery Partner Dashboard
- **Active Job Management:** View assigned orders with pickup and drop-off locations.
- **Live Location Updates:** Share real-time GPS/location updates to track delivery progress on the map.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management & Routing:** React Router v7
- **Animations & UI:** Framer Motion, React Icons, React Toastify
- **Mapping & Real-Time:** Leaflet, React-Leaflet, Socket.io-client
- **HTTP Client:** Axios

### Backend
- **Runtime & Framework:** Node.js, Express.js (v5)
- **Database:** MongoDB with Mongoose ORM
- **Real-Time Communication:** Socket.io
- **Auth & Security:** JWT (JSON Web Tokens), Passport.js (Google OAuth 2.0), Bcrypt.js
- **File Storage:** Cloudinary & Multer
- **Mail Services:** Nodemailer

### Deployment & Infrastructure
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas

---

## 📁 Project Structure

```text
Foodie/
├── frontend/             # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Cart, Map, Protected Routes
│   │   ├── context/      # AuthContext, CartContext, SocketContext
│   │   ├── pages/        # Home, Menu, TrackOrder, Dashboards (Owner/Delivery)
│   │   ├── services/     # Axios API service instances
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express Backend
│   ├── src/
│   │   ├── config/       # Database & Auth configuration
│   │   ├── controllers/  # Auth, Food, Order, Tracking, Upload controllers
│   │   ├── middleware/   # Auth middleware, multer upload middleware
│   │   ├── models/       # Mongoose Schemas (User, Food, Order, Shop)
│   │   ├── routes/       # API routes
│   │   └── server.js     # Entry point & Socket.io server
│   └── package.json
├── netlify.toml          # Netlify build configuration
└── render.yaml           # Render deployment configuration
```

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```
*For production, set `VITE_API_URL=https://foodie-backend-2bpt.onrender.com` in Netlify settings.*

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/nishantsingh95/Foodie.git
cd Foodie
```

### 2. Set up Backend
```bash
cd backend
npm install
# Create a .env file based on the environment variables section above
npm run dev
```
Backend will start at `http://localhost:5000`.

### 3. Set up Frontend
```bash
# Open a new terminal tab/window
cd frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000
npm run dev
```
Frontend will start at `http://localhost:5173`.

---

## 🌐 Live Demo & Deployment Links

- **Live Application:** [https://fodieee.netlify.app/](https://fodieee.netlify.app/)
- **API Endpoint:** [https://foodie-backend-2bpt.onrender.com](https://foodie-backend-2bpt.onrender.com)

---

## 👤 Author

Developed by **Nishant Singh**
- GitHub: [@nishantsingh95](https://github.com/nishantsingh95)
