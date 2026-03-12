"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 100;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                color="#E91E8C"
                size={0.05}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

function FloatingPill({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
    const ref = useRef<THREE.Mesh>(null);
    const speed = useMemo(() => Math.random() * 0.5 + 0.3, []);
    const offset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 0.5;
        ref.current.rotation.x = state.clock.elapsedTime * 0.3;
        ref.current.rotation.z = state.clock.elapsedTime * 0.2;
    });

    return (
        <mesh ref={ref} position={position} scale={scale}>
            <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.6}
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
    );
}

export default function FloatingParticles() {
    return (
        <div className="absolute inset-0 z-0 opacity-30">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} color="#E91E8C" intensity={0.5} />
                <Particles />
                <FloatingPill position={[-3, 2, -2]} color="#E91E8C" scale={0.8} />
                <FloatingPill position={[4, -1, -3]} color="#D4AF37" scale={0.6} />
                <FloatingPill position={[-1, -3, -1]} color="#FF6EB4" scale={0.7} />
                <FloatingPill position={[2, 3, -4]} color="#E8C547" scale={0.5} />
            </Canvas>
        </div>
    );
}
