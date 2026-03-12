"use client";

import { useTranslation } from "@/lib/i18n";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const { t, locale } = useTranslation();

    const phone = "971501234567";
    const message = encodeURIComponent(t("whatsapp.message"));
    const href = `https://wa.me/${phone}?text=${message}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 z-50 flex items-center gap-2 px-5 py-3 rounded-pill bg-[#25D366] text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all group ${locale === "ar" ? "left-6" : "right-6"
                }`}
            style={{ boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)" }}
        >
            <MessageCircle size={20} className="group-hover:animate-pulse" />
            <span className="text-sm hidden sm:inline">WhatsApp</span>
        </a>
    );
}
