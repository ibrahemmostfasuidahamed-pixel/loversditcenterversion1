'use client'

export default function ServicesCanvas() {
  const rings = [0, 1, 2, 3, 4]
  const ringColors = ['#2E7D32', '#388E3C', '#4ADE80', '#F4A01C', '#81C784']
  const dotCounts = [8, 12, 16, 20, 24]

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.5,
      }}>
        {rings.map((ring, idx) => (
          <div key={idx} style={{
            position: 'absolute',
            width: `${(idx + 1) * 80}px`,
            height: `${(idx + 1) * 80}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `services-rotate ${6 + idx * 2}s linear infinite`,
            animationDirection: idx % 2 === 0 ? 'normal' : 'reverse',
          }}>
            {Array.from({ length: dotCounts[idx] }).map((_, d) => {
              const angle = (d / dotCounts[idx]) * 360
              return (
                <div key={d} style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: ringColors[idx % ringColors.length],
                  left: '50%',
                  top: '0',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: `0 ${(idx + 1) * 40}px`,
                  opacity: 0.4 + Math.random() * 0.4,
                }} />
              )
            })}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes services-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
