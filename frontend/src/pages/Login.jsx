import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { sendPasswordResetEmail } from "firebase/auth";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ nume: userCredential.user.displayName || formData.email }));
      navigate('/home');
    } catch (err) {
      setError('Email sau parolă incorectă.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetError("");
    setResetMessage("");
    if (!resetEmail.trim()) {
      setResetError("Introdu adresa de email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Ți-am trimis un email cu instrucțiuni de resetare.");
    } catch (err) {
      setResetError("Nu am găsit un cont cu acest email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-600 text-center">
          🚜 TraktorShare
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="email"
          placeholder="Email"
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <input
          className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password"
          placeholder="Parolă"
          onChange={e => setFormData({...formData, password: e.target.value})}
        />
        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50"
        >
          {loading ? 'Se încarcă...' : 'Intră în Cont'}
        </button>

        {!showResetForm ? (
          <p className="mt-4 text-center text-sm">
            <span
              className="text-green-600 cursor-pointer hover:underline"
              onClick={() => setShowResetForm(true)}
            >
              Ai uitat parola?
            </span>
          </p>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <input
              className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              placeholder="Emailul tău"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
            />
            {resetError && (
              <p className="text-red-600 text-xs mb-2">{resetError}</p>
            )}
            {resetMessage && (
              <p className="text-green-600 text-xs mb-2">{resetMessage}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetPassword}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-bold"
              >
                Trimite link
              </button>
              <button
                type="button"
                onClick={() => { setShowResetForm(false); setResetError(""); setResetMessage(""); }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Anulează
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-sm">
          Nu ai cont?{' '}
          <span className="text-green-500 cursor-pointer hover:underline" onClick={() => navigate('/signup')}>
            Înregistrează-te
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;