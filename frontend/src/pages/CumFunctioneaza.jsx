import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function CumFunctioneaza() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [rolActiv, setRolActiv] = useState("proprietar");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pasiProprietar = [
    { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă, sau autentificare directă." },
    { nr: "02", title: "Publică utilajul", desc: "Adaugă marca, modelul, puterea, prețul pe zi și perioada de disponibilitate." },
    { nr: "03", title: "Primești cereri", desc: "Fermierii interesați trimit cereri de rezervare pe zilele disponibile." },
    { nr: "04", title: "Aprobi rezervarea", desc: "Accepți sau respingi cererea direct din panoul de Rezervări." },
    { nr: "05", title: "Predai utilajul", desc: "La preluare, ambele părți au deja modelul de contract descărcat." },
  ];

  const pasiClient = [
    { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă, sau autentificare directă." },
    { nr: "02", title: "Cauți utilajul", desc: "Filtrezi după județ, marcă sau preț și găsești ce ai nevoie." },
    { nr: "03", title: "Verifici calendarul", desc: "Vezi în timp real ce zile sunt libere, fără telefoane în plus." },
    { nr: "04", title: "Trimiți cererea", desc: "Selectezi intervalul dorit și aștepți confirmarea proprietarului." },
    { nr: "05", title: "Preiei utilajul", desc: "După aprobare, descarci modelul de contract și mergi la treabă." },
  ];

  const pasiActivi = rolActiv === "proprietar" ? pasiProprietar : pasiClient;

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
            TraktorBNB
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

        <h1 style={{
          color: "#e8d5a3", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "bold",
          marginBottom: "16px", lineHeight: 1.15,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>
          Cum funcționează <span style={{ color: "#7dc47d" }}>TraktorBNB</span>
        </h1>
        <p style={{
          color: "#9db89d", fontSize: "16px", maxWidth: "540px", margin: "0 auto",
          lineHeight: 1.8, fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
        }}>
          Fiecare rezervare pornește din același loc și leagă doi oameni: cel care are un utilaj
          liber și cel care are nevoie de el.
        </p>
      </div>

      <div style={{ background: "#0d1a0d", padding: "1rem 2rem 5rem" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative" }}>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0" }}>
            <div style={{
              background: "#e8d5a3", color: "#1a2e1a",
              borderRadius: "10px", padding: "14px 28px",
              fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "14px",
              boxShadow: "0 4px 20px rgba(232,213,163,0.15)",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
            }}>
              🌾 Cont creat pe TraktorBNB
            </div>
          </div>

          <svg width="100%" height="60" viewBox="0 0 780 60" style={{ display: "block" }}>
            <path d="M 390 0 C 390 30, 195 15, 195 60" stroke="rgba(125,196,125,0.35)" strokeWidth="2" fill="none" />
            <path d="M 390 0 C 390 30, 585 15, 585 60" stroke="rgba(74,124,74,0.5)" strokeWidth="2" fill="none" />
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>

            <div style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            }}>
              <div style={{
                textAlign: "center", marginBottom: "1.5rem",
                color: "#7dc47d", fontFamily: "Arial, sans-serif",
                fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "bold",
              }}>
                Dacă ai un utilaj
              </div>
              {pasiProprietar.map((p, i) => (
                <div key={p.nr} style={{ display: "flex", gap: "16px", marginBottom: i < pasiProprietar.length - 1 ? "1.6rem" : 0, position: "relative" }}>
                  {i < pasiProprietar.length - 1 && (
                    <div style={{
                      position: "absolute", left: "19px", top: "40px", bottom: "-26px",
                      width: "1px", background: "rgba(125,196,125,0.2)",
                    }} />
                  )}
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                    background: "rgba(125,196,125,0.1)", border: "1px solid rgba(125,196,125,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#7dc47d", fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: "bold",
                    position: "relative", zIndex: 1,
                  }}>
                    {p.nr}
                  </div>
                  <div style={{ paddingTop: "6px" }}>
                    <h3 style={{ color: "#e8d5a3", fontSize: "16px", margin: "0 0 4px" }}>{p.title}</h3>
                    <p style={{ color: "#9db89d", fontFamily: "Arial, sans-serif", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
            }}>
              <div style={{
                textAlign: "center", marginBottom: "1.5rem",
                color: "#4a7c4a", fontFamily: "Arial, sans-serif",
                fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "bold",
              }}>
                Dacă ai nevoie de unul
              </div>
              {pasiClient.map((p, i) => (
                <div key={p.nr} style={{ display: "flex", gap: "16px", marginBottom: i < pasiClient.length - 1 ? "1.6rem" : 0, position: "relative" }}>
                  {i < pasiClient.length - 1 && (
                    <div style={{
                      position: "absolute", left: "19px", top: "40px", bottom: "-26px",
                      width: "1px", background: "rgba(74,124,74,0.25)",
                    }} />
                  )}
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                    background: "rgba(74,124,74,0.15)", border: "1px solid rgba(74,124,74,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#9db89d", fontFamily: "Arial, sans-serif", fontSize: "13px", fontWeight: "bold",
                    position: "relative", zIndex: 1,
                  }}>
                    {p.nr}
                  </div>
                  <div style={{ paddingTop: "6px" }}>
                    <h3 style={{ color: "#e8d5a3", fontSize: "16px", margin: "0 0 4px" }}>{p.title}</h3>
                    <p style={{ color: "#9db89d", fontFamily: "Arial, sans-serif", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <svg width="100%" height="60" viewBox="0 0 780 60" style={{ display: "block", marginTop: "1rem" }}>
            <path d="M 195 0 C 195 30, 390 15, 390 60" stroke="rgba(125,196,125,0.35)" strokeWidth="2" fill="none" />
            <path d="M 585 0 C 585 30, 390 15, 390 60" stroke="rgba(74,124,74,0.5)" strokeWidth="2" fill="none" />
          </svg>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "#1a2e1a", border: "1px solid rgba(232,213,163,0.3)", color: "#e8d5a3",
              borderRadius: "10px", padding: "14px 28px",
              fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "14px",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
            }}>
              📄 Model de contract generat automat
            </div>
          </div>

        </div>
      </div>

      <div style={{ background: "#f7f5f0", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", color: "#1a2e1a", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "2.5rem" }}>
            Vezi pas cu pas, pe rolul tău
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "2.5rem" }}>
            <button onClick={() => setRolActiv("proprietar")} style={{
              padding: "10px 24px", borderRadius: "20px",
              border: rolActiv === "proprietar" ? "none" : "1px solid #ccc",
              background: rolActiv === "proprietar" ? "#1a2e1a" : "white",
              color: rolActiv === "proprietar" ? "#e8d5a3" : "#555",
              fontSize: "14px", cursor: "pointer", fontFamily: "Arial, sans-serif",
              fontWeight: "bold", transition: "all 0.2s",
            }}>
              🚜 Sunt proprietar
            </button>
            <button onClick={() => setRolActiv("client")} style={{
              padding: "10px 24px", borderRadius: "20px",
              border: rolActiv === "client" ? "none" : "1px solid #ccc",
              background: rolActiv === "client" ? "#1a2e1a" : "white",
              color: rolActiv === "client" ? "#e8d5a3" : "#555",
              fontSize: "14px", cursor: "pointer", fontFamily: "Arial, sans-serif",
              fontWeight: "bold", transition: "all 0.2s",
            }}>
              🌾 Caut un utilaj
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pasiActivi.map((p, i) => (
              <div key={p.nr} style={{
                background: "white", borderRadius: "12px", border: "1px solid #e8e0d0",
                padding: "1.3rem 1.5rem", display: "flex", gap: "18px", alignItems: "flex-start",
              }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                  background: "#1a2e1a", color: "#e8d5a3",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: "bold",
                }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ color: "#1a2e1a", fontSize: "16px", margin: "0 0 4px" }}>{p.title}</h3>
                  <p style={{ color: "#777", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#1a2e1a", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#e8d5a3", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "1rem" }}>
          Gata să pornești?
        </h2>
        <p style={{ color: "#9db89d", fontFamily: "Arial, sans-serif", marginBottom: "2rem" }}>
          Fii printre primii care se conectează și postează sau închiriază un utilaj.
        </p>
        <button onClick={() => navigate("/signup")} style={{
          background: "#4a7c4a", color: "white",
          border: "none", borderRadius: "10px",
          padding: "16px 36px", fontSize: "16px",
          cursor: "pointer", fontFamily: "Georgia, serif",
          fontWeight: "bold", transition: "all 0.2s",
          boxShadow: "0 4px 20px rgba(74,124,74,0.4)",
        }}
          onMouseEnter={e => e.target.style.background = "#3a6a3a"}
          onMouseLeave={e => e.target.style.background = "#4a7c4a"}>
          🚜 Creează cont gratuit
        </button>
      </div>

      <Footer />
      
    </div>
  );
}