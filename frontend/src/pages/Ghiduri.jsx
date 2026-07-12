import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Ghiduri() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ghiduri = [
    {
      nr: "01",
      icon: "📸",
      title: "Cum publici un utilaj corect",
      intro: "Un anunț complet primește cereri mai repede și evită întrebări repetate din partea celor interesați.",
      puncte: [
        { subtitlu: "Poza contează cel mai mult", text: "Fă poza la lumină naturală, de preferat afară, dintr-un unghi care arată tot utilajul. Un fermier decide în câteva secunde dacă dă click mai departe." },
        { subtitlu: "Descrie exact ce oferi", text: "Menționează puterea în CP, anul dacă e relevant, ce accesorii vin cu utilajul și pentru ce tip de lucrări e potrivit. Cu cât descrierea e mai completă, cu atât primești mai puține mesaje cu întrebări de bază." },
        { subtitlu: "Stabilește un preț realist", text: "Uită-te la utilaje similare deja publicate pe platformă înainte să stabilești prețul pe zi. Un preț prea mare descurajează cererile, unul prea mic ridică suspiciuni." },
        { subtitlu: "Actualizează disponibilitatea", text: "Dacă utilajul e ocupat cu alte treburi într-o perioadă, actualizează intervalul de disponibilitate — calendarul din platformă se bazează pe această informație." },
      ],
    },
    {
      nr: "02",
      icon: "📋",
      title: "Ce se întâmplă după ce trimiți o cerere de rezervare",
      intro: "Procesul are trei etape simple, dar e util să știi exact ce înseamnă fiecare status.",
      puncte: [
        { subtitlu: "Cererea intră în așteptare", text: "Imediat după ce trimiți cererea, aceasta apare cu statusul „În așteptare” în panoul de Rezervări al proprietarului. Zilele selectate sunt deja blocate pentru alți clienți, chiar înainte de aprobare." },
        { subtitlu: "Proprietarul aprobă sau respinge", text: "Proprietarul vede cererea ta cu toate detaliile — interval, utilaj, datele tale de contact — și decide. Dacă respinge, zilele se eliberează automat și poți căuta alt utilaj." },
        { subtitlu: "După aprobare, ai acces la contract", text: "Odată aprobată, cererea trece pe „Aprobat” și butonul de descărcare a modelului de contract devine activ, atât pentru tine cât și pentru proprietar." },
        { subtitlu: "Dacă proprietarul nu răspunde", text: "Platforma nu are momentan un termen automat de expirare a cererilor. Dacă nu primești un răspuns în câteva zile, cel mai simplu e să contactezi proprietarul direct la datele afișate în profilul utilajului." },
      ],
    },
    {
      nr: "03",
      icon: "📄",
      title: "Ce conține modelul de contract generat automat",
      intro: "La aprobarea unei rezervări, platforma generează un document PDF pornind de la datele reale ale tranzacției.",
      puncte: [
        { subtitlu: "Datele părților implicate", text: "Numele, emailul și telefonul atât ale proprietarului cât și ale clientului, preluate direct din conturile create pe platformă." },
        { subtitlu: "Detaliile utilajului și perioada", text: "Marca, modelul, puterea utilajului, intervalul exact de închiriere, numărul de zile și prețul total calculat automat." },
        { subtitlu: "Clauze standard de bună practică", text: "Documentul include condiții generale — starea de returnare a utilajului, responsabilitatea pentru daune, momentul plății — utile ca punct de plecare pentru înțelegerea dintre părți." },
        { subtitlu: "Este un model, nu un document legal definitiv", text: "Documentul generat are rol orientativ. Pentru închirieri de valoare mare sau situații speciale, recomandăm ca părțile să consulte un specialist înainte de a considera înțelegerea finală." },
      ],
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

        <p style={{
          color: "#7dc47d", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
          marginBottom: "16px", fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        }}>
          Resurse pentru platformă
        </p>
        <h1 style={{
          color: "#e8d5a3", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "bold",
          marginBottom: "16px", lineHeight: 1.15,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>
          Ghiduri pentru <span style={{ color: "#7dc47d" }}>fermieri</span>
        </h1>
        <p style={{
          color: "#9db89d", fontSize: "16px", maxWidth: "540px", margin: "0 auto",
          lineHeight: 1.8, fontFamily: "Arial, sans-serif",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
        }}>
          Trei ghiduri scurte care te ajută să folosești platforma eficient, indiferent dacă
          publici un utilaj sau cauți unul.
        </p>
      </div>

      <div style={{ background: "#f7f5f0", padding: "4rem 2rem 5rem" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          {ghiduri.map((g, gi) => (
            <div key={g.nr} style={{
              background: "white", borderRadius: "16px", border: "1px solid #e8e0d0",
              padding: "2.2rem",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${0.15 * gi + 0.2}s, transform 0.6s ease ${0.15 * gi + 0.2}s`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                  background: "#1a2e1a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px",
                }}>
                  {g.icon}
                </div>
                <div>
                  <span style={{ color: "#4a7c4a", fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px" }}>
                    GHID {g.nr}
                  </span>
                  <h2 style={{ color: "#1a2e1a", fontSize: "22px", margin: "2px 0 0" }}>{g.title}</h2>
                </div>
              </div>

              <p style={{ color: "#777", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: 1.7, margin: "0 0 1.6rem" }}>
                {g.intro}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {g.puncte.map((p, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #e8d5a3", paddingLeft: "16px" }}>
                    <h4 style={{ color: "#1a2e1a", fontSize: "14.5px", margin: "0 0 4px", fontFamily: "Arial, sans-serif" }}>
                      {p.subtitlu}
                    </h4>
                    <p style={{ color: "#666", fontFamily: "Arial, sans-serif", fontSize: "13.5px", lineHeight: 1.7, margin: 0 }}>
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      <div style={{ background: "#1a2e1a", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#e8d5a3", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "1rem" }}>
          Ai altă întrebare?
        </h2>
        <p style={{ color: "#9db89d", fontFamily: "Arial, sans-serif", marginBottom: "2rem" }}>
          Scrie-ne direct și îți răspundem cât de repede putem.
        </p>
        <a href="mailto:contact@traktorbnb.ro" style={{
          display: "inline-block",
          background: "#4a7c4a", color: "white",
          border: "none", borderRadius: "10px",
          padding: "16px 36px", fontSize: "16px",
          textDecoration: "none",
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
        }}>
          ✉️ Trimite un email
        </a>
      </div>

      <footer style={{
        background: "#0d1a0d", color: "#5a7a5a",
        textAlign: "center", padding: "2rem",
        fontFamily: "Arial, sans-serif", fontSize: "13px",
      }}>
        <div style={{ fontSize: "20px", marginBottom: "8px" }}>🚜 TraktorBNB</div>
        <p style={{ margin: 0 }}>© 2026 TraktorBNB · Platforma fermierilor români</p>
      </footer>
    </div>
  );
}