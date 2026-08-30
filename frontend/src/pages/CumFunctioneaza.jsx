import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function CumFunctioneaza() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [rolActiv, setRolActiv] = useState("proprietar");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pasiProprietar = [
    { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă, sau autentificare directă." },
    { nr: "02", title: "Publică utilajul", desc: "Adaugă marca, modelul, puterea, prețul pe zi și perioada de disponibilitate." },
    { nr: "03", title: "Primești cereri", desc: "Fermierii interesați trimit cereri de rezervare pe zilele disponibile." },
    { nr: "04", title: "Aprobi rezervarea", desc: "Accepți sau respingi cererea direct din panoul de Rezervări." },
    { nr: "05", title: "Predai utilajul", desc: "La preluare, ambele părți au deja modelul de contract descărcat." },
  ];

  const pasiClient = [
    { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă, sau autentificare directă." },
    { nr: "02", title: "Cauți utilajul", desc: "Filtrezi după județ, marcă sau preț și găsești ce ai nevoie." },
    { nr: "03", title: "Verifici calendarul", desc: "Vezi în timp real ce zile sunt libere, fără telefoane în plus." },
    { nr: "04", title: "Trimiți cererea", desc: "Selectezi intervalul dorit și aștepți confirmarea proprietarului." },
    { nr: "05", title: "Preiei utilajul", desc: "După aprobare, descarci modelul de contract și mergi la treabă." },
  ];

  const pasiActivi = rolActiv === "proprietar" ? pasiProprietar : pasiClient;

  return (
    <div className="min-h-screen bg-[#0d1a0d] font-serif overflow-x-hidden">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 h-[60px] md:h-[70px] flex items-center justify-between transition-all duration-300 ${
        scrollY > 50 ? "bg-[#0d1a0d]/95 backdrop-blur-md border-b border-[#e8d5a3]/10" : "bg-transparent"
      }`}>
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          {/* Logo bej */}
          <div className="w-5 h-5 md:w-6 md:h-6 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <span className="text-[#e8d5a3] text-[18px] md:text-[22px] font-bold tracking-[1px]">
            TraktorShare
          </span>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={() => navigate("/login")} 
            className="bg-transparent text-[#e8d5a3] border border-[#e8d5a3]/40 hover:border-[#e8d5a3] rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-[14px] transition-colors"
          >
            <span className="hidden sm:inline">Autentificare</span>
            <span className="sm:hidden">Intră</span>
          </button>
          <button 
            onClick={() => navigate("/signup")} 
            className="bg-[#4a7c4a] hover:bg-[#3a6a3a] text-white border-none rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-[14px] transition-colors"
          >
            <span className="hidden sm:inline">Creează cont</span>
            <span className="sm:hidden">Cont nou</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-[linear-gradient(160deg,#0d1a0d_0%,#1a2e1a_60%,#0d1a0d_100%)] text-center pt-[120px] md:pt-[150px] px-4 md:px-8 pb-12 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full border border-[#e8d5a3]/5 top-[-5%] left-1/2 -translate-x-1/2" />

        <h1 className={`text-[#e8d5a3] text-[clamp(2rem,5vw,3.2rem)] font-bold mb-4 leading-[1.15] transition-all duration-800 ease-out delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          Cum funcționează <span className="text-[#7dc47d]">TraktorShare</span>
        </h1>
        <p className={`text-[#9db89d] text-base max-w-[540px] mx-auto leading-[1.8] font-sans transition-opacity duration-800 ease-out delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
          Fiecare rezervare pornește din același loc și leagă doi oameni: cel care are un utilaj liber și cel care are nevoie de el.
        </p>
      </div>

      {/* DIAGRAM SECTION*/}
      <div className="bg-[#0d1a0d] px-4 md:px-8 pb-20 pt-4 hidden md:block">
        <div className="max-w-[780px] mx-auto relative">
          
          <div className="flex justify-center mb-0">
            <div className={`bg-[#e8d5a3] text-[#1a2e1a] rounded-lg px-7 py-3.5 font-sans font-bold text-[14px] shadow-[0_4px_20px_rgba(232,213,163,0.15)] transition-all duration-700 ease-out delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              🌾 Cont creat pe TraktorShare
            </div>
          </div>

          <svg width="100%" height="60" viewBox="0 0 780 60" className="block">
            <path d="M 390 0 C 390 30, 195 15, 195 60" stroke="rgba(125,196,125,0.35)" strokeWidth="2" fill="none" />
            <path d="M 390 0 C 390 30, 585 15, 585 60" stroke="rgba(74,124,74,0.5)" strokeWidth="2" fill="none" />
          </svg>

          <div className="grid grid-cols-2 gap-10">
            {/* Coloana Proprietar */}
            <div className={`transition-all duration-700 ease-out delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <div className="text-center mb-6 text-[#7dc47d] font-sans text-[13px] tracking-[2px] uppercase font-bold">
                Dacă ai un utilaj
              </div>
              {pasiProprietar.map((p, i) => (
                <div key={p.nr} className={`flex gap-4 relative ${i < pasiProprietar.length - 1 ? "mb-6" : ""}`}>
                  {i < pasiProprietar.length - 1 && (
                    <div className="absolute left-[19px] top-[40px] bottom-[-26px] w-[1px] bg-[#7dc47d]/20" />
                  )}
                  <div className="w-10 h-10 rounded-full shrink-0 bg-[#7dc47d]/10 border border-[#7dc47d]/30 flex items-center justify-center text-[#7dc47d] font-sans text-[13px] font-bold relative z-10">
                    {p.nr}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-[#e8d5a3] text-base m-0 mb-1">{p.title}</h3>
                    <p className="text-[#9db89d] font-sans text-[13px] leading-[1.6] m-0">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coloana Client */}
            <div className={`transition-all duration-700 ease-out delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <div className="text-center mb-6 text-[#4a7c4a] font-sans text-[13px] tracking-[2px] uppercase font-bold">
                Dacă ai nevoie de unul
              </div>
              {pasiClient.map((p, i) => (
                <div key={p.nr} className={`flex gap-4 relative ${i < pasiClient.length - 1 ? "mb-6" : ""}`}>
                  {i < pasiClient.length - 1 && (
                    <div className="absolute left-[19px] top-[40px] bottom-[-26px] w-[1px] bg-[#4a7c4a]/25" />
                  )}
                  <div className="w-10 h-10 rounded-full shrink-0 bg-[#4a7c4a]/15 border border-[#4a7c4a]/40 flex items-center justify-center text-[#9db89d] font-sans text-[13px] font-bold relative z-10">
                    {p.nr}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-[#e8d5a3] text-base m-0 mb-1">{p.title}</h3>
                    <p className="text-[#9db89d] font-sans text-[13px] leading-[1.6] m-0">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <svg width="100%" height="60" viewBox="0 0 780 60" className="block mt-4">
            <path d="M 195 0 C 195 30, 390 15, 390 60" stroke="rgba(125,196,125,0.35)" strokeWidth="2" fill="none" />
            <path d="M 585 0 C 585 30, 390 15, 390 60" stroke="rgba(74,124,74,0.5)" strokeWidth="2" fill="none" />
          </svg>

          <div className="flex justify-center mt-0">
            <div className={`bg-[#1a2e1a] border border-[#e8d5a3]/30 text-[#e8d5a3] rounded-lg px-7 py-3.5 font-sans font-bold text-[14px] transition-all duration-700 ease-out delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              📄 Model de contract generat automat
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STEPS SECTION */}
      <div className="bg-[#f7f5f0] py-16 md:py-20 px-4 md:px-8 md:hidden">
        <div className="max-w-[780px] mx-auto">
          <h2 className="text-center text-[#1a2e1a] text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold mb-8">
            Vezi pas cu pas, pe rolul tău
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-10">
            <button 
              onClick={() => setRolActiv("proprietar")} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-sans font-bold transition-colors w-full sm:w-auto ${
                rolActiv === "proprietar" ? "bg-[#1a2e1a] text-[#e8d5a3] border-none" : "bg-white text-gray-500 border border-gray-300"
              }`}
            >
              🚜 Sunt proprietar
            </button>
            <button 
              onClick={() => setRolActiv("client")} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-sans font-bold transition-colors w-full sm:w-auto ${
                rolActiv === "client" ? "bg-[#1a2e1a] text-[#e8d5a3] border-none" : "bg-white text-gray-500 border border-gray-300"
              }`}
            >
              🌾 Caut un utilaj
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {pasiActivi.map((p, i) => (
              <div key={p.nr} className="bg-white rounded-xl border border-[#e8e0d0] p-5 flex gap-4 items-start shadow-sm">
                <div className="w-9 h-9 rounded-full shrink-0 bg-[#1a2e1a] text-[#e8d5a3] flex items-center justify-center font-sans text-[12px] font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-[#1a2e1a] text-base m-0 mb-1 font-bold">{p.title}</h3>
                  <p className="text-gray-500 font-sans text-[14px] leading-[1.6] m-0">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-[#1a2e1a] py-20 px-4 md:px-8 text-center">
        <h2 className="text-[#e8d5a3] text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold mb-4">
          Gata să pornești?
        </h2>
        <p className="text-[#9db89d] font-sans mb-8 max-w-md mx-auto leading-relaxed">
          Fii printre primii care se conectează și postează sau închiriază un utilaj.
        </p>
        <button 
          onClick={() => navigate("/signup")} 
          className="bg-[#4a7c4a] hover:bg-[#3a6a3a] text-white border-none rounded-xl px-8 py-4 text-[16px] cursor-pointer font-serif font-bold transition-all shadow-[0_4px_20px_rgba(74,124,74,0.4)]"
        >
          🚜 Creează cont gratuit
        </button>
      </div>

      <Footer />
      
    </div>
  );
}