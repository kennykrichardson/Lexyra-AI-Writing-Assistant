
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import * as THREE from "three";
import { useReducedMotionPreference } from "../hooks/useReducedMotion";

function StarMesh({ count }: { count: number }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      buffer[i * 3] = (Math.random() - 0.5) * 22;
      buffer[i * 3 + 1] = (Math.random() - 0.5) * 13;
      buffer[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    return buffer;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    // Slow, continuous movement without abrupt changes.
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#292722"
        size={0.032}
        transparent
        opacity={0.58}
        blending={THREE.NormalBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleField() {
  const reduced = useReducedMotionPreference();

  return (
    <div className="particle-layer" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 52 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
      >
        <StarMesh count={reduced ? 180 : 900} />

        <Sparkles
          count={reduced ? 20 : 75}
          scale={[13, 8, 6]}
          size={1.5}
          speed={reduced ? 0 : 0.2}
          color="#77736B"
          opacity={0.42}
        />

        <Sparkles
          count={reduced ? 8 : 25}
          scale={[8, 5, 4]}
          size={2}
          speed={reduced ? 0 : 0.1}
          color="#3B3933"
          opacity={0.28}
        />
      </Canvas>
    </div>
  );
}
