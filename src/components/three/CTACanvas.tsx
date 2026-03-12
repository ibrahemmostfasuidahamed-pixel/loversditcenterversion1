'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SpiralParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const green = new THREE.Color('#2E7D32');
    const light = new THREE.Color('#81C784');

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 10;
      const radius = (i / count) * 10;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      const c = green.clone().lerp(light, Math.random());
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const elapsed = state.clock.elapsedTime;

    for (let i = 0; i < 500; i++) {
      const angle = (i / 500) * Math.PI * 10 + elapsed * 0.2;
      const baseRadius = (i / 500) * 10;
      const pullBack = Math.sin(elapsed * 0.5) * 0.3;
      const radius = baseRadius * (1 - pullBack * 0.1);
      posAttr.setX(i, Math.cos(angle) * radius);
      posAttr.setZ(i, Math.sin(angle) * radius);
      posAttr.setY(i, posAttr.getY(i) + Math.sin(elapsed + i) * 0.002);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function CTACanvas() {
  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <SpiralParticles />
      </Canvas>
    </div>
  );
}
