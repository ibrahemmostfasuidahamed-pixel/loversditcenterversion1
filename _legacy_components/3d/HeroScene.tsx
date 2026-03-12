"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HelixParticles() {
    const ref = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const count = 500;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 8;
            const radius = 2;
            const strand = i % 2;
            const offset = strand * Math.PI;

            pos[i * 3] = Math.cos(t + offset) * radius + (Math.random() - 0.5) * 0.3;
            pos[i * 3 + 1] = (i / count) * 8 - 4 + (Math.random() - 0.5) * 0.2;
            pos[i * 3 + 2] = Math.sin(t + offset) * radius + (Math.random() - 0.5) * 0.3;

            const ratio = i / count;
            col[i * 3] = 0.91 - ratio * 0.08;
            col[i * 3 + 1] = 0.12 + ratio * 0.56;
            col[i * 3 + 2] = 0.55 - ratio * 0.33;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

function FloatingSphere({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
            ref.current.rotation.x = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <mesh ref={ref} position={position} scale={scale}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.4}
                roughness={0.5}
                metalness={0.5}
            />
        </mesh>
    );
}

function AmbientParticles() {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 200;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#E91E8C"
                transparent
                opacity={0.3}
                sizeAttenuation
            />
        </points>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true, powerPreference: "default" }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} color="#E91E8C" intensity={1} />
                <pointLight position={[-5, -5, 5]} color="#D4AF37" intensity={0.8} />
                <HelixParticles />
                <AmbientParticles />
                <FloatingSphere position={[-3, 2, -2]} color="#E91E8C" scale={1.2} />
                <FloatingSphere position={[3, -1, -3]} color="#D4AF37" scale={0.8} />
                <FloatingSphere position={[0, 3, -4]} color="#FF6EB4" scale={0.6} />
            </Canvas>
        </div>
    );
}
