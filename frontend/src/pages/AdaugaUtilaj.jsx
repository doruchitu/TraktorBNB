import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from '../firebase';

const judete = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța",
  "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita",
  "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș",
  "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava",
  "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea", "București"
];

const tipuriUtilaj = [
  "Tractor", "Combină", "Plug", "Semănătoare", "Pulverizator",
  "Remorcă", "Încărcător frontal", "Cultivator", "Disc", "Alt utilaj"
];

export default function AdaugaUtilaj() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    marca: "",
    model: "",
    tip: "",
    putere_cp: "",
    judet: "",
    pret_zi: "",
    descriere: "",
    imagine_url: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.marca) return "Marca este obligatorie.";
    if (!formData.model) return "Modelul este obligatoriu.";
    if (!formData.tip) return "Tipul utilajului este obligatoriu.";
    return null;
  };

  const validateStep2 = () => {
    if (!formData.judet) return "Județul este obligatoriu.";
    if (!formData.pret_zi || isNaN(formData.pret_zi) || Number(formData.pret_zi) <= 0)
      return "Prețul pe zi trebuie să fie un număr pozitiv.";
    return null;
  };

  const handleNext = () => {
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) { setError(err); return; }
    setError("");
    setStep(step + 1);
  };

const handleSubmit = async () => {
  setLoading(true);
  setError("");
  try {
    const token = await auth.currentUser.getIdToken();  // ← token Firebase proaspăt
    await axios.post("http://localhost:8000/machinery/", {
      ...formData,
      putere_cp: formData.putere_cp ? parseInt(formData.putere_cp) : null,
      pret_zi: parseFloat(formData.pret_zi),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSuccess(true);
  } catch (err) {
    setError(err.response?.data?.detail || "Eroare la adăugarea utilajului.");
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #d4e8d4",
    fontSize: "15px",
    fontFamily: "Georgia, serif",
    background: "#fafff8",
    outline: "none",
    color: "#1a2e1a",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#5a7a5a",
    marginBottom: "6px",
    fontWeight: "bold",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "80px", marginBottom: "24px" }}>🚜</div>
          <h2 style={{ color: "#1a2e1a", fontSize: "28px", marginBottom: "12px" }}>Utilaj adăugat cu succes!</h2>
          <p style={{ color: "#5a7a5a", marginBottom: "32px", fontFamily: "Arial, sans-serif" }}>
            Utilajul tău este acum disponibil pentru închiriere.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={() => { setSuccess(false); setStep(1); setFormData({ marca: "", model: "", tip: "", putere_cp: "", judet: "", pret_zi: "", descriere: "", imagine_url: "" }); }}
              style={{ padding: "12px 24px", background: "white", border: "1.5px solid #1a2e1a", borderRadius: "8px", color: "#1a2e1a", fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Adaugă alt utilaj
            </button>
            <button onClick={() => navigate("/home")}
              style={{ padding: "12px 24px", background: "#1a2e1a", border: "none", borderRadius: "8px", color: "#e8d5a3", fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Înapoi la Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0", fontFamily: "Georgia, serif" }}>

      {/* Navbar */}
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

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)",
        padding: "3rem 2rem 2rem",
        textAlign: "center",
      }}>
        <p style={{ color: "#9db89d", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px", fontFamily: "Arial, sans-serif" }}>
          Pune-ți utilajul la treabă
        </p>
        <h1 style={{ color: "#e8d5a3", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "2rem", lineHeight: 1.2 }}>
          Adaugă un utilaj nou
        </h1>

        {/* Progress steps */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0" }}>
          {[
            { num: 1, label: "Detalii utilaj" },
            { num: 2, label: "Locație & Preț" },
            { num: 3, label: "Descriere" },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: step >= s.num ? "#7dc47d" : "rgba(255,255,255,0.15)",
                  color: step >= s.num ? "#1a2e1a" : "#9db89d",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "bold", fontFamily: "Arial, sans-serif",
                  transition: "all 0.3s",
                }}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span style={{ fontSize: "11px", color: step >= s.num ? "#e8d5a3" : "#9db89d", fontFamily: "Arial, sans-serif", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  width: "80px", height: "2px", marginBottom: "20px",
                  background: step > s.num ? "#7dc47d" : "rgba(255,255,255,0.15)",
                  transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <div style={{
          background: "white", borderRadius: "16px",
          border: "1px solid #e8e0d0", padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>

          {error && (
            <div style={{ marginBottom: "1.5rem", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#dc2626", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ color: "#1a2e1a", fontSize: "20px", marginBottom: "1.5rem", borderBottom: "2px solid #e8f5e8", paddingBottom: "12px" }}>
                🔧 Detalii utilaj
              </h2>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>Tip utilaj *</label>
                <select value={formData.tip} onChange={handleChange("tip")} style={inputStyle}>
                  <option value="">Selectează tipul...</option>
                  {tipuriUtilaj.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
                <div>
                  <label style={labelStyle}>Marcă *</label>
                  <input style={inputStyle} placeholder="ex: John Deere" value={formData.marca} onChange={handleChange("marca")}
                    onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                    onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input style={inputStyle} placeholder="ex: 6130R" value={formData.model} onChange={handleChange("model")}
                    onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                    onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Putere (CP) — opțional</label>
                <input style={inputStyle} type="number" placeholder="ex: 130" value={formData.putere_cp} onChange={handleChange("putere_cp")}
                  onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                  onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
              </div>

              {(formData.marca || formData.model) && (
                <div style={{ background: "#f0f7f0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem", border: "1px solid #d4e8d4" }}>
                  <p style={{ fontSize: "12px", color: "#5a7a5a", fontFamily: "Arial, sans-serif", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>Previzualizare</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1a2e1a", margin: 0 }}>
                    {formData.marca || "—"} {formData.model || "—"}
                  </p>
                  {formData.putere_cp && <p style={{ fontSize: "13px", color: "#5a7a5a", margin: "4px 0 0", fontFamily: "Arial, sans-serif" }}>⚡ {formData.putere_cp} CP</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ color: "#1a2e1a", fontSize: "20px", marginBottom: "1.5rem", borderBottom: "2px solid #e8f5e8", paddingBottom: "12px" }}>
                📍 Locație & Preț
              </h2>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>Județul *</label>
                <select value={formData.judet} onChange={handleChange("judet")} style={inputStyle}>
                  <option value="">Selectează județul...</option>
                  {judete.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Preț pe zi (RON) *</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...inputStyle, paddingRight: "60px" }} type="number" placeholder="ex: 450"
                    value={formData.pret_zi} onChange={handleChange("pret_zi")}
                    onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                    onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
                  <span style={{
                    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                    color: "#5a7a5a", fontSize: "13px", fontFamily: "Arial, sans-serif", pointerEvents: "none"
                  }}>RON/zi</span>
                </div>
              </div>

              {formData.pret_zi && formData.judet && (
                <div style={{ background: "#f0f7f0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem", border: "1px solid #d4e8d4" }}>
                  <p style={{ fontSize: "12px", color: "#5a7a5a", fontFamily: "Arial, sans-serif", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Estimare venituri</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      { label: "Săptămânal", zile: 7 },
                      { label: "Lunar", zile: 30 },
                      { label: "Sezonier", zile: 90 },
                    ].map(e => (
                      <div key={e.label} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "16px", fontWeight: "bold", color: "#2d4a2d", margin: 0 }}>
                          {(Number(formData.pret_zi) * e.zile).toLocaleString()} lei
                        </p>
                        <p style={{ fontSize: "11px", color: "#5a7a5a", margin: "2px 0 0", fontFamily: "Arial, sans-serif" }}>{e.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ color: "#1a2e1a", fontSize: "20px", marginBottom: "1.5rem", borderBottom: "2px solid #e8f5e8", paddingBottom: "12px" }}>
                📝 Descriere — opțional
              </h2>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>Descriere utilaj</label>
                <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical", lineHeight: 1.6 }}
                  placeholder="Descrie starea utilajului, dotările speciale, condiții de utilizare..."
                  value={formData.descriere} onChange={handleChange("descriere")}
                  onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                  onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>URL Imagine — opțional</label>
                <input style={inputStyle} placeholder="https://..." value={formData.imagine_url} onChange={handleChange("imagine_url")}
                  onFocus={e => e.target.style.borderColor = "#4a7c4a"}
                  onBlur={e => e.target.style.borderColor = "#d4e8d4"} />
              </div>

              <div style={{ background: "#1a2e1a", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "12px", color: "#9db89d", fontFamily: "Arial, sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Rezumat</p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {[
                    { label: "Utilaj", value: `${formData.marca} ${formData.model}` },
                    { label: "Tip", value: formData.tip },
                    { label: "Putere", value: formData.putere_cp ? `${formData.putere_cp} CP` : "—" },
                    { label: "Județ", value: formData.judet },
                    { label: "Preț/zi", value: `${formData.pret_zi} RON` },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#9db89d", fontFamily: "Arial, sans-serif" }}>{item.label}</span>
                      <span style={{ fontSize: "13px", color: "#e8d5a3", fontFamily: "Arial, sans-serif" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} style={{
                padding: "12px 24px", background: "white",
                border: "1.5px solid #d4e8d4", borderRadius: "8px",
                color: "#1a2e1a", fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif",
              }}>← Înapoi</button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={handleNext} style={{
                padding: "12px 28px", background: "#1a2e1a",
                border: "none", borderRadius: "8px",
                color: "#e8d5a3", fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif",
                fontWeight: "bold",
              }}>Continuă →</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{
                padding: "12px 28px",
                background: loading ? "#ccc" : "#4a7c4a",
                border: "none", borderRadius: "8px",
                color: "white", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Georgia, serif", fontWeight: "bold",
              }}>
                {loading ? "Se salvează..." : "🚜 Publică utilajul"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}