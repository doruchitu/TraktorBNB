import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AdaugaUtilaj from './pages/AdaugaUtilaj';
import Rezervari from './pages/Rezervari';
import Landing from './pages/Landing';
import CumFunctioneaza from "./pages/CumFunctioneaza";
import Ghiduri from "./pages/Ghiduri";
import Contact from "./pages/Contact";
import Termeni from './pages/Termeni';
import Confidentialitate from './pages/Confidentialitate';
import CookieBanner from './components/CookieBanner';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0d1a0d", color: "#e8d5a3", fontFamily: "Georgia, serif",
      }}>
        Se verifică autentificarea...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
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
        <Route path="/cum-functioneaza" element={<CumFunctioneaza />} />
        <Route path="/ghiduri" element={<Ghiduri />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termeni" element={<Termeni />} />
        <Route path="/confidentialitate" element={<Confidentialitate />} />
      </Routes>
      <CookieBanner />
    </Router>
  );
}

export default App;