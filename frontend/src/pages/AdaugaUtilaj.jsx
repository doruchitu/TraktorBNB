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
    <div style={{ minHeight: "100vh", background: "#f7f5f0", fontFamily: "Georgia, serif" }}>

      <nav style={{
        background: "#1a2e1a", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/home")}>
          <span style={{ fontSize: "22px" }}>🚜</span>
          <span style={{ color: "#e8d5a3", fontSize: "20px", fontWeight: "bold" }}>TraktorBNB</span>
        </div>
        <button onClick={() => navigate("/home")} style={{
          background: "transparent", color: "#9db89d",
          border: "1px solid #3a5a3a", borderRadius: "6px",
          padding: "8px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
        }}>← Înapoi</button>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>

        <h1 style={{ color: "#1a2e1a", fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center" }}>
          + Adaugă Utilaj Nou
        </h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "2rem" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: step >= s ? "#1a2e1a" : "#e0dcd0",
              color: step >= s ? "#e8d5a3" : "#999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "bold",
            }}>{s}</div>
          ))}
        </div>

        <div style={{
          background: "white", borderRadius: "12px",
          border: "1px solid #e8e0d0", padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {error && (
            <div style={{
              marginBottom: "1rem", padding: "10px", background: "#fef2f2",
              border: "1px solid #fca5a5", borderRadius: "8px",
              color: "#dc2626", fontSize: "13px", fontFamily: "Arial, sans-serif",
            }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ color: "#1a2e1a", marginBottom: "1rem", fontSize: "16px" }}>Detalii utilaj</h3>

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Marcă</label>
              <input
                value={formData.marca}
                onChange={e => updateField("marca", e.target.value)}
                placeholder="ex: John Deere"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", boxSizing: "border-box", marginBottom: "1rem",
                }}
              />

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Model</label>
              <input
                value={formData.model}
                onChange={e => updateField("model", e.target.value)}
                placeholder="ex: 6130R"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", boxSizing: "border-box", marginBottom: "1rem",
                }}
              />

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Putere (CP)</label>
              <input
                type="number"
                value={formData.putere_cp}
                onChange={e => updateField("putere_cp", e.target.value)}
                placeholder="ex: 130"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ color: "#1a2e1a", marginBottom: "1rem", fontSize: "16px" }}>Locație, preț și disponibilitate</h3>

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Județ</label>
              <select
                value={formData.judet}
                onChange={e => updateField("judet", e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", boxSizing: "border-box", marginBottom: "1rem",
                  background: "white",
                }}
              >
                <option value="">Selectează județul</option>
                {judete.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Preț pe zi (lei)</label>
              <input
                type="number"
                value={formData.pret_zi}
                onChange={e => updateField("pret_zi", e.target.value)}
                placeholder="ex: 450"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", boxSizing: "border-box", marginBottom: "1rem",
                }}
              />

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Disponibil de la</label>
                  <input
                    type="date"
                    value={formData.data_disponibil_de}
                    onChange={e => updateField("data_disponibil_de", e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: "8px",
                      border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Disponibil până la</label>
                  <input
                    type="date"
                    value={formData.data_disponibil_pana}
                    onChange={e => updateField("data_disponibil_pana", e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: "8px",
                      border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ color: "#1a2e1a", marginBottom: "1rem", fontSize: "16px" }}>Poză și descriere</h3>

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Fotografie utilaj</label>
              <div style={{
                border: "2px dashed #ccc", borderRadius: "8px",
                padding: imagePreview ? "0" : "2rem", textAlign: "center",
                marginBottom: "1rem", overflow: "hidden",
              }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                ) : (
                  <label style={{ cursor: "pointer", display: "block" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
                    <p style={{ color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
                      {uploading ? "Se încarcă..." : "Click pentru a încărca o poză"}
                    </p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                )}
              </div>

              <label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>Descriere</label>
              <textarea
                value={formData.descriere}
                onChange={e => updateField("descriere", e.target.value)}
                placeholder="Detalii despre utilaj, condiții, accesorii..."
                rows={4}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                  outline: "none", resize: "vertical", boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            {step > 1 ? (
              <button onClick={prevStep} style={{
                background: "white", color: "#1a2e1a",
                border: "1px solid #1a2e1a", borderRadius: "8px",
                padding: "10px 24px", cursor: "pointer", fontFamily: "Georgia, serif",
              }}>← Înapoi</button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={nextStep} style={{
                background: "#1a2e1a", color: "#e8d5a3",
                border: "none", borderRadius: "8px",
                padding: "10px 24px", cursor: "pointer", fontFamily: "Georgia, serif",
              }}>Continuă →</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || uploading} style={{
                background: (loading || uploading) ? "#ccc" : "#1a2e1a",
                color: "#e8d5a3", border: "none", borderRadius: "8px",
                padding: "10px 24px", cursor: (loading || uploading) ? "not-allowed" : "pointer",
                fontFamily: "Georgia, serif",
              }}>
                {loading ? "Se publică..." : "🚜 Publică Utilajul"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}