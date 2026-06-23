"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    whatsappNumber: "",
    facebookPage: "",
    messengerLink: "",
    phone: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const hasAnyContact =
    settings.whatsappNumber ||
    settings.facebookPage ||
    settings.messengerLink ||
    settings.phone;

  if (!hasAnyContact) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: 9990,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
      className="md:bottom-6"
    >
      {/* Contact options */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          {/* WhatsApp */}
          {settings.whatsappNumber && (
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi! I'm interested in your products.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#25D366",
                color: "white",
                padding: "10px 16px",
                borderRadius: "100px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                whiteSpace: "nowrap",
                animation: "slideIn 0.2s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}

          {/* Facebook */}
          {settings.facebookPage && (
            <a
              href={settings.facebookPage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#1877F2",
                color: "white",
                padding: "10px 16px",
                borderRadius: "100px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(24,119,242,0.4)",
                whiteSpace: "nowrap",
                animation: "slideIn 0.25s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
          )}

          {/* Messenger */}
          {settings.messengerLink && (
            <a
              href={settings.messengerLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "linear-gradient(135deg, #0084FF 0%, #A033FF 100%)",
                color: "white",
                padding: "10px 16px",
                borderRadius: "100px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(0,132,255,0.4)",
                whiteSpace: "nowrap",
                animation: "slideIn 0.3s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z" />
              </svg>
              Messenger
            </a>
          )}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: open ? "#2C1A10" : "#6B1A28",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(107,26,40,0.5)",
          transition: "all 0.2s ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
      >
        {open ? (
          <X size={24} color="white" />
        ) : (
          <MessageCircle size={24} color="white" />
        )}
      </button>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
