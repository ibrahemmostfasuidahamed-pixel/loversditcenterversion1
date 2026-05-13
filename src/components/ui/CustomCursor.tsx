'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(true)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 300, damping: 25, mass: 0.5 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 25, mass: 0.5 })

  const dotX = useSpring(cursorX, { stiffness: 600, damping: 35, mass: 0.2 })
  const dotY = useSpring(cursorY, { stiffness: 600, damping: 35, mass: 0.2 })

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
    setIsTouch(touch)
    if (touch) return

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const isClickable = t.tagName === 'A' || t.tagName === 'BUTTON' || !!t.closest('a') || !!t.closest('button') || !!t.closest('input') || !!t.closest('[role="button"]')
      setHovering(isClickable)
    }

    const onLeave = () => {
      cursorX.set(-100)
      cursorY.set(-100)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  if (isTouch) return null

  const blue = '#4A6CF7'
  const ringSize = hovering ? 56 : 40

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      {/* Outer ring */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0, top: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: hovering ? `1.5px solid ${blue}50` : `1.5px solid ${blue}60`,
          background: hovering ? `${blue}15` : 'transparent',
          x: springX,
          y: springY,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s',
        }}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0, top: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: blue,
          boxShadow: `0 0 10px ${blue}80, 0 0 20px ${blue}30`,
          x: dotX,
          y: dotY,
          marginLeft: -4,
          marginTop: -4,
          scale: hovering ? 1.5 : 1,
          transition: 'scale 0.2s',
        }}
      />
    </div>
  )
}
