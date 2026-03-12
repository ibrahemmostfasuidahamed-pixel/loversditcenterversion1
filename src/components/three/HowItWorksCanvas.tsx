'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function EnergyStreams() {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const points = [
        new THREE.Vector3(-12 + i * 2, (Math.random() - 0.5) * 6, 0),
        new THREE.Vector3(-4 + i, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3),
        new THREE.Vector3(4 - i, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3),
        new THREE.Vector3(12 - i * 2, (Math.random() - 0.5) * 6, 0),
      ];
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  const particleData = useMemo(() => {
    const count = 5 * 20;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const green = new THREE.Color('#2E7D32');
    const orange = new THREE.Color('#F4A01C');

    for (let c = 0; c < 5; c++) {
      for (let p = 0; p < 20; p++) {
        const idx = c * 20 + p;
        const color = green.clone().lerp(orange, p / 20);
        col[idx * 3] = color.r;
        col[idx * 3 + 1] = color.g;
        col[idx * 3 + 2] = color.b;
      }
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    const pointsMesh = children[children.length - 1] as THREE.Points;
    if (!pointsMesh?.geometry) return;
    const posAttr = pointsMesh.geometry.getAttribute('position');
    const elapsed = state.clock.elapsedTime;

    for (let c = 0; c < 5; c++) {
      for (let p = 0; p < 20; p++) {
        const idx = c * 20 + p;
        const t = ((elapsed * 0.1 + p / 20 + c * 0.1) % 1);
        const point = curves[c].getPoint(t);
        posAttr.setXYZ(idx, point.x, point.y, point.z);
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => {
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Line = 'line' as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const LineBasicMaterial = 'lineBasicMaterial' as any;
        return (
          <Line key={i} geometry={geometry}>
            <LineBasicMaterial color="#2E7D32" transparent opacity={0.2} />
          </Line>
        );
      })}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.2} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  );
}

export default function HowItWorksCanvas() {
  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <EnergyStreams />
      </Canvas>
    </div>
  );
}
