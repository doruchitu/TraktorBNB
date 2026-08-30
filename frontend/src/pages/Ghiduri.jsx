import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

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
    <div className="min-h-screen bg-[#0d1a0d] font-serif overflow-x-hidden">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 h-[60px] md:h-[70px] flex items-center justify-between transition-all duration-300 ${
        scrollY > 50 ? "bg-[#0d1a0d]/95 backdrop-blur-md border-b border-[#e8d5a3]/10" : "bg-transparent"
      }`}>
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          <span className="text-[#e8d5a3] text-[18px] md:text-[22px] font-bold tracking-[1px]">
            TraktorShare
          </span>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={() => navigate("/login")} 
            className="bg-transparent text-[#e8d5a3] border border-[#e8d5a3]/40 hover:border-[#e8d5a3] rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-[14px] transition-colors font-serif"
          >
            <span className="hidden sm:inline">Autentificare</span>
            <span className="sm:hidden">Intră</span>
          </button>
          <button 
            onClick={() => navigate("/signup")} 
            className="bg-[#4a7c4a] hover:bg-[#3a6a3a] text-white border-none rounded-md md:rounded-lg px-3 py-1.5 md:px-5 md:py-2 text-[12px] md:text-[14px] transition-colors font-serif"
          >
            <span className="hidden sm:inline">Creează cont</span>
            <span className="sm:hidden">Cont nou</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-[linear-gradient(160deg,#0d1a0d_0%,#1a2e1a_60%,#0d1a0d_100%)] text-center pt-[120px] md:pt-[150px] px-4 md:px-8 pb-12 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full border border-[#e8d5a3]/5 top-[-10%] left-1/2 -translate-x-1/2" />

        <p className={`text-[#7dc47d] text-[12px] md:text-[13px] tracking-[2px] md:tracking-[3px] uppercase mb-4 font-sans font-bold transition-opacity duration-800 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
          Resurse pentru platformă
        </p>
        <h1 className={`text-[#e8d5a3] text-[clamp(2rem,5vw,3.2rem)] font-bold mb-4 leading-[1.15] transition-all duration-800 ease-out delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          Ghiduri pentru <span className="text-[#7dc47d]">fermieri</span>
        </h1>
        <p className={`text-[#9db89d] text-[15px] md:text-[16px] max-w-[540px] mx-auto leading-[1.8] font-sans transition-opacity duration-800 ease-out delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
          Trei ghiduri scurte care te ajută să folosești platforma eficient, indiferent dacă
          publici un utilaj sau cauți unul.
        </p>
      </div>

      {/* GHIDURI SECTION */}
      <div className="bg-[#f7f5f0] py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-[760px] mx-auto flex flex-col gap-8 md:gap-12">
          
          {ghiduri.map((g, gi) => (
            <div 
              key={g.nr} 
              className={`bg-white rounded-2xl border border-[#e8e0d0] p-6 md:p-9 shadow-sm transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{ transitionDelay: `${0.15 * gi + 0.2}s` }}
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl shrink-0 bg-[#1a2e1a] flex items-center justify-center text-[22px]">
                  {g.icon}
                </div>
                <div>
                  <span className="text-[#4a7c4a] font-sans text-[11px] md:text-[12px] font-bold tracking-[1px]">
                    GHID {g.nr}
                  </span>
                  <h2 className="text-[#1a2e1a] text-[20px] md:text-[22px] m-0 mt-0.5 font-bold">
                    {g.title}
                  </h2>
                </div>
              </div>

              <p className="text-gray-500 font-sans text-[14px] md:text-[15px] leading-[1.7] m-0 mb-6">
                {g.intro}
              </p>

              <div className="flex flex-col gap-5">
                {g.puncte.map((p, i) => (
                  <div key={i} className="border-l-[3px] border-[#e8d5a3] pl-4">
                    <h4 className="text-[#1a2e1a] text-[14px] md:text-[14.5px] m-0 mb-1 font-sans font-bold">
                      {p.subtitlu}
                    </h4>
                    <p className="text-gray-600 font-sans text-[13px] md:text-[13.5px] leading-[1.7] m-0">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-[#1a2e1a] py-16 md:py-20 px-4 md:px-8 text-center">
        <h2 className="text-[#e8d5a3] text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold mb-4">
          Ai altă întrebare?
        </h2>
        <p className="text-[#9db89d] font-sans mb-8 max-w-md mx-auto leading-relaxed">
          Scrie-ne direct și îți răspundem cât de repede putem.
        </p>
        <a 
          href="mailto:contact@traktorshare.ro" 
          className="inline-block bg-[#4a7c4a] hover:bg-[#3a6a3a] text-white border-none rounded-xl px-8 py-4 text-[15px] md:text-[16px] font-serif font-bold transition-all shadow-[0_4px_20px_rgba(74,124,74,0.4)] no-underline"
        >
          ✉️ Trimite un email
        </a>
      </div>

      <Footer />
      
    </div>
  );
}