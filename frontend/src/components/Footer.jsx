import React from "react";

export default function Footer() {
  return (
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

          <div>
            <div style={{ fontSize: "20px", color: "#e8d5a3", marginBottom: "10px", fontFamily: "Georgia, serif" }}>
              🚜 TraktorShare
            </div>
            <p style={{ lineHeight: 1.7, maxWidth: "260px" }}>
              Conectăm fermierii români cu utilajele agricole de care au nevoie, oriunde în țară.
            </p>
          </div>

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

          <div>
            <h4 style={{ color: "#e8d5a3", fontSize: "14px", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
              Resurse
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/ghiduri" style={{ color: "#5a7a5a", textDecoration: "none" }}>Ghiduri pentru fermieri</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#e8d5a3", fontSize: "14px", marginBottom: "14px", fontFamily: "Georgia, serif" }}>
              Contact
            </h4>
            <a href="mailto:admin.traktorshare@gmail.com" style={{ color: "#5a7a5a", textDecoration: "none", display: "block" }}>
              admin.traktorshare@gmail.com
            </a>
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
            © 2026 TraktorShare. Toate drepturile rezervate.
          </div>
        </div>

      </div>
    </footer>
  );
}