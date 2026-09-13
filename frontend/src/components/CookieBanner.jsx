import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CookieBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setTimeout(() => setVisible(true), 600);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[2000] bg-[#1a2e1a] border-t border-[#e8d5a3]/20 px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-[slideUp_0.4s_ease]">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <p className="text-[#e8e0d0] font-sans text-[13px] leading-relaxed m-0 flex-1 min-w-[320px]">
          🍪 Folosim doar cookie-uri esențiale, necesare pentru autentificare și funcționarea
          platformei — fără tracking sau publicitate.{" "}
          <span
            onClick={() => navigate("/confidentialitate")}
            className="text-[#e8d5a3] underline cursor-pointer"
          >
            Detalii
          </span>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="bg-transparent text-[#9db89d] border border-[#9db89d]/40 rounded-md px-4 py-2 text-[13px] font-sans whitespace-nowrap"
          >
            Refuz
          </button>
          <button
            onClick={handleAccept}
            className="bg-[#4a7c4a] text-white border-none rounded-md px-4 py-2 text-[13px] font-sans font-bold whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}