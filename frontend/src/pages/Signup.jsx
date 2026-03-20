import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    nume: '', prenume: '', email: '', telefon: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.nume || !formData.prenume) return 'Numele și prenumele sunt obligatorii.';
    if (!formData.email.includes('@')) return 'Email invalid.';
    if (formData.telefon.length < 10) return 'Număr de telefon invalid.';
    if (formData.password.length < 6) return 'Parola trebuie să aibă minim 6 caractere.';
    if (formData.password !== formData.confirmPassword) return 'Parolele nu coincid.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/users/", {
        nume: formData.nume,
        prenume: formData.prenume,
        email: formData.email,
        telefon: formData.telefon,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Eroare la înregistrare.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          🚜 Creează Cont TraktorBNB
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Nume" onChange={handleChange('nume')} />
          <input className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Prenume" onChange={handleChange('prenume')} />
        </div>

        <input className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="email" placeholder="Email" onChange={handleChange('email')} />

        <input className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="tel" placeholder="Telefon (ex: 07xxxxxxxx)" onChange={handleChange('telefon')} />

        <input className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password" placeholder="Parolă (minim 6 caractere)" onChange={handleChange('password')} />

        <input className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password" placeholder="Confirmă Parola" onChange={handleChange('confirmPassword')} />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50"
        >
          {loading ? 'Se creează contul...' : 'Creează Cont'}
        </button>

        <p className="mt-4 text-center text-sm">
          Ai deja cont?{' '}
          <span className="text-green-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Intră în cont
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;