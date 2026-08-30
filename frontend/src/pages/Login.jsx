import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

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
      setResetMessage("Email trimis cu instrucțiuni.");
    } catch (err) {
      setResetError("Cont inexistent.");
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
      // Înlocuiește cu calea către imaginea ta de fundal cu câmpul noaptea
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Overlay întunecat */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Partea Stângă: Branding */}
        <div className="flex flex-col items-center lg:items-start mb-12 lg:mb-0 lg:w-1/2">
          <div className="flex items-center gap-4">
            {/* Înlocuiește cu iconița ta rotundă */}
            <img src="/FAVICON.png" alt="TraktorShare Icon" className="w-20 h-20 object-contain" />
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-200">
              Traktor<span className="text-[#84cc44]">Share</span>
            </h1>
          </div>
          <div className="mt-4 flex items-center gap-4 w-full">
            <div className="h-px bg-white/20 flex-1 lg:hidden"></div>
            <p className="text-[0.75rem] text-gray-400 font-semibold uppercase tracking-[0.2em] text-center lg:text-left">
              Conectăm fermierii, eficientizăm agricultura.
            </p>
            <div className="h-px bg-white/20 flex-1 lg:hidden"></div>
          </div>
        </div>

        {/* Partea Dreapta*/}
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleLogin}>
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-200 rounded-r text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-[#84cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      className="w-full pl-10 p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                      type="email"
                      placeholder="email@exemplu.ro"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Parolă</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-[#84cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      className="w-full pl-10 p-3 bg-black/40 border border-[#2a4020] text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84cc44] focus:border-transparent transition-all placeholder-gray-500"
                      type="password"
                      placeholder="Parola ta"
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-8 bg-[#1f9b2d] text-white py-3 rounded-xl hover:bg-[#1a8525] shadow-lg transition-all font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Se procesează...' : 'Intră în Cont'}
              </button>
            </form>

            {/* Link-uri Utile */}
            <div className="mt-6 border-t border-white/10 pt-6">
              {!showResetForm ? (
                <div className="text-center space-y-3">
                  <button type="button" onClick={() => setShowResetForm(true)} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Ai uitat parola?
                  </button>
                  <p className="text-sm text-gray-400">
                    Nu ai cont?{' '}
                    <button onClick={() => navigate('/signup')} className="text-[#84cc44] font-medium hover:underline">
                      Înregistrează-te
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    className="w-full p-2 bg-black/40 border border-[#2a4020] text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#84cc44] text-sm placeholder-gray-500"
                    type="email"
                    placeholder="Introdu emailul"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                  {resetError && <p className="text-red-400 text-xs">{resetError}</p>}
                  {resetMessage && <p className="text-[#84cc44] text-xs">{resetMessage}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleResetPassword} className="flex-1 bg-[#84cc44] text-black py-2 rounded-lg text-sm font-bold hover:bg-[#72b33a]">Trimite</button>
                    <button type="button" onClick={() => setShowResetForm(false)} className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-sm hover:bg-gray-600">Anulează</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;