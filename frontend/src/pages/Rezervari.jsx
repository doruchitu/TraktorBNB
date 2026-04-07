import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

export default function Rezervari() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("client");
  const [rezervariMele, setRezervariMele] = useState([]);
  const [rezervariPrimite, setRezervariPrimite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [mele, primite] = await Promise.all([
        axios.get("http://localhost:8000/bookings/my", { headers }),
        axios.get("http://localhost:8000/bookings/incoming", { headers }),
      ]);

      setRezervariMele(mele.data);
      setRezervariPrimite(primite.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId + action);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`http://localhost:8000/bookings/${bookingId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "#fef3c7", color: "#d97706", label: "În așteptare" };
      case "approved": return { bg: "#d1fae5", color: "#059669", label: "Aprobat" };
      case "rejected": return { bg: "#fee2e2", color: "#dc2626", label: "Respins" };
      case "cancelled": return { bg: "#f3f4f6", color: "#6b7280", label: "Anulat" };
      case "completed": return { bg: "#dbeafe", color: "#2563eb", label: "Finalizat" };
      default: return { bg: "#f3f4f6", color: "#6b7280", label: status };
    }
  };

  const formatData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  };

  const calcZile = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1);
  };

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
        padding: "2.5rem 2rem 2rem", textAlign: "center",
      }}>
        <h1 style={{ color: "#e8d5a3", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "1.5rem" }}>
          📋 Rezervările mele
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {[
            { key: "client", label: "🌾 Rezervările mele", count: rezervariMele.length },
            { key: "proprietar", label: "🚜 Cereri primite", count: rezervariPrimite.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "10px 20px", borderRadius: "8px", border: "none",
              background: tab === t.key ? "#e8d5a3" : "rgba(255,255,255,0.15)",
              color: tab === t.key ? "#1a2e1a" : "#9db89d",
              fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif",
              fontWeight: tab === t.key ? "bold" : "normal",
            }}>
              {t.label}
              {t.count > 0 && (
                <span style={{
                  marginLeft: "8px", background: tab === t.key ? "#1a2e1a" : "#e8d5a3",
                  color: tab === t.key ? "#e8d5a3" : "#1a2e1a",
                  borderRadius: "10px", padding: "2px 8px", fontSize: "12px",
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚜</div>
            <p>Se încarcă rezervările...</p>
          </div>
        ) : (
          <>
            {/* Tab Client */}
            {tab === "client" && (
              <div>
                {rezervariMele.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                    <p>Nu ai făcut nicio rezervare încă.</p>
                    <button onClick={() => navigate("/home")} style={{
                      marginTop: "16px", background: "#1a2e1a", color: "#e8d5a3",
                      border: "none", borderRadius: "8px", padding: "10px 24px",
                      cursor: "pointer", fontFamily: "Georgia, serif",
                    }}>Caută utilaje</button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {rezervariMele.map(r => {
                      const s = statusColor(r.status);
                      return (
                        <div key={r.id} style={{
                          background: "white", borderRadius: "12px",
                          border: "1px solid #e8e0d0", padding: "1.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                            <div>
                              <h3 style={{ margin: "0 0 4px", color: "#1a2e1a", fontSize: "18px" }}>
                                🚜 {r.utilaj.marca} {r.utilaj.model}
                              </h3>
                              <p style={{ margin: 0, color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
                                📍 {r.utilaj.judet}
                              </p>
                            </div>
                            <span style={{
                              background: s.bg, color: s.color,
                              padding: "4px 12px", borderRadius: "20px",
                              fontSize: "12px", fontFamily: "Arial, sans-serif", fontWeight: "bold",
                            }}>{s.label}</span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", background: "#f7f5f0", borderRadius: "8px", padding: "12px", marginBottom: "1rem" }}>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>De la</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#1a2e1a", fontFamily: "Arial, sans-serif" }}>{formatData(r.data_start)}</p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>Până la</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#1a2e1a", fontFamily: "Arial, sans-serif" }}>{formatData(r.data_end)}</p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>Total</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#2d4a2d", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                                {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei ({calcZile(r.data_start, r.data_end)} zile)
                              </p>
                            </div>
                          </div>

                          {r.status === "pending" && (
                            <button onClick={() => handleAction(r.id, "cancel")}
                              disabled={actionLoading === r.id + "cancel"}
                              style={{
                                background: "white", color: "#dc2626",
                                border: "1px solid #dc2626", borderRadius: "6px",
                                padding: "8px 16px", fontSize: "13px",
                                cursor: "pointer", fontFamily: "Georgia, serif",
                              }}>
                              {actionLoading === r.id + "cancel" ? "Se anulează..." : "Anulează rezervarea"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab Proprietar */}
            {tab === "proprietar" && (
              <div>
                {rezervariPrimite.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                    <p>Nu ai primit nicio cerere de rezervare încă.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {rezervariPrimite.map(r => {
                      const s = statusColor(r.status);
                      return (
                        <div key={r.id} style={{
                          background: "white", borderRadius: "12px",
                          border: "1px solid #e8e0d0", padding: "1.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                            <div>
                              <h3 style={{ margin: "0 0 4px", color: "#1a2e1a", fontSize: "18px" }}>
                                🚜 {r.utilaj.marca} {r.utilaj.model}
                              </h3>
                              <p style={{ margin: 0, color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
                                👤 {r.client.nume} {r.client.prenume} · 📞 {r.client.telefon}
                              </p>
                            </div>
                            <span style={{
                              background: s.bg, color: s.color,
                              padding: "4px 12px", borderRadius: "20px",
                              fontSize: "12px", fontFamily: "Arial, sans-serif", fontWeight: "bold",
                            }}>{s.label}</span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", background: "#f7f5f0", borderRadius: "8px", padding: "12px", marginBottom: "1rem" }}>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>De la</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#1a2e1a", fontFamily: "Arial, sans-serif" }}>{formatData(r.data_start)}</p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>Până la</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#1a2e1a", fontFamily: "Arial, sans-serif" }}>{formatData(r.data_end)}</p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#aaa", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>Total</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#2d4a2d", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                                {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei ({calcZile(r.data_start, r.data_end)} zile)
                              </p>
                            </div>
                          </div>

                          {r.status === "pending" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleAction(r.id, "approve")}
                                disabled={actionLoading === r.id + "approve"}
                                style={{
                                  background: "#1a2e1a", color: "#e8d5a3",
                                  border: "none", borderRadius: "6px",
                                  padding: "8px 20px", fontSize: "13px",
                                  cursor: "pointer", fontFamily: "Georgia, serif",
                                }}>
                                {actionLoading === r.id + "approve" ? "Se aprobă..." : "✅ Aprobă"}
                              </button>
                              <button onClick={() => handleAction(r.id, "reject")}
                                disabled={actionLoading === r.id + "reject"}
                                style={{
                                  background: "white", color: "#dc2626",
                                  border: "1px solid #dc2626", borderRadius: "6px",
                                  padding: "8px 20px", fontSize: "13px",
                                  cursor: "pointer", fontFamily: "Georgia, serif",
                                }}>
                                {actionLoading === r.id + "reject" ? "Se respinge..." : "❌ Respinge"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}