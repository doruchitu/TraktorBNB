import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-600 text-center">
          🚜 TraktorBNB
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