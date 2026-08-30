import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";

export default function Contact() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nume.trim() || !email.trim() || !mesaj.trim()) {
      setError("Completează toate câmpurile.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/contact/", { nume, email, mesaj });
      setSuccess(true);
      setNume("");
      setEmail("");
      setMesaj("");
    } catch (err) {
      setError(err.response?.data?.detail || "Eroare la trimiterea mesajului. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1a0d", fontFamily: "Georgia, serif", overflowX: "hidden" }}>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? "rgba(13,26,13,0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(10px)" : "none",
        padding: "0 3rem", height: "70px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s ease",
        borderBottom: scrollY > 50 ? "1px solid rgba(232,213,163,0.1)" : "none",
      }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <span style={{ fontSize: "24px" }}>🚜</span>
          <span style={{ color: "#e8d5a3", fontSize: "22px", fontWeight: "bold", letterSpacing: "1px" }}>
            TraktorShare
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", color: "#e8d5a3",
            border: "1px solid rgba(232,213,163,0.4)", borderRadius: "8px",
            padding: "9px 22px", fontSize: "14px", cursor: "pointer",
            fontFamily: "Georgia, serif", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.borderColor = "#e8d5a3"}
            onMouseLeave={e => e.target.style.borderColor = "rgba(232,213,163,0.4)"}>
            Autentificare
          </button>
          <button onClick={() => navigate("/signup")} style={{
            background: "#4a7c4a", color: "white",
            border: "none", borderRadius: "8px",
            padding: "9px 22px", fontSize: "14px", cursor: "pointer",
            fontFamily: "Georgia, serif", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "#3a6a3a"}
            onMouseLeave={e => e.target.style.background = "#4a7c4a"}>
            Creează cont
          </button>
        </div>
      </nav>

      <div style={{
        background: "linear-gradient(160deg, #0d1a0d 0%, #1a2e1a 60%, #0d1a0d 100%)",
        textAlign: "center", padding: "150px 2rem 3rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: "700px", height: "700px",
          borderRadius: "50%", border: "1px solid rgba(232,213,163,0.04)",
          top: "-10%", left: "50%", transform: "translateX(-50%)",
        }} />

        <p style={{
          color: "#7dc47d", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
          marginBottom: "16px", fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        }}>
          Suntem aici să ajutăm
        </p>
        <h1 style={{
          color: "#e8d5a3", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "bold",
          marginBottom: "16px", lineHeight: 1.15,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>
          Scrie-ne un <span style={{ color: "#7dc47d" }}>mesaj</span>
        </h1>
        <p style={{
          color: "#9db89d", fontSize: "16px", maxWidth: "500px", margin: "0 auto",
          lineHeight: 1.8, fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
        }}>
          Ai o întrebare, o sugestie sau ai găsit o problemă pe platformă? Spune-ne aici.
        </p>
      </div>

      <div style={{ background: "#f7f5f0", padding: "4rem 2rem 5rem" }}>
        <div style={{
          maxWidth: "560px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr", gap: "2rem",
        }}>

          <div style={{
            background: "white", borderRadius: "16px", border: "1px solid #e8e0d0",
            padding: "2.2rem",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}>

            {success ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ color: "#1a2e1a", marginBottom: "8px" }}>Mesaj trimis!</h3>
                <p style={{ color: "#777", fontFamily: "Arial, sans-serif", fontSize: "14px", marginBottom: "24px" }}>
                  Îți răspundem cât de curând pe adresa de email pe care ai lăsat-o.
                </p>
                <button onClick={() => setSuccess(false)} style={{
                  background: "#1a2e1a", color: "#e8d5a3", border: "none",
                  borderRadius: "8px", padding: "10px 24px", cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}>
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", color: "#1a2e1a", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif", marginBottom: "6px" }}>
                    Nume
                  </label>
                  <input
                    value={nume}
                    onChange={e => setNume(e.target.value)}
                    placeholder="Numele tău"
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "8px",
                      border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", color: "#1a2e1a", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif", marginBottom: "6px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@exemplu.ro"
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "8px",
                      border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.4rem" }}>
                  <label style={{ display: "block", color: "#1a2e1a", fontSize: "13px", fontWeight: "bold", fontFamily: "Arial, sans-serif", marginBottom: "6px" }}>
                    Mesaj
                  </label>
                  <textarea
                    value={mesaj}
                    onChange={e => setMesaj(e.target.value)}
                    placeholder="Scrie mesajul tău aici..."
                    rows={5}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "8px",
                      border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                      outline: "none", resize: "vertical", boxSizing: "border-box",
                    }}
                  />
                </div>

                {error && (
                  <div style={{
                    marginBottom: "1.2rem", padding: "10px 12px",
                    background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px",
                    color: "#dc2626", fontSize: "13px", fontFamily: "Arial, sans-serif",
                  }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: "100%",
                  background: loading ? "#ccc" : "#1a2e1a",
                  color: loading ? "#888" : "#e8d5a3",
                  border: "none", borderRadius: "8px", padding: "13px",
                  fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Georgia, serif", fontWeight: "bold",
                }}>
                  {loading ? "Se trimite..." : "✉️ Trimite mesajul"}
                </button>
              </form>
            )}
          </div>

          <div style={{
            textAlign: "center",
            opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
          }}>
            <p style={{ color: "#888", fontFamily: "Arial, sans-serif", fontSize: "13px", marginBottom: "4px" }}>
              Sau scrie-ne direct la
            </p>
            <a href="mailto:admin.traktorshare@gmail.com" style={{ color: "#1a2e1a", fontFamily: "Arial, sans-serif", fontSize: "14px", fontWeight: "bold", textDecoration: "none" }}>
              admin.traktorshare@gmail.com
            </a>
          </div>

        </div>
      </div>

      <Footer />
      
    </div>
  );
}