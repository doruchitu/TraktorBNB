import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import InstallButton from "../components/InstallButton";

export default function Landing() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🚜",
      title: "Închiriază utilaje",
      desc: "Găsește tractoare, combine și echipamente agricole disponibile în județul tău.",
    },
    {
      icon: "📅",
      title: "Calendar inteligent",
      desc: "Vezi disponibilitatea în timp real și rezervă direct din calendar interactiv.",
    },
    {
      icon: "📄",
      title: "Model de contract automat",
      desc: "La aprobarea rezervării, se generează automat un model de contract PDF.",
    },
    {
      icon: "⭐",
      title: "Recenzii reale",
      desc: "Vezi evaluările lăsate de alți fermieri înainte să rezervi un utilaj.",
    },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

        <p style={{
          color: "#7dc47d", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
          marginBottom: "16px", fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        }}>
          Platforma #1 de închirieri agricole din România
        </p>
        <h1 style={{
          color: "#e8d5a3", fontSize: "clamp(2.2rem, 5.5vw, 4rem)", fontWeight: "bold",
          marginBottom: "16px", lineHeight: 1.15,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>
          Găsește utilajul potrivit,<br />
          <span style={{ color: "#7dc47d" }}>în județul tău.</span>
        </h1>
        <p style={{
          color: "#9db89d", fontSize: "16px", maxWidth: "540px", margin: "0 auto",
          lineHeight: 1.8, fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
        }}>
          Conectăm fermierii români. Închiriezi sau îți pui utilajul la muncă atunci când tu nu îl folosești.
        </p>

        <div style={{
          display: "flex", justifyContent: "center", gap: "12px", marginTop: "2.5rem",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}>
          <button onClick={() => navigate("/signup")} style={{
            background: "#4a7c4a", color: "white",
            border: "none", borderRadius: "10px",
            padding: "15px 32px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif",
            fontWeight: "bold", transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(74,124,74,0.4)",
          }}
            onMouseEnter={e => e.target.style.background = "#3a6a3a"}
            onMouseLeave={e => e.target.style.background = "#4a7c4a"}>
            🚜 Creează cont gratuit
          </button>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", color: "#e8d5a3",
            border: "1px solid rgba(232,213,163,0.4)", borderRadius: "10px",
            padding: "15px 32px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.borderColor = "#e8d5a3"}
            onMouseLeave={e => e.target.style.borderColor = "rgba(232,213,163,0.4)"}>
            Am deja cont
          </button>
        </div>

        <div style={{
          marginTop: "5rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
        }}>
          <p style={{
            color: "#e8d5a3",
            fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
            fontWeight: "bold",
            fontFamily: "Georgia, serif",
            textAlign: "center",
          }}>
            🚀 Fii printre primii care se conectează și postează sau închiriază un utilaj
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <InstallButton />
          </div>
        </div>
      </div>

      <div style={{ background: "#f7f5f0", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center", color: "#1a2e1a",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "3rem",
          }}>
            Cum funcționează
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2rem",
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "12px",
                border: "1px solid #e8e0d0", padding: "2rem",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ color: "#1a2e1a", fontSize: "18px", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "#777", fontSize: "14px", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}