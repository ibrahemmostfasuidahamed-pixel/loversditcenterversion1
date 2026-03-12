'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(3000 * 3);
    const col = new Float32Array(3000 * 3);
    const green = new THREE.Color('#2E7D32');
    const orange = new THREE.Color('#F4A01C');

    for (let i = 0; i < 3000; i++) {
      const t = (i / 3000) * Math.PI * 8;
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 4;
      const x = Math.cos(t) * radius * strand + (Math.random() - 0.5) * 0.5;
      const y = (i / 3000) * 40 - 20 + (Math.random() - 0.5) * 0.3;
      const z = Math.sin(t) * radius * strand + (Math.random() - 0.5) * 0.5;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const mixFactor = i / 3000;
      const color = green.clone().lerp(orange, mixFactor);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const ambientPositions = useMemo(() => {
    const pos = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = mouseRef.current.y * 0.1;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation />
        </points>
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#81C784" transparent opacity={0.3} sizeAttenuation />
      </points>
    </>
  );
}

function Scene() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 30);
  }, [camera]);
  return <DNAHelix />;
}

export default function HeroCanvas() {
  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <Scene />
      </Canvas>
    </div>
  );
}
