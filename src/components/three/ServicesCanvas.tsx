'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { positions, colors, speeds, ringIndices } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const rings = new Float32Array(count);
    const green = new THREE.Color('#2E7D32');
    const orange = new THREE.Color('#F4A01C');

    for (let i = 0; i < count; i++) {
      const ring = Math.floor(i / 60);
      const radius = (ring + 1) * 2.5;
      const angle = (i / 60) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      const c = green.clone().lerp(orange, ring / 5);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      spd[i] = 0.001 + ring * 0.0015;
      rings[i] = ring;
    }
    return { positions: pos, colors: col, speeds: spd, ringIndices: rings };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.getAttribute('position');
    const elapsed = state.clock.elapsedTime;

    for (let i = 0; i < 300; i++) {
      const ring = ringIndices[i];
      const radius = (ring + 1) * 2.5;
      const speed = speeds[i];
      const angle = elapsed * speed * 10 + (i / 60) * Math.PI * 2;
      posAttr.setX(i, Math.cos(angle) * radius);
      posAttr.setZ(i, Math.sin(angle) * radius);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function ServicesCanvas() {
  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <Particles />
      </Canvas>
    </div>
  );
}
