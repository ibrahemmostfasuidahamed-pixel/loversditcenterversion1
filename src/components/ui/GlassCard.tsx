'use client';

import { motion } from 'framer-motion';
import { useRef, useState, ReactNode } from 'react';
import { cardEnter } from '@/lib/ios-animations';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  tilt?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className = '', index = 0, tilt = true, style }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotateX((y - rect.height / 2) / 20);
    setRotateY((rect.width / 2 - x) / 20);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardEnter}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass ${className}`}
      style={{
        transform: tilt ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
        transition: 'transform 0.1s ease-out',
        padding: '28px',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
