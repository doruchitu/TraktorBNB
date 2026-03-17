import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    nume: '', prenume: '', email: '', telefon: '', password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/users/", formData);
      alert("Cont creat cu succes!");
    } catch (err) {
      alert("Eroare la înregistrare.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-700">TraktorBNB Signup</h2>
        <input className="w-full mb-4 p-2 border rounded" placeholder="Nume" 
               onChange={e => setFormData({...formData, nume: e.target.value})} />
        <input className="w-full mb-4 p-2 border rounded" placeholder="Prenume" 
               onChange={e => setFormData({...formData, prenume: e.target.value})} />
        <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" 
               onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="w-full mb-4 p-2 border rounded" placeholder="Telefon" 
               onChange={e => setFormData({...formData, telefon: e.target.value})} />
        <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Parolă" 
               onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Creează Cont
        </button>
      </form>
    </div>
  );
}

export default App;