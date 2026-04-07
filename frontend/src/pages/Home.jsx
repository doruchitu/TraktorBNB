import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

const judete = ["Toate", "Cluj", "Timiș", "Brașov", "Iași", "Sibiu", "Mureș", "Alba", "Galați", "Suceava", "Dolj"];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [utilaje, setUtilaje] = useState([]);
  const [judetFiltrat, setJudetFiltrat] = useState("Toate");
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [loadingUtilaje, setLoadingUtilaje] = useState(true);
  const [modalUtilaj, setModalUtilaj] = useState(null);
  const [zileOcupate, setZileOcupate] = useState([]);
  const [dataStart, setDataStart] = useState(null);
  const [dataEnd, setDataEnd] = useState(null);
  const [lunaAfisata, setLunaAfisata] = useState(new Date());
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  const deschideModal = async (utilaj) => {
    setModalUtilaj(utilaj);
    setDataStart(null);
    setDataEnd(null);
    setBookingError("");
    setBookingSuccess(false);
    setLunaAfisata(new Date());
    try {
      const res = await axios.get(`http://localhost:8000/bookings/ocupate/${utilaj.id}`);
      setZileOcupate(res.data.zile_ocupate);
    } catch (err) {
      setZileOcupate([]);
    }
  };

  const esteOcupata = (data) => {
    const str = data.toISOString().split("T")[0];
    return zileOcupate.includes(str);
  };

  const esteDisponibila = (data, utilaj) => {
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);
    if (data < azi) return false;

    if (utilaj.data_disponibil_de && utilaj.data_disponibil_pana) {
      const de = new Date(utilaj.data_disponibil_de);
      const pana = new Date(utilaj.data_disponibil_pana);
      if (data < de || data > pana) return false;
    }

    return true;
  };

  const esteSelectata = (data) => {
    const str = data.toISOString().split("T")[0];
    if (dataStart && str === dataStart) return true;
    if (dataEnd && str === dataEnd) return true;
    if (dataStart && dataEnd) {
      const start = new Date(dataStart);
      const end = new Date(dataEnd);
      return data >= start && data <= end;
    }
    return false;
  };

  const handleClickZi = (data) => {
    if (esteOcupata(data) || !esteDisponibila(data, modalUtilaj)) return;
    const str = data.toISOString().split("T")[0];
    if (!dataStart || (dataStart && dataEnd)) {
      setDataStart(str);
      setDataEnd(null);
    } else {
      if (str <= dataStart) {
        setDataStart(str);
        setDataEnd(null);
      } else {
        const start = new Date(dataStart);
        const end = new Date(str);
        let current = new Date(start);
        let valid = true;
        while (current <= end) {
          if (esteOcupata(current)) { valid = false; break; }
          current.setDate(current.getDate() + 1);
        }
        if (!valid) {
          setBookingError("Există zile ocupate în intervalul selectat.");
          return;
        }
        setDataEnd(str);
        setBookingError("");
      }
    }
  };

  const handleRezerva = async () => {
    if (!dataStart || !dataEnd) {
      setBookingError("Selectează data de start și data de end.");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post("http://localhost:8000/bookings/", {
        utilaj_id: modalUtilaj.id,
        data_start: new Date(dataStart).toISOString(),
        data_end: new Date(dataEnd).toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.detail || "Eroare la rezervare.");
    } finally {
      setBookingLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
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
                    <button
                      disabled={!u.disponibil}
                      onClick={() => deschideModal(u)}
                      style={{
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

      {/* Modal calendar */}
      {modalUtilaj && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
        }} onClick={() => setModalUtilaj(null)}>
          <div style={{
            background: "white", borderRadius: "16px",
            padding: "2rem", maxWidth: "480px", width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ color: "#1a2e1a", marginBottom: "8px" }}>Rezervare trimisă!</h3>
                <p style={{ color: "#888", fontFamily: "Arial, sans-serif", fontSize: "14px", marginBottom: "24px" }}>
                  Proprietarul va aproba sau respinge cererea ta în curând.
                </p>
                <button onClick={() => setModalUtilaj(null)} style={{
                  background: "#1a2e1a", color: "#e8d5a3", border: "none",
                  borderRadius: "8px", padding: "10px 24px", cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}>Închide</button>
              </div>
            ) : (
              <>
                {/* Header modal */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
                  <div>
                    <h3 style={{ color: "#1a2e1a", margin: "0 0 4px", fontSize: "20px" }}>
                      {modalUtilaj.marca} {modalUtilaj.model}
                    </h3>
                    <p style={{ color: "#888", margin: 0, fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
                      📍 {modalUtilaj.judet} · {modalUtilaj.pret_zi} lei/zi
                    </p>
                  </div>
                  <button onClick={() => setModalUtilaj(null)} style={{
                    background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa",
                  }}>✕</button>
                </div>

                {/* Legenda */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "1rem", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
                  {[
                    { color: "#27ae60", label: "Disponibil" },
                    { color: "#e74c3c", label: "Ocupat" },
                    { color: "#f5f5f5", label: "Indisponibil" },
                    { color: "#1a2e1a", label: "Selectat" },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: l.color, border: l.color === "#f5f5f5" ? "1px solid #ddd" : "none" }} />
                      <span style={{ color: "#555" }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <button onClick={() => setLunaAfisata(new Date(lunaAfisata.getFullYear(), lunaAfisata.getMonth() - 1))}
                    style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "16px" }}>
                    ‹
                  </button>
                  <span style={{ fontWeight: "bold", color: "#1a2e1a", fontSize: "16px" }}>
                    {lunaAfisata.toLocaleString("ro-RO", { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={() => setLunaAfisata(new Date(lunaAfisata.getFullYear(), lunaAfisata.getMonth() + 1))}
                    style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "16px" }}>
                    ›
                  </button>
                </div>

                {/* Zile saptamana */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
                  {["D", "L", "M", "M", "J", "V", "S"].map((z, i) => (
                    <div key={i} style={{ textAlign: "center", fontSize: "11px", fontFamily: "Arial, sans-serif", color: "#aaa", padding: "4px 0", fontWeight: "bold" }}>
                      {z}
                    </div>
                  ))}
                </div>

                {/* Zile calendar */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "1.5rem" }}>
                  {getDaysInMonth(lunaAfisata).map((data, i) => {
                    if (!data) return <div key={i} />;
                    const ocupata = esteOcupata(data);
                    const disponibila = esteDisponibila(data, modalUtilaj);
                    const selectata = esteSelectata(data);
                    const disabled = ocupata || !disponibila;

                    let bg = "#e8f5e8";
                    let color = "#2d4a2d";
                    if (!disponibila) { bg = "#f5f5f5"; color = "#ccc"; }
                    if (ocupata) { bg = "#fde8e8"; color = "#e74c3c"; }
                    if (selectata) { bg = "#1a2e1a"; color = "#e8d5a3"; }

                    return (
                      <div key={i} onClick={() => handleClickZi(data)} style={{
                        textAlign: "center", padding: "8px 4px",
                        borderRadius: "6px", cursor: disabled ? "not-allowed" : "pointer",
                        background: bg, color: color,
                        fontSize: "13px", fontFamily: "Arial, sans-serif",
                        fontWeight: selectata ? "bold" : "normal",
                        transition: "all 0.15s",
                        border: selectata ? "2px solid #4a7c4a" : "2px solid transparent",
                      }}>
                        {data.getDate()}
                      </div>
                    );
                  })}
                </div>

                {/* Interval selectat */}
                {(dataStart || dataEnd) && (
                  <div style={{ background: "#f0f7f0", borderRadius: "8px", padding: "12px", marginBottom: "1rem", border: "1px solid #d4e8d4", fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5a7a5a" }}>Start: <strong style={{ color: "#1a2e1a" }}>{dataStart || "—"}</strong></span>
                      <span style={{ color: "#5a7a5a" }}>End: <strong style={{ color: "#1a2e1a" }}>{dataEnd || "—"}</strong></span>
                    </div>
                    {dataStart && dataEnd && (
                      <p style={{ margin: "8px 0 0", color: "#2d4a2d", fontWeight: "bold" }}>
                        💰 Total: {Math.ceil((new Date(dataEnd) - new Date(dataStart)) / (1000 * 60 * 60 * 24) + 1) * modalUtilaj.pret_zi} lei
                        ({Math.ceil((new Date(dataEnd) - new Date(dataStart)) / (1000 * 60 * 60 * 24) + 1)} zile)
                      </p>
                    )}
                  </div>
                )}

                {bookingError && (
                  <div style={{ marginBottom: "1rem", padding: "10px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#dc2626", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
                    {bookingError}
                  </div>
                )}

                <button onClick={handleRezerva} disabled={bookingLoading || !dataStart || !dataEnd} style={{
                  width: "100%",
                  background: (!dataStart || !dataEnd || bookingLoading) ? "#ccc" : "#1a2e1a",
                  color: "#e8d5a3", border: "none", borderRadius: "8px",
                  padding: "13px", fontSize: "15px",
                  cursor: (!dataStart || !dataEnd || bookingLoading) ? "not-allowed" : "pointer",
                  fontFamily: "Georgia, serif", fontWeight: "bold",
                }}>
                  {bookingLoading ? "Se trimite..." : "🚜 Confirmă rezervarea"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}