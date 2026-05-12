'use client'

export default function HowItWorksCanvas() {
  const streams = [0, 1, 2, 3, 4]
  const dirs = ['normal', 'reverse', 'normal', 'reverse', 'normal']

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {streams.map((s) => {
        const dots = Array.from({ length: 15 }).map((_, d) => {
          const progress = d / 15
          const x = -40 + progress * 80 + (Math.random() - 0.5) * 3
          const y = (Math.random() - 0.5) * 60
          return { x, y, delay: d * 0.15 }
        })
        return (
          <div key={s} style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`,
          }}>
            {dots.map((dot, d) => (
              <div key={d} style={{
                position: 'absolute',
                left: `calc(50% + ${dot.x}%)`,
                top: `calc(50% + ${dot.y}%)`,
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: d / dots.length < 0.5 ? '#2E7D32' : '#F4A01C',
                opacity: 0.3 + (d / dots.length) * 0.5,
                animation: `flow-${s} ${4 + s * 0.5}s ease-in-out ${dot.delay}s infinite alternate`,
              }} />
            ))}
          </div>
        )
      })}
      {streams.map((s) => (
        <div key={`line-${s}`} style={{
          position: 'absolute',
          left: `${15 + s * 17}%`,
          top: '10%',
          width: '2px',
          height: '80%',
          background: `linear-gradient(to bottom, rgba(46,125,50,0.08), rgba(244,160,28,0.15), rgba(46,125,50,0.08))`,
          borderRadius: '50%',
          animation: `line-pulse ${5 + s * 0.8}s ease-in-out infinite alternate`,
          animationDirection: dirs[s] as 'normal' | 'reverse',
        }} />
      ))}
      <style>{`
        ${streams.map((s) => `
          @keyframes flow-${s} {
            0%   { transform: translateY(-30px) scale(0.5); opacity: 0; }
            20%  { opacity: ${0.4 + s * 0.1}; }
            80%  { opacity: ${0.4 + s * 0.1}; }
            100% { transform: translateY(30px) scale(1); opacity: 0; }
          }
        `).join('\n')}
        @keyframes line-pulse {
          from { opacity: 0.3; transform: scaleY(0.8); }
          to   { opacity: 0.8; transform: scaleY(1.1); }
        }
      `}</style>
    </div>
  )
}
