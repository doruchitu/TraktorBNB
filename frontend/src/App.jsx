import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AdaugaUtilaj from './pages/AdaugaUtilaj';
import Rezervari from './pages/Rezervari';
import Landing from './pages/Landing';

// Componentă care verifică dacă userul e logat
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/adauga-utilaj" element={<ProtectedRoute><AdaugaUtilaj /></ProtectedRoute>} />
        <Route path="/rezervari" element={<ProtectedRoute><Rezervari /></ProtectedRoute>} />

        {/* Exemplu pentru paginile viitoare */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default App;