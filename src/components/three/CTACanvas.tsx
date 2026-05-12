'use client'

export default function CTACanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            borderRadius: '50%',
            border: `1.5px solid rgba(46,125,50,${0.15 - i * 0.015})`,
            transform: 'translate(-50%, -50%)',
            animation: `cta-pulse-${i} ${3 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            borderRadius: '50%',
            background: i % 3 === 0 ? '#4ade80' : i % 3 === 1 ? '#81C784' : '#F4A01C',
            opacity: Math.random() * 0.6 + 0.1,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `cta-sparkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            animationDelay: Math.random() * 3 + 's',
          }}
        />
      ))}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        animation: 'cta-glow 3s ease-in-out infinite alternate',
      }} />
      <style>{`
        ${Array.from({ length: 8 }).map((_, i) => `
          @keyframes cta-pulse-${i} {
            from { transform: translate(-50%, -50%) scale(0.9); opacity: 0.3; }
            to   { transform: translate(-50%, -50%) scale(1.15); opacity: 0.6; }
          }
        `).join('\n')}
        @keyframes cta-sparkle {
          from { transform: translateY(0) scale(0.5); opacity: 0.1; }
          to   { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
        }
        @keyframes cta-glow {
          from { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          to   { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
