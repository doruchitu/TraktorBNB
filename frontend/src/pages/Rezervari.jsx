import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { auth } from "../firebase";

export default function Rezervari() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("client");
  const [rezervariMele, setRezervariMele] = useState([]);
  const [rezervariPrimite, setRezervariPrimite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [modalRating, setModalRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comentariu, setComentariu] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [reviewedBookings, setReviewedBookings] = useState([]);

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
        api.get("/bookings/my", { headers }),
        api.get("/bookings/incoming", { headers }),
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
      await api.put(`/bookings/${bookingId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDescarcaContract = async (bookingId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await api.get(`/contract/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contract_TBN_${String(bookingId).padStart(4, "0")}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    } catch (err) {
      alert("Eroare la descărcarea contractului.");
    }
  };

  const handleTrimiteRating = async () => {
    if (ratingValue === 0) {
      setRatingError("Selectează un rating.");
      return;
    }
    setRatingLoading(true);
    setRatingError("");
    try {
      const token = await auth.currentUser.getIdToken();
      await api.post("/reviews/", {
        booking_id: modalRating.id,
        rating: ratingValue,
        comentariu: comentariu.trim() || null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewedBookings([...reviewedBookings, modalRating.id]);
      setModalRating(null);
      setRatingValue(0);
      setComentariu("");
    } catch (err) {
      setRatingError(err.response?.data?.detail || "Eroare la trimiterea evaluării.");
    } finally {
      setRatingLoading(false);
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

      <nav style={{
        background: "#1a2e1a", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/home")}>
          <span style={{ fontSize: "22px" }}>🚜</span>
          <span style={{ color: "#e8d5a3", fontSize: "20px", fontWeight: "bold" }}>TraktorShare</span>
        </div>
        <button onClick={() => navigate("/home")} style={{
          background: "transparent", color: "#9db89d",
          border: "1px solid #3a5a3a", borderRadius: "6px",
          padding: "8px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
        }}>← Înapoi</button>
      </nav>

      <div style={{
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)",
        padding: "2.5rem 2rem 2rem", textAlign: "center",
      }}>
        <h1 style={{ color: "#e8d5a3", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "1.5rem" }}>
          📋 Rezervările mele
        </h1>

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

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", fontFamily: "Arial, sans-serif" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚜</div>
            <p>Se încarcă rezervările...</p>
          </div>
        ) : (
          <>

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

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                            {r.status === "approved" && (
                              <>
                                <button onClick={() => handleDescarcaContract(r.id)} style={{
                                  background: "#1a2e1a", color: "#e8d5a3",
                                  border: "none", borderRadius: "6px",
                                  padding: "8px 20px", fontSize: "13px",
                                  cursor: "pointer", fontFamily: "Georgia, serif",
                                }}>
                                  📄 Descarcă model de contract
                                </button>
                                {!reviewedBookings.includes(r.id) && (
                                  <button onClick={() => { setModalRating(r); setRatingValue(0); setComentariu(""); setRatingError(""); }} style={{
                                    background: "white", color: "#1a2e1a",
                                    border: "1px solid #1a2e1a", borderRadius: "6px",
                                    padding: "8px 20px", fontSize: "13px",
                                    cursor: "pointer", fontFamily: "Georgia, serif",
                                  }}>
                                    ⭐ Evaluează
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {r.status === "pending" && (
                              <>
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
                              </>
                            )}
                            {r.status === "approved" && (
                              <button onClick={() => handleDescarcaContract(r.id)} style={{
                                background: "#1a2e1a", color: "#e8d5a3",
                                border: "none", borderRadius: "6px",
                                padding: "8px 20px", fontSize: "13px",
                                cursor: "pointer", fontFamily: "Georgia, serif",
                              }}>
                                📄 Descarcă model de contract
                              </button>
                            )}
                          </div>
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

      {modalRating && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
        }} onClick={() => setModalRating(null)}>
          <div style={{
            background: "white", borderRadius: "16px",
            padding: "2rem", maxWidth: "420px", width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }} onClick={e => e.stopPropagation()}>

            <h3 style={{ color: "#1a2e1a", margin: "0 0 4px", fontSize: "20px" }}>
              Evaluează {modalRating.utilaj.marca} {modalRating.utilaj.model}
            </h3>
            <p style={{ color: "#888", fontFamily: "Arial, sans-serif", fontSize: "13px", marginBottom: "1.5rem" }}>
              Cum a fost experiența ta cu acest utilaj?
            </p>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "1.5rem" }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRatingValue(star)} style={{
                  fontSize: "36px", cursor: "pointer",
                  color: star <= ratingValue ? "#e8d5a3" : "#e0e0e0",
                  filter: star <= ratingValue ? "drop-shadow(0 0 1px #c9a961)" : "none",
                }}>
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={comentariu}
              onChange={e => setComentariu(e.target.value)}
              placeholder="Lasă un comentariu (opțional)..."
              rows={3}
              style={{
                width: "100%", padding: "12px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", fontFamily: "Arial, sans-serif",
                outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "1rem",
              }}
            />

            {ratingError && (
              <div style={{
                marginBottom: "1rem", padding: "10px", background: "#fef2f2",
                border: "1px solid #fca5a5", borderRadius: "8px",
                color: "#dc2626", fontSize: "13px", fontFamily: "Arial, sans-serif",
              }}>
                {ratingError}
              </div>
            )}

            <button onClick={handleTrimiteRating} disabled={ratingLoading} style={{
              width: "100%",
              background: ratingLoading ? "#ccc" : "#1a2e1a",
              color: ratingLoading ? "#888" : "#e8d5a3",
              border: "none", borderRadius: "8px", padding: "13px",
              fontSize: "15px", cursor: ratingLoading ? "not-allowed" : "pointer",
              fontFamily: "Georgia, serif", fontWeight: "bold",
            }}>
              {ratingLoading ? "Se trimite..." : "Trimite evaluarea"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}