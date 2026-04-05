import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const judete = ["Toate", "Cluj", "Timiș", "Brașov", "Iași", "Sibiu", "Mureș", "Alba", "Galați", "Suceava", "Dolj"];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [utilaje, setUtilaje] = useState([]);
  const [judetFiltrat, setJudetFiltrat] = useState("Toate");
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [loadingUtilaje, setLoadingUtilaje] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser({ nume: "Fermier" });
    setTimeout(() => setVisible(true), 50);

    axios.get("http://localhost:8000/machinery/")
      .then(res => {
        setUtilaje(res.data);
        setLoadingUtilaje(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingUtilaje(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const utilajeFiltrate = utilaje.filter(u => {
    const judetOk = judetFiltrat === "Toate" || u.judet === judetFiltrat;
    const searchOk = searchQuery === "" ||
      u.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.judet.toLowerCase().includes(searchQuery.toLowerCase());
    return judetOk && searchOk;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0", fontFamily: "'Georgia', serif" }}>

      {/* Navbar */}
      <nav style={{
        background: "#1a2e1a", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🚜</span>
          <span style={{ color: "#e8d5a3", fontSize: "20px", fontWeight: "bold", letterSpacing: "0.5px" }}>TraktorBNB</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#9db89d", fontSize: "14px" }}>
            Bună, <span style={{ color: "#e8d5a3", fontWeight: "bold" }}>{user?.nume}</span>
          </span>
          <button onClick={() => navigate("/adauga-utilaj")} style={{
            background: "#4a7c4a", color: "white", border: "none",
            borderRadius: "6px", padding: "8px 16px", fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
          }}>+ Adaugă Utilaj</button>
          <button onClick={handleLogout} style={{
            background: "transparent", color: "#9db89d",
            border: "1px solid #3a5a3a", borderRadius: "6px",
            padding: "8px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
          }}>Ieși</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 50%, #1a2e1a 100%)",
        padding: "4rem 2rem 3rem", textAlign: "center",
        position: "relative", overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "200px", opacity: 0.04, color: "white",
          userSelect: "none", whiteSpace: "nowrap", fontWeight: "bold",
        }}>🌾</div>

        <p style={{ color: "#9db89d", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px", fontFamily: "Arial, sans-serif" }}>
          Platforma #1 de închirieri agricole din România
        </p>
        <h1 style={{ color: "#e8d5a3", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "bold", marginBottom: "16px", lineHeight: 1.2 }}>
          Găsește utilajul potrivit,<br />
          <span style={{ color: "#7dc47d" }}>în județul tău.</span>
        </h1>
        <p style={{ color: "#9db89d", fontSize: "16px", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7, fontFamily: "Arial, sans-serif" }}>
          Conectăm fermierii români. Închiriezi sau îți pui utilajul la muncă când nu îl folosești.
        </p>
        <div style={{ display: "flex", maxWidth: "500px", margin: "0 auto", gap: "8px" }}>
          <input
            placeholder="Caută marcă, model, județ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, padding: "14px 18px", borderRadius: "8px",
              border: "none", fontSize: "15px", fontFamily: "Arial, sans-serif",
              background: "rgba(255,255,255,0.95)", outline: "none",
            }}
          />
          <button style={{ background: "#4a7c4a", color: "white", border: "none", borderRadius: "8px", padding: "14px 20px", fontSize: "15px", cursor: "pointer" }}>🔍</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: "#e8d5a3", padding: "1.2rem 2rem",
        display: "flex", justifyContent: "center",
        gap: "clamp(1rem, 5vw, 4rem)", flexWrap: "wrap",
        opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
      }}>
        {[
          { val: utilaje.length + "+", label: "Utilaje disponibile" },
          { val: "380+", label: "Fermieri activi" },
          { val: "41", label: "Județe acoperite" },
          { val: "4.8★", label: "Rating mediu" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#1a2e1a" }}>{s.val}</div>
            <div style={{ fontSize: "12px", color: "#5a6e4a", fontFamily: "Arial, sans-serif", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Filters */}
        <div style={{
          display: "flex", gap: "8px", flexWrap: "wrap",
          marginBottom: "2rem", alignItems: "center",
          opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.3s",
        }}>
          <span style={{ fontSize: "13px", color: "#666", fontFamily: "Arial, sans-serif", marginRight: "4px" }}>Județ:</span>
          {judete.map(j => (
            <button key={j} onClick={() => setJudetFiltrat(j)} style={{
              padding: "7px 16px", borderRadius: "20px",
              border: judetFiltrat === j ? "none" : "1px solid #ccc",
              background: judetFiltrat === j ? "#1a2e1a" : "white",
              color: judetFiltrat === j ? "#e8d5a3" : "#555",
              fontSize: "13px", cursor: "pointer",
              fontFamily: "Arial, sans-serif", transition: "all 0.2s",
            }}>{j}</button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#888", fontFamily: "Arial, sans-serif" }}>
            {utilajeFiltrate.length} utilaje găsite
          </span>
        </div>

        {/* Cards */}
        {loadingUtilaje ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚜</div>
            <p>Se încarcă utilajele...</p>
          </div>
        ) : utilajeFiltrate.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p>Niciun utilaj găsit pentru criteriile selectate.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {utilajeFiltrate.map((u, i) => (
              <div key={u.id} style={{
                background: "white", borderRadius: "12px",
                overflow: "hidden", border: "1px solid #e8e0d0", cursor: "pointer",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${0.1 * i + 0.4}s, transform 0.5s ease ${0.1 * i + 0.4}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  height: "160px",
                  background: "linear-gradient(135deg, #2d4a2d, #4a7c4a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "64px", position: "relative",
                }}>
                  🚜
                  <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: u.disponibil ? "#27ae60" : "#c0392b",
                    color: "white", padding: "4px 10px", borderRadius: "4px",
                    fontSize: "11px", fontFamily: "Arial, sans-serif",
                  }}>
                    {u.disponibil ? "Disponibil" : "Indisponibil"}
                  </div>
                  <div style={{
                    position: "absolute", bottom: "12px", left: "12px",
                    background: "rgba(0,0,0,0.5)", color: "#e8d5a3",
                    padding: "4px 10px", borderRadius: "4px",
                    fontSize: "12px", fontFamily: "Arial, sans-serif",
                  }}>📍 {u.judet}</div>
                </div>

                <div style={{ padding: "1.2rem" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#1a2e1a", fontWeight: "bold" }}>
                    {u.marca} {u.model}
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#888", fontFamily: "Arial, sans-serif" }}>
                    ⚡ {u.putere_cp ? `${u.putere_cp} CP` : "—"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0ebe0", paddingTop: "12px" }}>
                    <div>
                      <span style={{ fontSize: "22px", fontWeight: "bold", color: "#2d4a2d" }}>{u.pret_zi} lei</span>
                      <span style={{ fontSize: "12px", color: "#aaa", fontFamily: "Arial, sans-serif" }}> / zi</span>
                    </div>
                    <button disabled={!u.disponibil} style={{
                      background: u.disponibil ? "#1a2e1a" : "#ccc",
                      color: u.disponibil ? "#e8d5a3" : "#888",
                      border: "none", borderRadius: "6px",
                      padding: "9px 18px", fontSize: "13px",
                      cursor: u.disponibil ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                    }}>
                      {u.disponibil ? "Rezervă" : "Indisponibil"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: "#1a2e1a", color: "#9db89d",
        textAlign: "center", padding: "2rem", marginTop: "4rem",
        fontSize: "13px", fontFamily: "Arial, sans-serif",
      }}>
        <div style={{ fontSize: "20px", marginBottom: "8px" }}>🚜 TraktorBNB</div>
        <p style={{ margin: 0, opacity: 0.6 }}>© 2026 TraktorBNB · Platforma fermierilor români</p>
      </footer>
    </div>
  );
}