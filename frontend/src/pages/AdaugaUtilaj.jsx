import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { auth } from "../firebase";

const judete = ["Cluj", "Timiș", "Brașov", "Iași", "Sibiu", "Mureș", "Alba", "Galați", "Suceava", "Dolj"];

export default function AdaugaUtilaj() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    marca: "", model: "", putere_cp: "",
    judet: "", pret_zi: "",
    data_disponibil_de: "", data_disponibil_pana: "",
    descriere: "", imagine_url: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadData }
      );
      const data = await res.json();
      updateField("imagine_url", data.secure_url);
    } catch (err) {
      setError("Eroare la încărcarea imaginii.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await api.post("/machinery/", {
        ...formData,
        putere_cp: formData.putere_cp ? parseInt(formData.putere_cp) : null,
        pret_zi: parseFloat(formData.pret_zi),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Eroare la adăugarea utilajului.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.marca || !formData.model)) {
      setError("Completează marca și modelul.");
      return;
    }
    if (step === 2 && (!formData.judet || !formData.pret_zi)) {
      setError("Completează județul și prețul pe zi.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-serif">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] h-14 md:h-16 bg-[#1a2e1a] px-4 md:px-8 flex items-center justify-between shadow-md">
        <div 
          className="flex items-center gap-1.5 md:gap-2.5 cursor-pointer" 
          onClick={() => navigate("/home")}
        >
          <div className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <span className="text-[#e8d5a3] text-[16px] md:text-[20px] font-bold tracking-[0.5px]">TraktorShare</span>
        </div>
        <button 
          onClick={() => navigate("/home")} 
          className="bg-transparent hover:bg-[#2d4a2d] text-[#9db89d] border border-[#3a5a3a] rounded-md px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-[13px] transition-colors font-sans whitespace-nowrap"
        >
          ← Înapoi
        </button>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="max-w-[600px] mx-auto px-4 py-8 md:py-12">

        <h1 className="text-[#1a2e1a] text-2xl md:text-3xl mb-6 md:mb-8 text-center font-bold">
          + Adaugă Utilaj Nou
        </h1>

        {/* PROGRESS STEPS */}
        <div className="flex justify-center gap-2 md:gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] md:text-sm font-bold transition-colors ${
                step >= s ? "bg-[#1a2e1a] text-[#e8d5a3]" : "bg-[#e0dcd0] text-[#999]"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl border border-[#e8e0d0] p-6 md:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-300 rounded-lg text-red-600 text-[13px] font-sans">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-[#1a2e1a] mb-4 text-lg font-bold">Detalii utilaj</h3>

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Marcă</label>
              <input
                value={formData.marca}
                onChange={e => updateField("marca", e.target.value)}
                placeholder="ex: John Deere"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] mb-4 transition-shadow box-border"
              />

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Model</label>
              <input
                value={formData.model}
                onChange={e => updateField("model", e.target.value)}
                placeholder="ex: 6130R"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] mb-4 transition-shadow box-border"
              />

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Putere (CP)</label>
              <input
                type="number"
                value={formData.putere_cp}
                onChange={e => updateField("putere_cp", e.target.value)}
                placeholder="ex: 130"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] transition-shadow box-border"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-[#1a2e1a] mb-4 text-lg font-bold">Locație, preț și disponibilitate</h3>

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Județ</label>
              <select
                value={formData.judet}
                onChange={e => updateField("judet", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] mb-4 transition-shadow box-border bg-white"
              >
                <option value="">Selectează județul</option>
                {judete.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Preț pe zi (lei)</label>
              <input
                type="number"
                value={formData.pret_zi}
                onChange={e => updateField("pret_zi", e.target.value)}
                placeholder="ex: 450"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] mb-4 transition-shadow box-border"
              />

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Disponibil de la</label>
                  <input
                    type="date"
                    value={formData.data_disponibil_de}
                    onChange={e => updateField("data_disponibil_de", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] transition-shadow box-border"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Disponibil până la</label>
                  <input
                    type="date"
                    value={formData.data_disponibil_pana}
                    onChange={e => updateField("data_disponibil_pana", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] transition-shadow box-border"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-[#1a2e1a] mb-4 text-lg font-bold">Poză și descriere</h3>

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Fotografie utilaj</label>
              <div className={`border-2 border-dashed border-gray-300 rounded-lg text-center mb-4 overflow-hidden transition-colors hover:bg-gray-50 ${imagePreview ? 'p-0' : 'p-8'}`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full max-h-[200px] object-cover block" />
                ) : (
                  <label className="cursor-pointer block w-full h-full">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-gray-500 text-[13px] font-sans m-0">
                      {uploading ? "Se încarcă..." : "Click pentru a încărca o poză"}
                    </p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <label className="block text-[13px] text-gray-500 mb-1.5 font-sans">Descriere</label>
              <textarea
                value={formData.descriere}
                onChange={e => updateField("descriere", e.target.value)}
                placeholder="Detalii despre utilaj, condiții, accesorii..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] transition-shadow box-border resize-y"
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 ? (
              <button 
                onClick={prevStep} 
                className="bg-white text-[#1a2e1a] border border-[#1a2e1a] rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-[14px] md:text-base cursor-pointer font-serif font-bold hover:bg-gray-50 transition-colors"
              >
                ← Înapoi
              </button>
            ) : <div />}

            {step < 3 ? (
              <button 
                onClick={nextStep} 
                className="bg-[#1a2e1a] text-[#e8d5a3] border-none rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-[14px] md:text-base cursor-pointer font-serif font-bold hover:bg-[#2d4a2d] transition-colors"
              >
                Continuă →
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading || uploading} 
                className={`flex items-center gap-2 border-none rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-[14px] md:text-base font-serif font-bold transition-colors ${
                  (loading || uploading) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1a2e1a] text-[#e8d5a3] hover:bg-[#2d4a2d] cursor-pointer"
                }`}
              >
                {loading ? "Se publică..." : (
                  <>
                    <div className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
                    Publică Utilajul
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}