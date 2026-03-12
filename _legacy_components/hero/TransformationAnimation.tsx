"use client";

export default function TransformationAnimation({ gender }: { gender: "male" | "female" }) {
    const isMale = gender === "male";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Glow behind silhouette */}
            <div
                className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full blur-[80px] opacity-40"
                style={{
                    background: isMale
                        ? "radial-gradient(circle, #FF2D78, transparent)"
                        : "radial-gradient(circle, #D4AF37, transparent)",
                }}
            />

            {/* Morphing silhouette */}
            <div className="relative">
                {/* Before (overweight) → After (slim) morphing SVG */}
                <svg
                    viewBox="0 0 200 400"
                    className="w-40 h-80 md:w-52 md:h-[400px]"
                    style={{ filter: `drop-shadow(0 0 30px ${isMale ? "#FF2D78" : "#D4AF37"})` }}
                >
                    <defs>
                        <linearGradient id={`grad-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={isMale ? "#FF2D78" : "#D4AF37"} stopOpacity="0.9" />
                            <stop offset="100%" stopColor={isMale ? "#FF6B9D" : "#E8C547"} stopOpacity="0.6" />
                        </linearGradient>
                    </defs>

                    {/* Head */}
                    <circle cx="100" cy="40" r="25" fill={`url(#grad-${gender})`} opacity="0.8" />

                    {/* Body - morphing path */}
                    <path
                        fill={`url(#grad-${gender})`}
                        opacity="0.7"
                    >
                        <animate
                            attributeName="d"
                            dur="6s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                            values={
                                isMale
                                    ? `M65,70 C55,90 40,130 35,170 C30,210 38,250 45,280 C48,295 50,320 55,360 L75,360 L80,290 L100,290 L120,290 L125,360 L145,360 C150,320 152,295 155,280 C162,250 170,210 165,170 C160,130 145,90 135,70 Z;
                     M78,70 C72,85 65,120 62,155 C58,190 62,225 68,255 C72,275 73,310 75,360 L90,360 L92,270 L100,270 L108,270 L110,360 L125,360 C127,310 128,275 132,255 C138,225 142,190 138,155 C135,120 128,85 122,70 Z;
                     M65,70 C55,90 40,130 35,170 C30,210 38,250 45,280 C48,295 50,320 55,360 L75,360 L80,290 L100,290 L120,290 L125,360 L145,360 C150,320 152,295 155,280 C162,250 170,210 165,170 C160,130 145,90 135,70 Z`
                                    : `M68,70 C58,88 45,125 40,160 C35,200 42,240 48,270 C52,290 54,320 58,360 L78,360 L82,285 L100,285 L118,285 L122,360 L142,360 C146,320 148,290 152,270 C158,240 165,200 160,160 C155,125 142,88 132,70 Z;
                     M80,70 C74,84 68,115 65,148 C62,182 65,218 70,248 C74,268 76,310 78,360 L92,360 L94,265 L100,265 L106,265 L108,360 L122,360 C124,310 126,268 130,248 C135,218 138,182 135,148 C132,115 126,84 120,70 Z;
                     M68,70 C58,88 45,125 40,160 C35,200 42,240 48,270 C52,290 54,320 58,360 L78,360 L82,285 L100,285 L118,285 L122,360 L142,360 C146,320 148,290 152,270 C158,240 165,200 160,160 C155,125 142,88 132,70 Z`
                            }
                        />
                    </path>

                    {/* Arms */}
                    <path
                        stroke={isMale ? "#FF2D78" : "#D4AF37"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.5"
                    >
                        <animate
                            attributeName="d"
                            dur="6s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                            values={
                                isMale
                                    ? "M60,90 C40,120 25,150 20,180; M72,88 C58,115 48,140 45,165; M60,90 C40,120 25,150 20,180"
                                    : "M65,88 C48,115 35,145 30,175; M75,86 C62,110 52,135 48,160; M65,88 C48,115 35,145 30,175"
                            }
                        />
                    </path>
                    <path
                        stroke={isMale ? "#FF2D78" : "#D4AF37"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.5"
                    >
                        <animate
                            attributeName="d"
                            dur="6s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                            values={
                                isMale
                                    ? "M140,90 C160,120 175,150 180,180; M128,88 C142,115 152,140 155,165; M140,90 C160,120 175,150 180,180"
                                    : "M135,88 C152,115 165,145 170,175; M125,86 C138,110 148,135 152,160; M135,88 C152,115 165,145 170,175"
                            }
                        />
                    </path>
                </svg>

                {/* Gender indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-text-muted tracking-widest uppercase">
                    {isMale ? "♂" : "♀"}
                </div>
            </div>
        </div>
    );
}
