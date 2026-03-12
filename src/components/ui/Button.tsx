'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'white';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizes = {
  sm: { padding: '10px 20px', fontSize: '14px' },
  md: { padding: '14px 32px', fontSize: '16px' },
  lg: { padding: '18px 40px', fontSize: '18px' },
};

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #2E7D32, #81C784)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(46,125,50,0.4)',
  },
  glass: {
    background: 'transparent',
    color: '#F1F8E9',
    border: '1px solid rgba(46,125,50,0.25)',
    backdropFilter: 'blur(20px)',
    boxShadow: 'none',
  },
  white: {
    background: '#fff',
    color: '#E65100',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
};

export default function Button({ children, variant = 'primary', size = 'md', onClick, href, className = '', style = {} }: ButtonProps) {
  const buttonStyle: React.CSSProperties = {
    ...sizes[size],
    ...variants[variant],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '14px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
    minHeight: '44px',
    minWidth: '44px',
    textDecoration: 'none',
    ...style,
  };

  if (href) {
    return (
      <motion.a href={href} style={buttonStyle} className={className}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >{children}</motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} style={buttonStyle} className={className}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
    >{children}</motion.button>
  );
}
