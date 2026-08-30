import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
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
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [stats, setStats] = useState({ total_utilaje: 0, total_useri: 0, rating_general: null, rating_count: 0 });
  const [modalDetalii, setModalDetalii] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviewsDetalii, setReviewsDetalii] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser({ nume: "Fermier" });
    setTimeout(() => setVisible(true), 50);

    const firebaseUser = auth.currentUser;
    if (firebaseUser) setCurrentUserEmail(firebaseUser.email);

    api.get("/machinery/")
      .then(res => {
        setUtilaje(res.data);
        setLoadingUtilaje(false);
        res.data.forEach(u => {
          api.get(`/reviews/machinery/${u.id}`)
            .then(r => {
              setRatings(prev => ({ ...prev, [u.id]: { average: r.data.average, count: r.data.count } }));
            })
            .catch(() => {});
        });
      })
      .catch(err => {
        console.error(err);
        setLoadingUtilaje(false);
      });

    api.get("/stats/")
      .then(res => setStats(prev => ({ ...prev, ...res.data })))
      .catch(err => {});

    api.get("/stats/rating-general")
      .then(res => setStats(prev => ({ ...prev, rating_general: res.data.average, rating_count: res.data.count })))
      .catch(err => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSterge = async (utilajId) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest utilaj?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await api.delete(`/machinery/${utilajId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilaje(utilaje.filter(u => u.id !== utilajId));
    } catch (err) {
      alert("Eroare la ștergerea utilajului.");
    }
  };

  const deschideModal = async (utilaj) => {
    setModalUtilaj(utilaj);
    setDataStart(null);
    setDataEnd(null);
    setBookingError("");
    setBookingSuccess(false);
    setLunaAfisata(new Date());
    try {
      const res = await api.get(`/bookings/ocupate/${utilaj.id}`);
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
      await api.post("/bookings/", {
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
    <div className="min-h-screen bg-[#f7f5f0] font-serif">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] h-14 md:h-16 bg-[#1a2e1a] px-3 md:px-8 flex items-center justify-between shadow-md">
        
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <div className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <span className="text-[#e8d5a3] text-[16px] md:text-[20px] font-bold tracking-[0.5px]">TraktorShare</span>
        </div>

        <div className="flex items-center gap-1.5 md:gap-4">
          <span className="hidden md:inline text-[#9db89d] text-[14px] font-sans mr-2">
            Bună, <span className="text-[#e8d5a3] font-bold">{user?.nume}</span>
          </span>
          
          <button onClick={() => navigate("/adauga-utilaj")} className="bg-[#4a7c4a] hover:bg-[#3a5a3a] text-white border-none rounded-md px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-[13px] transition-colors font-sans font-medium whitespace-nowrap">
            <span className="hidden sm:inline">+ Adaugă Utilaj</span>
            <span className="sm:hidden">+ Adaugă</span>
          </button>
          
          <button onClick={() => navigate("/rezervari")} className="bg-transparent hover:bg-[#2d4a2d] text-[#9db89d] border border-[#3a5a3a] rounded-md px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-[13px] transition-colors font-sans whitespace-nowrap">
            <span className="hidden sm:inline">📋 Rezervări</span>
            <span className="sm:hidden">📋</span>
          </button>
          
          <button onClick={handleLogout} className="bg-transparent hover:bg-[#2d4a2d] text-[#9db89d] border border-[#3a5a3a] rounded-md px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-[13px] transition-colors font-sans whitespace-nowrap">
            <span className="hidden sm:inline">Ieși</span>
            <span className="sm:hidden">🚪</span>
          </button>
        </div>
      </nav>

      <div className={`relative overflow-hidden bg-gradient-to-br from-[#1a2e1a] via-[#2d4a2d] to-[#1a2e1a] pt-16 pb-12 px-8 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white opacity-5 [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
        
        <p className="text-[#9db89d] text-[13px] tracking-[3px] uppercase mb-4 font-sans relative z-10">
          Platforma #1 de închirieri agricole din România
        </p>
        <h1 className="text-[#e8d5a3] text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4 leading-[1.2] relative z-10">
          Găsește utilajul potrivit,<br />
          <span className="text-[#7dc47d]">în județul tău.</span>
        </h1>
        <p className="text-[#9db89d] text-base max-w-[500px] mx-auto mb-8 leading-[1.7] font-sans relative z-10">
          Conectăm fermierii români. Închiriezi sau îți pui utilajul la muncă când nu îl folosești.
        </p>
        <div className="flex max-w-[500px] mx-auto gap-2 relative z-10">
          <input
            placeholder="Caută marcă, model, județ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border-none text-[15px] font-sans bg-white/95 focus:outline-none focus:ring-2 focus:ring-[#7dc47d] transition-shadow"
          />
          <button className="bg-[#4a7c4a] hover:bg-[#3a5a3a] text-white rounded-lg px-5 py-3 text-[15px] transition-colors">
            🔍
          </button>
        </div>
      </div>

      <div className={`bg-[#e8d5a3] py-5 px-8 flex justify-center gap-[clamp(1rem,5vw,4rem)] flex-wrap transition-all duration-700 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
        {[
          { val: utilaje.length + "+", label: "Utilaje disponibile" },
          { val: stats.total_useri + "+", label: "Fermieri înregistrați" },
          { val: "41", label: "Județe acoperite" },
          { val: stats.rating_general ? `${stats.rating_general}★` : "—", label: stats.rating_general ? `Rating mediu (${stats.rating_count})` : "Fără recenzii încă" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-[22px] font-bold text-[#1a2e1a]">{s.val}</div>
            <div className="text-[12px] text-[#5a6e4a] font-sans tracking-[0.5px]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto p-8">

        {/* FILTERS */}
        <div className={`flex flex-wrap items-center gap-2 mb-8 transition-all duration-700 delay-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          <span className="text-[13px] text-gray-500 font-sans mr-1">Județ:</span>
          {judete.map(j => (
            <button 
              key={j} 
              onClick={() => setJudetFiltrat(j)} 
              className={`px-4 py-1.5 rounded-full text-[13px] font-sans transition-colors ${
                judetFiltrat === j 
                  ? "bg-[#1a2e1a] text-[#e8d5a3] border-transparent" 
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {j}
            </button>
          ))}
          <span className="ml-auto text-[13px] text-gray-500 font-sans">
            {utilajeFiltrate.length} utilaje găsite
          </span>
        </div>

        {loadingUtilaje ? (
          <div className="text-center py-16 text-gray-400 font-sans">
            <div className="w-[60px] h-[60px] bg-gray-300 mx-auto mb-4 [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
            <p>Se încarcă utilajele...</p>
          </div>
        ) : utilajeFiltrate.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-sans">
            <div className="text-5xl mb-4">🔍</div>
            <p>Niciun utilaj găsit pentru criteriile selectate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {utilajeFiltrate.map((u, i) => (
              <div 
                key={u.id}
                onClick={() => {
                  setModalDetalii(u);
                  setReviewsDetalii(null);
                  api.get(`/reviews/machinery/${u.id}`)
                    .then(res => setReviewsDetalii(res.data))
                    .catch(() => setReviewsDetalii({ average: null, count: 0, reviews: [] }));
                }}
                className={`bg-white rounded-xl overflow-hidden border border-[#e8e0d0] cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${0.1 * i + 0.4}s` }}
              >
                <div className={`h-[160px] flex items-center justify-center relative overflow-hidden ${u.imagine_url ? 'bg-transparent' : 'bg-gradient-to-br from-[#2d4a2d] to-[#4a7c4a]'}`}>
                  {u.imagine_url ? (
                    <img src={u.imagine_url} alt={`${u.marca} ${u.model}`} className="w-full h-full object-cover block" />
                  ) : (
                    <div className="w-[60px] h-[60px] bg-white/30 [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
                  )}
                  <div className={`absolute top-3 right-3 text-white px-2.5 py-1 rounded text-[11px] font-sans ${u.disponibil ? 'bg-[#27ae60]' : 'bg-[#c0392b]'}`}>
                    {u.disponibil ? "Disponibil" : "Indisponibil"}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-[#e8d5a3] px-2.5 py-1 rounded text-[12px] font-sans">
                    📍 {u.judet}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="m-0 mb-1 text-[18px] text-[#1a2e1a] font-bold">
                    {u.marca} {u.model}
                  </h3>
                  <p className="m-0 mb-1.5 text-[13px] text-gray-500 font-sans">
                    ⚡ {u.putere_cp ? `${u.putere_cp} CP` : "—"}
                  </p>
                  <p className="m-0 mb-3 text-[13px] font-sans">
                    {ratings[u.id]?.average ? (
                      <span className="text-[#d4a017]">⭐ {ratings[u.id].average} <span className="text-gray-400">({ratings[u.id].count})</span></span>
                    ) : (
                      <span className="text-gray-400">Fără recenzii încă</span>
                    )}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#f0ebe0] pt-3">
                    <div>
                      <span className="text-[22px] font-bold text-[#2d4a2d]">{u.pret_zi} lei</span>
                      <span className="text-[14px] text-[#5a7a5a] font-sans font-semibold"> / zi</span>
                    </div>
                    <div className="flex gap-2">
                      {u.owner?.email === currentUserEmail && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSterge(u.id); }}
                          className="bg-white text-red-600 border border-red-600 rounded-md px-3.5 py-2 text-[13px] hover:bg-red-50 transition-colors font-sans"
                        >
                          🗑️
                        </button>
                      )}
                      <button
                        disabled={!u.disponibil}
                        onClick={(e) => { e.stopPropagation(); deschideModal(u); }}
                        className={`rounded-md px-4 py-2 text-[13px] font-sans transition-colors ${
                          u.disponibil ? 'bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {u.disponibil ? "Rezervă" : "Indisponibil"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1a2e1a] text-[#9db89d] text-center p-8 mt-16 text-[13px] font-sans">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <div className="text-[20px] text-[#e8d5a3] font-bold font-serif">TraktorShare</div>
        </div>
        <p className="m-0 opacity-60">© 2026 TraktorShare · Platforma fermierilor români</p>
      </footer>

      {modalDetalii && (
        <div 
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4" 
          onClick={() => setModalDetalii(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="h-[320px] relative">
              {modalDetalii.imagine_url ? (
                <img src={modalDetalii.imagine_url} alt={`${modalDetalii.marca} ${modalDetalii.model}`} className="w-full h-full object-cover rounded-t-2xl block" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2d4a2d] to-[#4a7c4a] flex items-center justify-center rounded-t-2xl">
                  <div className="w-[80px] h-[80px] bg-white/30 [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
                </div>
              )}
              <button 
                onClick={() => setModalDetalii(null)} 
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none rounded-full w-9 h-9 text-[18px] cursor-pointer flex items-center justify-center transition-colors"
              >✕</button>
              <div className={`absolute top-4 left-4 text-white px-3 py-1.5 rounded text-[12px] font-sans ${modalDetalii.disponibil ? 'bg-[#27ae60]' : 'bg-[#c0392b]'}`}>
                {modalDetalii.disponibil ? "Disponibil" : "Indisponibil"}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-[#1a2e1a] m-0 mb-2 text-[24px]">
                {modalDetalii.marca} {modalDetalii.model}
              </h2>
              <p className="text-gray-500 font-sans m-0 mb-4 text-[14px]">
                📍 {modalDetalii.judet} · ⚡ {modalDetalii.putere_cp ? `${modalDetalii.putere_cp} CP` : "Putere nespecificată"}
              </p>

              <div className="flex items-baseline mb-5 border-b border-[#f0ebe0] pb-4">
                <span className="text-[26px] font-bold text-[#2d4a2d]">{modalDetalii.pret_zi} lei</span>
                <span className="text-[14px] text-[#5a7a5a] ml-1 font-semibold">/ zi</span>
              </div>

              {modalDetalii.descriere && (
                <div className="mb-5">
                  <h4 className="text-[#1a2e1a] text-[14px] mb-1.5 font-sans font-bold">📝 Descriere</h4>
                  <p className="text-gray-600 font-sans text-[14px] leading-relaxed m-0">
                    {modalDetalii.descriere}
                  </p>
                </div>
              )}

              {(modalDetalii.data_disponibil_de || modalDetalii.data_disponibil_pana) && (
                <div className="mb-5">
                  <h4 className="text-[#1a2e1a] text-[14px] mb-1.5 font-sans font-bold">📅 Disponibil în perioada</h4>
                  <p className="text-gray-600 font-sans text-[14px] m-0">
                    {modalDetalii.data_disponibil_de} → {modalDetalii.data_disponibil_pana}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <h4 className="text-[#1a2e1a] text-[14px] mb-2.5 font-sans font-bold">
                  ⭐ Recenzii {reviewsDetalii?.count > 0 && `(${reviewsDetalii.count})`}
                </h4>
                {!reviewsDetalii ? (
                  <p className="text-gray-400 font-sans text-[13px]">Se încarcă...</p>
                ) : reviewsDetalii.count === 0 ? (
                  <p className="text-gray-400 font-sans text-[13px]">Niciun fermier nu a evaluat încă acest utilaj.</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[22px] font-bold text-[#1a2e1a]">{reviewsDetalii.average}</span>
                      <span className="text-[#d4a017] text-[16px]">
                        {"★".repeat(Math.round(reviewsDetalii.average))}{"☆".repeat(5 - Math.round(reviewsDetalii.average))}
                      </span>
                      <span className="text-gray-500 text-[13px] font-sans">din {reviewsDetalii.count} recenzii</span>
                    </div>
                    <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-2">
                      {reviewsDetalii.reviews.map((rev, i) => (
                        <div key={i} className="bg-[#f7f5f0] rounded-lg py-2.5 px-3">
                          <div className="flex justify-between mb-1">
                            <span className="font-sans text-[12px] font-bold text-[#1a2e1a]">{rev.client_nume}</span>
                            <span className="text-[#d4a017] text-[12px]">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                          </div>
                          {rev.comentariu && (
                            <p className="m-0 font-sans text-[13px] text-gray-600 leading-relaxed">
                              {rev.comentariu}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                disabled={!modalDetalii.disponibil}
                onClick={() => { const u = modalDetalii; setModalDetalii(null); deschideModal(u); }}
                className={`w-full flex justify-center items-center gap-2 border-none rounded-lg p-3 text-[15px] font-bold transition-colors ${
                  modalDetalii.disponibil ? 'bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {modalDetalii.disponibil ? (
                  <>
                    <div className="w-[18px] h-[18px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
                    Rezervă acest utilaj
                  </>
                ) : "Indisponibil momentan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REZERVARE UTILAJ */}
      {modalUtilaj && (
        <div 
          className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" 
          onClick={() => setModalUtilaj(null)}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-full max-w-[480px] shadow-2xl max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            {bookingSuccess ? (
              <div className="text-center p-4">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-[#1a2e1a] mb-2 font-bold text-xl">Rezervare trimisă!</h3>
                <p className="text-gray-500 font-sans text-[14px] mb-6">
                  Proprietarul va aproba sau respinge cererea ta în curând.
                </p>
                <button onClick={() => setModalUtilaj(null)} className="bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] border-none rounded-lg px-6 py-2.5 cursor-pointer font-serif transition-colors">
                  Închide
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[#1a2e1a] m-0 mb-1 text-[20px] font-bold">
                      {modalUtilaj.marca} {modalUtilaj.model}
                    </h3>
                    <p className="text-gray-500 m-0 font-sans text-[13px]">
                      📍 {modalUtilaj.judet} · {modalUtilaj.pret_zi} lei/zi
                    </p>
                  </div>
                  <button onClick={() => setModalUtilaj(null)} className="bg-transparent border-none text-[20px] cursor-pointer text-gray-400 hover:text-gray-700 transition-colors">
                    ✕
                  </button>
                </div>

                <div className="flex gap-4 mb-4 font-sans text-[12px]">
                  {[
                    { color: "bg-[#27ae60]", label: "Disponibil", border: "" },
                    { color: "bg-[#e74c3c]", label: "Ocupat", border: "" },
                    { color: "bg-[#f5f5f5]", label: "Indisponibil", border: "border border-gray-300" },
                    { color: "bg-[#1a2e1a]", label: "Selectat", border: "" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-[3px] ${l.color} ${l.border}`} />
                      <span className="text-gray-600">{l.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setLunaAfisata(new Date(lunaAfisata.getFullYear(), lunaAfisata.getMonth() - 1))}
                    className="bg-transparent border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer text-[16px] hover:bg-gray-50 transition-colors">
                    ‹
                  </button>
                  <span className="font-bold text-[#1a2e1a] text-[16px] capitalize">
                    {lunaAfisata.toLocaleString("ro-RO", { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={() => setLunaAfisata(new Date(lunaAfisata.getFullYear(), lunaAfisata.getMonth() + 1))}
                    className="bg-transparent border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer text-[16px] hover:bg-gray-50 transition-colors">
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["D", "L", "M", "M", "J", "V", "S"].map((z, i) => (
                    <div key={i} className="text-center text-[11px] font-sans text-gray-400 py-1 font-bold">
                      {z}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 mb-6">
                  {getDaysInMonth(lunaAfisata).map((data, i) => {
                    if (!data) return <div key={i} />;
                    const ocupata = esteOcupata(data);
                    const disponibila = esteDisponibila(data, modalUtilaj);
                    const selectata = esteSelectata(data);
                    const disabled = ocupata || !disponibila;

                    let bgClass = "bg-[#e8f5e8]";
                    let textClass = "text-[#2d4a2d]";
                    let borderClass = "border-transparent";
                    let fontClass = "font-normal";

                    if (!disponibila) { bgClass = "bg-[#f5f5f5]"; textClass = "text-gray-300"; }
                    if (ocupata) { bgClass = "bg-[#fde8e8]"; textClass = "text-[#e74c3c]"; }
                    if (selectata) { 
                      bgClass = "bg-[#1a2e1a]"; 
                      textClass = "text-[#e8d5a3]"; 
                      borderClass = "border-[#4a7c4a]"; 
                      fontClass = "font-bold";
                    }

                    return (
                      <div 
                        key={i} 
                        onClick={() => handleClickZi(data)} 
                        className={`text-center py-2 rounded-md border-2 text-[13px] font-sans transition-all ${bgClass} ${textClass} ${borderClass} ${fontClass} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-80'}`}
                      >
                        {data.getDate()}
                      </div>
                    );
                  })}
                </div>

                {(dataStart || dataEnd) && (
                  <div className="bg-[#f0f7f0] rounded-lg p-3 mb-4 border border-[#d4e8d4] font-sans text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#5a7a5a]">Start: <strong className="text-[#1a2e1a]">{dataStart || "—"}</strong></span>
                      <span className="text-[#5a7a5a]">End: <strong className="text-[#1a2e1a]">{dataEnd || "—"}</strong></span>
                    </div>
                    {dataStart && dataEnd && (
                      <p className="mt-2 mb-0 text-[#2d4a2d] font-bold">
                        💰 Total: {Math.ceil((new Date(dataEnd) - new Date(dataStart)) / (1000 * 60 * 60 * 24) + 1) * modalUtilaj.pret_zi} lei
                        ({Math.ceil((new Date(dataEnd) - new Date(dataStart)) / (1000 * 60 * 60 * 24) + 1)} zile)
                      </p>
                    )}
                  </div>
                )}

                {bookingError && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-300 rounded-lg text-red-600 text-[13px] font-sans">
                    {bookingError}
                  </div>
                )}

                <button 
                  onClick={handleRezerva} 
                  disabled={bookingLoading || !dataStart || !dataEnd} 
                  className={`w-full flex justify-center items-center gap-2 border-none rounded-lg p-3 text-[15px] font-bold transition-colors ${
                    (!dataStart || !dataEnd || bookingLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1a2e1a] hover:bg-[#2d4a2d] text-[#e8d5a3] cursor-pointer'
                  }`}
                >
                  {bookingLoading ? "Se trimite..." : (
                    <>
                      {dataStart && dataEnd && !bookingLoading && (
                        <div className="w-[18px] h-[18px] bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
                      )}
                      Confirmă rezervarea
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}