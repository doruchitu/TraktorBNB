import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import api from '../services/api';

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
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await updateProfile(userCredential.user, {
        displayName: `${formData.nume} ${formData.prenume}`
      });

      await api.post("/users/", {
        nume: formData.nume,
        prenume: formData.prenume,
        email: formData.email,
        telefon: formData.telefon,
        password: formData.password,
      });

      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email-ul este deja folosit.');
      } else {
        setError(err.response?.data?.detail || 'Eroare la înregistrare.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center py-12"
      // Folosește aceeași imagine ca la Login sau una similară
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Overlay întunecat */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Partea Stângă: Branding & Beneficii */}
        <div className="flex flex-col items-center lg:items-start lg:w-1/2 w-full mb-6 lg:mb-0">
          <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-4">
            <img 
              src="/FAVICON.png" 
              alt="TraktorShare Icon" 
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain" 
            />
            {/* Titlu adaptiv */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-200">
              Traktor<span className="text-[#84cc44]">Share</span>
            </h1>
          </div>
          
          <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-4 w-full px-2">
            <div className="h-px bg-white/20 flex-1 lg:hidden"></div>
            <p className="text-[10px] md:text-[0.75rem] text-gray-400 font-semibold uppercase tracking-[0.1em] md:tracking-[0.2em] text-center lg:text-left">
              Conectăm fermierii, eficientizăm agricultura.
            </p>
            <div className="h-px bg-white/20 flex-1 lg:hidden"></div>
          </div>
          
          {/* Listă avantaje (vizibilă doar pe desktop, nu o modificăm) */}
          <div className="hidden lg:block mt-12 text-gray-300">
            <h3 className="text-xl font-medium mb-4 text-white">Alătură-te comunității:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#84cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Găsește rapid utilajele de care ai nevoie în zona ta</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#84cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Închiriază propriile utilaje și generează venituri</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#84cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Consultă asistentul nostru inteligent (AI) oricând</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partea Dreaptă: Formular Glassmorphism */}
        <div className="w-full max-w-lg">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Creare Cont</h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-200 rounded-r text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Nume si Prenume */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nume</label>
                    <input
                      className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                      placeholder="Ex: Popescu"
                      onChange={handleChange('nume')}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Prenume</label>
                    <input
                      className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                      placeholder="Ex: Ion"
                      onChange={handleChange('prenume')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                    type="email"
                    placeholder="fermier@exemplu.ro"
                    onChange={handleChange('email')}
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefon</label>
                  <input
                    className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                    type="tel"
                    placeholder="07xxxxxxxx"
                    onChange={handleChange('telefon')}
                  />
                </div>

                {/* Parola & Confirmare */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Parolă</label>
                        <input
                        className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                        type="password"
                        placeholder="Minim 6 caractere"
                        onChange={handleChange('password')}
                        />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirmă Parolă</label>
                        <input
                        className="w-full p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                        type="password"
                        placeholder="Confirmă parola"
                        onChange={handleChange('confirmPassword')}
                        />
                    </div>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-8 bg-[#1f9b2d] text-white py-3 rounded-xl hover:bg-[#1a8525] shadow-lg transition-all font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Se creează contul...' : 'Creează Cont'}
              </button>
            </form>

            {/* Link către Login */}
            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-gray-400">
                Ai deja cont?{' '}
                <button onClick={() => navigate('/login')} className="text-[#84cc44] font-medium hover:underline">
                  Intră în cont
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;