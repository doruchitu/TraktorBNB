import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    { icon: "🚜", title: "Închiriază utilaje", desc: "Găsește tractoare, combine și echipamente agricole disponibile în județul tău." },
    { icon: "📅", title: "Calendar inteligent", desc: "Vezi disponibilitatea în timp real și rezervă cu câteva clickuri." },
    { icon: "✅", title: "Aprobare rapidă", desc: "Proprietarul aprobă cererea, primești confirmarea instant." },
    { icon: "📄", title: "Model de contract automat", desc: "La aprobare se generează automat un model de contract PDF între cele două părți." },
    { icon: "🔒", title: "Securizat", desc: "Autentificare prin Firebase, date protejate, tranzacții sigure." },
    { icon: "🌾", title: "100% românesc", desc: "Construit pentru fermierii români, cu focus pe simplicitate și eficiență." },
  ];

  //const stats = [
  //  { val: "1,240+", label: "Utilaje listate" },
  //  { val: "380+", label: "Fermieri activi" },
  //  { val: "41", label: "Județe" },
  //  { val: "4.8★", label: "Rating mediu" },
  //];

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
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0d1a0d 0%, #1a2e1a 40%, #0d1a0d 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "2rem",
        position: "relative", overflow: "hidden",
      }}>

        <div style={{
          position: "absolute", width: "600px", height: "600px",
          borderRadius: "50%", border: "1px solid rgba(232,213,163,0.05)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }} />
        <div style={{
          position: "absolute", width: "900px", height: "900px",
          borderRadius: "50%", border: "1px solid rgba(232,213,163,0.03)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(74,124,74,0.2)", border: "1px solid rgba(74,124,74,0.4)",
          borderRadius: "20px", padding: "6px 16px", marginBottom: "2rem",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <span style={{ fontSize: "12px" }}>🌾</span>
          <span style={{ color: "#7dc47d", fontSize: "13px", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
            Platforma #1 de închirieri agricole din România
          </span>
        </div>

        <h1 style={{
          color: "#e8d5a3",
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          lineHeight: 1.1, marginBottom: "1.5rem",
          fontWeight: "bold",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>
          Utilajul potrivit,<br />
          <span style={{
            color: "#7dc47d",
            textShadow: "0 0 40px rgba(125,196,125,0.3)",
          }}>
            la tine în județ.
          </span>
        </h1>

        <p style={{
          color: "#9db89d", fontSize: "clamp(1rem, 2vw, 1.2rem)",
          maxWidth: "560px", lineHeight: 1.8, marginBottom: "3rem",
          fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}>
          Conectăm fermierii români. Închiriezi un tractor când ai nevoie
          sau îți pui utilajul la muncă când nu îl folosești.
        </p>

        <div style={{
          display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}>
          <button onClick={() => navigate("/signup")} style={{
            background: "#4a7c4a", color: "white",
            border: "none", borderRadius: "10px",
            padding: "16px 36px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif",
            fontWeight: "bold", transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(74,124,74,0.4)",
          }}
            onMouseEnter={e => { e.target.style.background = "#3a6a3a"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#4a7c4a"; e.target.style.transform = "translateY(0)"; }}>
            🚜 Începe gratuit
          </button>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", color: "#e8d5a3",
            border: "1px solid rgba(232,213,163,0.3)", borderRadius: "10px",
            padding: "16px 36px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#e8d5a3"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(232,213,163,0.3)"; e.target.style.transform = "translateY(0)"; }}>
            Intră în cont →
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
            🚀 Fii printre primii care se conectează și postează sau închiriază un utilaj!
          </p>
        </div>

        <div style={{
          position: "absolute", bottom: "0.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          opacity: visible ? 0.5 : 0, transition: "opacity 0.8s ease 1s",
          animation: "bounce 2s infinite",
        }}>
          <span style={{ color: "#5a7a5a", fontSize: "12px", fontFamily: "Arial, sans-serif", letterSpacing: "2px" }}>SCROLL</span>
          <span style={{ color: "#5a7a5a", fontSize: "20px" }}>↓</span>
        </div>
      </div>

      <div style={{ background: "#f7f5f0", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center", color: "#1a2e1a",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            marginBottom: "1rem",
          }}>
            Tot ce ai nevoie, într-o singură platformă
          </h2>
          <p style={{
            textAlign: "center", color: "#888",
            fontFamily: "Arial, sans-serif", fontSize: "16px",
            marginBottom: "4rem", maxWidth: "500px", margin: "0 auto 4rem",
          }}>
            De la căutare până la model de contract, totul e simplu și rapid.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "16px",
                padding: "2rem", border: "1px solid #e8e0d0",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "36px", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ color: "#1a2e1a", fontSize: "18px", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#888", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#1a2e1a", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#e8d5a3", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "4rem" }}>
            Cum funcționează?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
            {[
              { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă." },
              { nr: "02", title: "Caută utilaje", desc: "Filtrează după județ, tip, preț." },
              { nr: "03", title: "Rezervă", desc: "Selectează zilele disponibile din calendar." },
              { nr: "04", title: "Primești contractul", desc: "La aprobare, contractul PDF se generează automat." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  background: "rgba(232,213,163,0.1)", border: "1px solid rgba(232,213,163,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                }}>
                  <span style={{ color: "#e8d5a3", fontSize: "16px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{s.nr}</span>
                </div>
                <h3 style={{ color: "#e8d5a3", fontSize: "16px", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ color: "#9db89d", fontFamily: "Arial, sans-serif", fontSize: "13px", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#f7f5f0", padding: "6rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#1a2e1a", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>
          Gata să începi?
        </h2>
        <p style={{ color: "#888", fontFamily: "Arial, sans-serif", marginBottom: "2rem" }}>
          Gratuit. Fără comisioane ascunse. Doar fermieri și utilaje.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/signup")} style={{
            background: "#1a2e1a", color: "#e8d5a3",
            border: "none", borderRadius: "10px",
            padding: "16px 36px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif",
            fontWeight: "bold", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "#2d4a2d"}
            onMouseLeave={e => e.target.style.background = "#1a2e1a"}>
            🚜 Creează cont gratuit
          </button>
          <button onClick={() => navigate("/login")} style={{
            background: "white", color: "#1a2e1a",
            border: "1px solid #1a2e1a", borderRadius: "10px",
            padding: "16px 36px", fontSize: "16px",
            cursor: "pointer", fontFamily: "Georgia, serif",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "#f0f7f0"}
            onMouseLeave={e => e.target.style.background = "white"}>
            Am deja cont
          </button>
        </div>
      </div>

    <footer style={{
      background: "#0d1a0d", color: "#5a7a5a",
      padding: "4rem 2rem 2rem",
      fontFamily: "Arial, sans-serif", fontSize: "13px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}>
        
          {/* Coloana brand */}
          <div>
            <div style={{ fontSize: "20px", color: "#e8d5a3", marginBottom: "10px", fontFamily: "Georgia, serif" }}>
              🚜 TraktorBNB
            </div>
            <p style={{ lineHeight: 1.7, maxWidth: "260px" }}>
              Conectăm fermierii români cu utilajele agricole de care au nevoie, oriunde în țară.
            </p>
          </div>
      
          {/* Coloana Platformă */}
          <div>
            <h4 style={{ color: "#e8d5a3", fontSize: "14px", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
              Platformă
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/home" style={{ color: "#5a7a5a", textDecoration: "none" }}>Găsește utilaje</a>
              <a href="/adauga-utilaj" style={{ color: "#5a7a5a", textDecoration: "none" }}>Publică un utilaj</a>
              <a href="/cum-functioneaza" style={{ color: "#5a7a5a", textDecoration: "none" }}>Cum funcționează</a>
              <a href="/contact" style={{ color: "#5a7a5a", textDecoration: "none" }}>Contact</a>
              <a href="/signup" style={{ color: "#5a7a5a", textDecoration: "none" }}>Înregistrare</a>
            </div>
          </div>
      
          {/* Coloana Resurse */}
          <div>
            <h4 style={{ color: "#e8d5a3", fontSize: "14px", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
              Resurse
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/ghiduri" style={{ color: "#5a7a5a", textDecoration: "none" }}>Ghiduri pentru fermieri</a>
            </div>
          </div>
      
          {/* Coloana Contact */}
          <div>
            <h4 style={{ color: "#e8d5a3", fontSize: "14px", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
              Contact
            </h4>
            <a href="mailto:admin.traktorbnb@gmail.com" style={{ color: "#5a7a5a", textDecoration: "none", display: "block", marginBottom: "12px" }}>
              admin.traktorbnb@gmail.com
            </a>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            </div>
          </div>
      
        </div>
      
        <div style={{
          borderTop: "1px solid rgba(232,213,163,0.1)",
          paddingTop: "1.5rem",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
            <a href="/termeni" style={{ color: "#5a7a5a", textDecoration: "none", fontSize: "12px" }}>
              Termeni și condiții
            </a>
            <a href="/confidentialitate" style={{ color: "#5a7a5a", textDecoration: "none", fontSize: "12px" }}>
              Confidențialitate
            </a>
          </div>
          <div style={{ color: "#4a6a4a" }}>
            © 2026 TraktorBNB. Toate drepturile rezervate.
          </div>
        </div>
      
      </div>
    </footer>
    </div>
  );
}