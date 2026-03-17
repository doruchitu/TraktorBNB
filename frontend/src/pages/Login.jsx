import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", formData);
      alert("Login reușit!");
      // După login, îl trimitem pe pagina principală (pe care o vom face ulterior)
      navigate('/');
    } catch (err) {
      alert("Email sau parolă incorectă.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Login TraktorBNB</h2>
        <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" 
               onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Parolă" 
               onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
          Intră în Cont
        </button>
        <p className="mt-4 text-center text-sm">
          Nu ai cont? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}>Înregistrează-te</span>
        </p>
      </form>
    </div>
  );
}

export default Login;