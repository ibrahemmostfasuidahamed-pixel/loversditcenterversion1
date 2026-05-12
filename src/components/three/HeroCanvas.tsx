'use client'

export default function HeroCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            borderRadius: '50%',
            background: '#4ade80',
            opacity: Math.random() * 0.5 + 0.1,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `hero-float ${Math.random() * 6 + 4}s ease-in-out infinite alternate`,
            animationDelay: Math.random() * 4 + 's',
          }}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`amb-${i}`}
          style={{
            position: 'absolute',
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            borderRadius: '50%',
            background: '#81C784',
            opacity: Math.random() * 0.3 + 0.05,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `hero-drift ${Math.random() * 10 + 8}s linear infinite`,
            animationDelay: Math.random() * 6 + 's',
          }}
        />
      ))}
      <style>{`
        @keyframes hero-float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-30px); }
        }
        @keyframes hero-drift {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(10px, -15px); }
          50%  { transform: translate(-5px, -25px); }
          75%  { transform: translate(-15px, -10px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  )
}
