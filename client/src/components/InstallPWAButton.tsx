import React, { useEffect, useState } from "react";

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowButton(false);
    }
    setDeferredPrompt(null);
  };

  if (!showButton) return null;

  return (
    <button onClick={handleInstallClick} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      padding: "12px 20px", fontSize: "1rem", borderRadius: "8px",
      background: "#1976d2", color: "#fff", border: "none", cursor: "pointer"
    }}>
      Установить как приложение
    </button>
  );
};

export default InstallPWAButton;
