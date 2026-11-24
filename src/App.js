import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import './App.css';
import Home from './pages/admin';
import Menu from './pages/Menu';
import GenerateQR from './pages/GenerateQR';
import Booking from './pages/BookingsPage';
import KOTPage from './pages/KOT';
import RoomsPage from './pages/RoomsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const hotelName = 'Grand Horizon Hotel';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login hotelName={hotelName} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected admin/staff routes */}
        <Route path="/admin" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/generate-qr" element={<ProtectedRoute><GenerateQR /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
        <Route path="/room/:hotelId/:roomNumber" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />

        {/* Public routes */}
        <Route path="/menu/:hotelId/:tableNumber" element={<Menu />} />
        <Route path="/kot/:hotelId/:tableNumber" element={<KOTPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;