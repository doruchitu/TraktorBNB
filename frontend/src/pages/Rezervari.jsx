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
      case "pending": return { classes: "bg-amber-100 text-amber-700", label: "În așteptare" };
      case "approved": return { classes: "bg-emerald-100 text-emerald-700", label: "Aprobat" };
      case "rejected": return { classes: "bg-red-100 text-red-700", label: "Respins" };
      case "cancelled": return { classes: "bg-gray-100 text-gray-600", label: "Anulat" };
      case "completed": return { classes: "bg-blue-100 text-blue-700", label: "Finalizat" };
      default: return { classes: "bg-gray-100 text-gray-600", label: status };
    }
  };

  const formatData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  };

  const calcZile = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-serif pb-12">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] h-14 md:h-16 bg-[#1a2e1a] px-4 md:px-8 flex items-center justify-between shadow-md">
        <div 
          className="flex items-center gap-1.5 md:gap-2.5 cursor-pointer" 
          onClick={() => navigate("/home")}
        >
          {/* Doar aici am pus noul tău logo cu mask-image */}
          <div className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <span className="text-[#e8d5a3] text-[16px] md:text-[20px] font-bold tracking-[0.5px]">TraktorShare</span>
        </div>
        <button 
          onClick={() => navigate("/home")} 
          className="bg-transparent hover:bg-[#2d4a2d] text-[#9db89d] border border-[#3a5a3a] rounded-md px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-[13px] transition-colors font-sans whitespace-nowrap"
        >
          ← Înapoi
        </button>
      </nav>

      {/* HEADER REZERVĂRI */}
      <div className="bg-gradient-to-br from-[#1a2e1a] to-[#2d4a2d] pt-10 pb-8 px-4 text-center">
        <h1 className="text-[#e8d5a3] text-[clamp(1.5rem,4vw,2.2rem)] font-bold mb-6">
          📋 Rezervările mele
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          {[
            { key: "client", label: "🌾 Rezervările mele", count: rezervariMele.length },
            { key: "proprietar", label: "🚜 Cereri primite", count: rezervariPrimite.length },
          ].map(t => (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key)} 
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-none text-[14px] font-serif transition-colors w-full sm:w-auto ${
                tab === t.key 
                  ? "bg-[#e8d5a3] text-[#1a2e1a] font-bold" 
                  : "bg-white/15 hover:bg-white/20 text-[#9db89d]"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[12px] font-sans ${
                  tab === t.key ? "bg-[#1a2e1a] text-[#e8d5a3]" : "bg-[#e8d5a3] text-[#1a2e1a]"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[900px] mx-auto px-4 py-8">

        {loading ? (
          <div className="text-center py-16 text-gray-400 font-sans">
            <div className="text-5xl mb-4">🚜</div>
            <p>Se încarcă rezervările...</p>
          </div>
        ) : (
          <>
            {/* TAB CLIENT */}
            {tab === "client" && (
              <div>
                {rezervariMele.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 font-sans bg-white rounded-xl border border-[#e8e0d0] shadow-sm">
                    <div className="text-5xl mb-4">📋</div>
                    <p>Nu ai făcut nicio rezervare încă.</p>
                    <button 
                      onClick={() => navigate("/home")} 
                      className="mt-4 bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] border-none rounded-lg px-6 py-2.5 cursor-pointer font-serif font-bold transition-colors"
                    >
                      Caută utilaje
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {rezervariMele.map(r => {
                      const s = statusColor(r.status);
                      return (
                        <div key={r.id} className="bg-white rounded-xl border border-[#e8e0d0] p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                            <div>
                              <h3 className="m-0 mb-1 text-[#1a2e1a] text-[18px] font-bold">
                                🚜 {r.utilaj.marca} {r.utilaj.model}
                              </h3>
                              <p className="m-0 text-gray-500 text-[13px] font-sans">
                                📍 {r.utilaj.judet}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[12px] font-sans font-bold whitespace-nowrap ${s.classes}`}>
                              {s.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-[#f7f5f0] rounded-lg p-4 mb-4">
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">De la</p>
                              <p className="m-0 text-[14px] text-[#1a2e1a] font-sans">{formatData(r.data_start)}</p>
                            </div>
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">Până la</p>
                              <p className="m-0 text-[14px] text-[#1a2e1a] font-sans">{formatData(r.data_end)}</p>
                            </div>
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">Total</p>
                              <p className="m-0 text-[14px] text-[#2d4a2d] font-sans font-bold">
                                {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei <span className="text-gray-500 font-normal">({calcZile(r.data_start, r.data_end)} zile)</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {r.status === "pending" && (
                              <button 
                                onClick={() => handleAction(r.id, "cancel")}
                                disabled={actionLoading === r.id + "cancel"}
                                className="bg-white hover:bg-red-50 text-red-600 border border-red-600 rounded-md px-4 py-2 text-[13px] cursor-pointer font-serif transition-colors disabled:opacity-50"
                              >
                                {actionLoading === r.id + "cancel" ? "Se anulează..." : "Anulează rezervarea"}
                              </button>
                            )}
                            {r.status === "approved" && (
                              <>
                                <button 
                                  onClick={() => handleDescarcaContract(r.id)} 
                                  className="bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] border-none rounded-md px-5 py-2 text-[13px] cursor-pointer font-serif transition-colors"
                                >
                                  📄 Descarcă model de contract
                                </button>
                                {!reviewedBookings.includes(r.id) && (
                                  <button 
                                    onClick={() => { setModalRating(r); setRatingValue(0); setComentariu(""); setRatingError(""); }} 
                                    className="bg-white hover:bg-gray-50 text-[#1a2e1a] border border-[#1a2e1a] rounded-md px-5 py-2 text-[13px] cursor-pointer font-serif transition-colors"
                                  >
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

            {/* TAB PROPRIETAR */}
            {tab === "proprietar" && (
              <div>
                {rezervariPrimite.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 font-sans bg-white rounded-xl border border-[#e8e0d0] shadow-sm">
                    <div className="text-5xl mb-4">📭</div>
                    <p>Nu ai primit nicio cerere de rezervare încă.</p>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {rezervariPrimite.map(r => {
                      const s = statusColor(r.status);
                      return (
                        <div key={r.id} className="bg-white rounded-xl border border-[#e8e0d0] p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                            <div>
                              <h3 className="m-0 mb-1 text-[#1a2e1a] text-[18px] font-bold">
                                🚜 {r.utilaj.marca} {r.utilaj.model}
                              </h3>
                              <p className="m-0 text-gray-500 text-[13px] font-sans">
                                👤 {r.client.nume} {r.client.prenume} · 📞 {r.client.telefon}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[12px] font-sans font-bold whitespace-nowrap ${s.classes}`}>
                              {s.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-[#f7f5f0] rounded-lg p-4 mb-4">
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">De la</p>
                              <p className="m-0 text-[14px] text-[#1a2e1a] font-sans">{formatData(r.data_start)}</p>
                            </div>
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">Până la</p>
                              <p className="m-0 text-[14px] text-[#1a2e1a] font-sans">{formatData(r.data_end)}</p>
                            </div>
                            <div>
                              <p className="m-0 mb-1 text-[11px] text-gray-400 font-sans uppercase tracking-[1px] font-bold">Total</p>
                              <p className="m-0 text-[14px] text-[#2d4a2d] font-sans font-bold">
                                {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei <span className="text-gray-500 font-normal">({calcZile(r.data_start, r.data_end)} zile)</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {r.status === "pending" && (
                              <>
                                <button 
                                  onClick={() => handleAction(r.id, "approve")}
                                  disabled={actionLoading === r.id + "approve"}
                                  className="bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] border-none rounded-md px-5 py-2 text-[13px] cursor-pointer font-serif transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === r.id + "approve" ? "Se aprobă..." : "✅ Aprobă"}
                                </button>
                                <button 
                                  onClick={() => handleAction(r.id, "reject")}
                                  disabled={actionLoading === r.id + "reject"}
                                  className="bg-white hover:bg-red-50 text-red-600 border border-red-600 rounded-md px-5 py-2 text-[13px] cursor-pointer font-serif transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === r.id + "reject" ? "Se respinge..." : "❌ Respinge"}
                                </button>
                              </>
                            )}
                            {r.status === "approved" && (
                              <button 
                                onClick={() => handleDescarcaContract(r.id)} 
                                className="bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] border-none rounded-md px-5 py-2 text-[13px] cursor-pointer font-serif transition-colors"
                              >
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

      {/* MODAL RATING */}
      {modalRating && (
        <div 
          className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" 
          onClick={() => setModalRating(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-[420px] shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-[#1a2e1a] m-0 mb-1 text-[20px] font-bold">
              Evaluează {modalRating.utilaj.marca} {modalRating.utilaj.model}
            </h3>
            <p className="text-gray-500 font-sans text-[13px] mb-6">
              Cum a fost experiența ta cu acest utilaj?
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  onClick={() => setRatingValue(star)} 
                  className={`text-[36px] cursor-pointer transition-colors ${
                    star <= ratingValue 
                      ? "text-[#e8d5a3] drop-shadow-[0_0_1px_#c9a961]" 
                      : "text-gray-200"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={comentariu}
              onChange={e => setComentariu(e.target.value)}
              placeholder="Lasă un comentariu (opțional)..."
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 text-[14px] font-sans outline-none focus:border-[#4a7c4a] focus:ring-1 focus:ring-[#4a7c4a] resize-y mb-4"
            />

            {ratingError && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-300 rounded-lg text-red-600 text-[13px] font-sans">
                {ratingError}
              </div>
            )}

            <button 
              onClick={handleTrimiteRating} 
              disabled={ratingLoading} 
              className={`w-full border-none rounded-lg p-3 text-[15px] font-bold font-serif transition-colors ${
                ratingLoading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] cursor-pointer"
              }`}
            >
              {ratingLoading ? "Se trimite..." : "Trimite evaluarea"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}