'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touch);
    if (touch) return;

    const onMove = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(t.tagName === 'A' || t.tagName === 'BUTTON' || !!t.closest('a') || !!t.closest('button'));
    };
    const onLeave = () => setVisible(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); document.removeEventListener('mouseleave', onLeave); };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ position: 'fixed', top: 0, left: 0, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2E7D32', pointerEvents: 'none', zIndex: 99999, opacity: visible ? (hovering ? 0 : 1) : 0 }}
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.3 }} />
      <motion.div className="cursor-ring" style={{ position: 'fixed', top: 0, left: 0, borderRadius: '50%', border: hovering ? 'none' : '2px solid #2E7D32', backgroundColor: hovering ? 'rgba(46,125,50,0.15)' : 'transparent', pointerEvents: 'none', zIndex: 99998, opacity: visible ? 1 : 0 }}
        animate={{ width: hovering ? 60 : 40, height: hovering ? 60 : 40, x: pos.x - (hovering ? 30 : 20), y: pos.y - (hovering ? 30 : 20) }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.5 }} />
    </>
  );
}
