// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './pages/SignUp';
import Login from './pages/Login';
import ShopKeeper_Signup from './pages/ShopKeeper_Signup';
import AdminSignUp from './pages/admin_signup';

import AdminDashboard from './pages/AdminDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import ShareLocation from './pages/ShareLocation';

import Navbar1 from './components/Navbar1';
import Navbar2 from './components/Navbar2';
import ShopsPage from './pages/ShopsPage';
import FindProduct from './pages/FindProduct';

import ProductsPage from './pages/ProductsPage'; // ← newly added

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {isLoggedIn ? <Navbar2 /> : <Navbar1 />}

      <Routes>
        {/* Public pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/shopkeeper-signup" element={<ShopKeeper_Signup />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/shopkeeper-dashboard" element={<ShopkeeperDashboard />} />

        {/* Location sharing */}
        <Route path="/location" element={<ShareLocation />} />

        {/* Shops page */}
        <Route path="/shops" element={<ShopsPage />} />

        {/* Find Products page */}
        <Route path="/find-products" element={<FindProduct />} />

        {/* New: Products of a specific shop */}
         <Route path="/shop/:shopId/products" element={<ProductsPage />} />

        {/* Optionally add a home or 404 route here */}
      </Routes>
    </Router>
  );
};

export default App;
