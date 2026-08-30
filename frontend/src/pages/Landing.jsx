import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import InstallButton from "../components/InstallButton";

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
    { icon: <img src="/FAVICON.png" alt="Tractor" className="w-9 h-9 object-contain" />, title: "Închiriază utilaje", desc: "Găsește tractoare, combine și echipamente agricole disponibile în județul tău." },
    { icon: "📅", title: "Calendar inteligent", desc: "Vezi disponibilitatea în timp real și rezervă cu câteva clickuri." },
    { icon: "✅", title: "Aprobare rapidă", desc: "Proprietarul aprobă cererea, primești confirmarea instant." },
    { icon: "📄", title: "Model de contract automat", desc: "La aprobare se generează automat un model de contract PDF între cele două părți." },
    { icon: "🔒", title: "Securizat", desc: "Autentificare prin Firebase, date protejate, tranzacții sigure." },
    { icon: "🌾", title: "100% românesc", desc: "Construit pentru fermierii români, cu focus pe simplicitate și eficiență." },
  ];

  return (
    <div className="min-h-screen bg-[#0d1a0d] font-serif overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 h-[60px] md:h-[70px] flex items-center justify-between transition-all duration-300 ${
        scrollY > 50 ? "bg-[#0d1a0d]/95 backdrop-blur-md border-b border-[#e8d5a3]/10" : "bg-transparent"
      }`}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-5 h-5 md:w-7 md:h-7 bg-[#e8d5a3] opacity-90 [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"></div>
          <span className="text-[#e8d5a3] text-[18px] md:text-[22px] font-bold tracking-[1px] font-serif">
            TraktorShare
          </span>
        </div>
        
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={() => navigate("/login")} 
            className="bg-transparent text-[#e8d5a3] border border-[#e8d5a3]/40 rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-sm cursor-pointer transition-colors hover:border-[#e8d5a3]"
          >
            <span className="hidden sm:inline">Autentificare</span>
            <span className="sm:hidden">Conectare</span>
          </button>
          
          <button 
            onClick={() => navigate("/signup")} 
            className="bg-[#4a7c4a] text-white border-none rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-sm cursor-pointer transition-colors hover:bg-[#3a6a3a]"
          >
            <span className="hidden sm:inline">Creează cont</span>
            <span className="sm:hidden">Cont nou</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen bg-[linear-gradient(160deg,#0d1a0d_0%,#1a2e1a_40%,#0d1a0d_100%)] flex flex-col items-center justify-center text-center p-8 pt-24 md:pt-8 relative overflow-hidden">
        
        {/* Cercuri decorative */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#e8d5a3]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[900px] h-[900px] rounded-full border border-[#e8d5a3]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Badge superior */}
        <div className={`inline-flex items-center gap-2 bg-[#4a7c4a]/20 border border-[#4a7c4a]/40 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="text-xs">🌾</span>
          <span className="text-[#7dc47d] text-[13px] font-sans tracking-[1px]">
            Platforma #1 de închirieri agricole din România
          </span>
        </div>

        {/* Titlu Principal */}
        <h1 className={`text-[#e8d5a3] text-[clamp(2.5rem,7vw,5rem)] leading-[1.1] mb-6 font-bold transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Utilajul potrivit,<br />
          <span className="text-[#7dc47d] [text-shadow:0_0_40px_rgba(125,196,125,0.3)]">
            la tine în județ.
          </span>
        </h1>

        {/* Descriere */}
        <p className={`text-[#9db89d] text-[clamp(1rem,2vw,1.2rem)] max-w-[560px] leading-[1.8] mb-12 font-sans transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Conectăm fermierii români. Închiriezi un tractor când ai nevoie
          sau îți pui utilajul la muncă când nu îl folosești.
        </p>

        {/* Butoane Hero */}
        <div className={`flex gap-4 flex-wrap justify-center transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button 
            onClick={() => navigate("/signup")} 
            className="flex items-center gap-2.5 bg-[#4a7c4a] text-white rounded-xl px-8 py-4 text-base font-bold transition-all hover:bg-[#3a6a3a] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(74,124,74,0.4)]"
          >
            {/* Iconița transformată în BEJ pentru Buton */}
            <div className="w-5 h-5 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"></div>
            Începe gratuit
          </button>
          <button 
            onClick={() => navigate("/login")} 
            className="bg-transparent text-[#e8d5a3] border border-[#e8d5a3]/30 rounded-xl px-8 py-4 text-base transition-all hover:border-[#e8d5a3] hover:-translate-y-0.5"
          >
            Intră în cont →
          </button>
        </div>

        {/* Partea de Instalare (PWA) */}
        <div className={`mt-20 transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[#e8d5a3] text-[clamp(1rem,2.2vw,1.3rem)] font-bold text-center">
            🚀 Fii printre primii care se conectează și postează sau închiriază un utilaj
          </p>
          <div className="flex justify-center mt-6">
            <InstallButton />
          </div>
        </div>

      </div>

      <div className="bg-[#f7f5f0] py-24 px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-[#1a2e1a] text-[clamp(1.8rem,4vw,2.5rem)] mb-4 font-bold">
            Tot ce ai nevoie, într-o singură platformă
          </h2>
          <p className="text-center text-[#888] font-sans text-base max-w-[500px] mx-auto mb-16">
            De la căutare până la model de contract, totul e simplu și rapid.
          </p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 border border-[#e8e0d0] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-[#1a2e1a] text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-[#888] font-sans text-sm leading-relaxed m-0">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1a2e1a] py-24 px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-[#e8d5a3] text-[clamp(1.8rem,4vw,2.5rem)] mb-16 font-bold">
            Cum funcționează?
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
            {[
              { nr: "01", title: "Creează cont", desc: "Înregistrare rapidă cu email și parolă." },
              { nr: "02", title: "Caută utilaje", desc: "Filtrează după județ, tip, preț." },
              { nr: "03", title: "Rezervă", desc: "Selectează zilele disponibile din calendar." },
              { nr: "04", title: "Primești contractul", desc: "La aprobare, contractul PDF se generează automat." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[#e8d5a3]/10 border border-[#e8d5a3]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#e8d5a3] text-base font-bold font-sans">{s.nr}</span>
                </div>
                <h3 className="text-[#e8d5a3] text-base font-bold mb-2">{s.title}</h3>
                <p className="text-[#9db89d] font-sans text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-[#f7f5f0] py-24 px-8 text-center">
        <h2 className="text-[#1a2e1a] text-[clamp(1.8rem,4vw,2.5rem)] mb-4 font-bold">
          Gata să începi?
        </h2>
        <p className="text-[#888] font-sans mb-8">
          Gratuit. Fără comisioane ascunse. Doar fermieri și utilaje.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            onClick={() => navigate("/signup")} 
            className="flex items-center gap-2.5 bg-[#1a2e1a] text-[#e8d5a3] rounded-xl px-8 py-4 text-base font-bold transition-colors hover:bg-[#2d4a2d]"
          >
            <div className="w-5 h-5 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"></div>
            Creează cont gratuit
          </button>
          <button 
            onClick={() => navigate("/login")} 
            className="bg-white text-[#1a2e1a] border border-[#1a2e1a] rounded-xl px-8 py-4 text-base transition-colors hover:bg-[#f0f7f0]"
          >
            Am deja cont
          </button>
        </div>
      </div>

      <Footer />
      
    </div>
  );
}