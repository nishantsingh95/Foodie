import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Cart from './pages/Cart';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import LocationModal from './components/LocationModal';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LocationProvider>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/delivery" element={<DeliveryDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/myorders" element={<MyOrders />} />
                <Route path="/track/:id" element={<TrackOrder />} />
              </Routes>
              <LocationModal />
              <ToastContainer position="bottom-right" theme="dark" />
            </div>
          </Router>
        </LocationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
