import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ count = 2000, color = "#4f46e5", size = 0.05 }) => {
    const particles = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions.set(
        [
          (Math.random() - 0.5) * 10, // x (-5 to 5)
          (Math.random() - 0.5) * 10, // y (-5 to 5)
          (Math.random() - 0.5) * 10  // z (-5 to 5)
        ],
        i * 3
      );
    }
    return positions;
  }, [count]);

  // Animation loop
  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.x += 0.0005;
    particlesRef.current.rotation.y += 0.001;
  });

  return (
    <Points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.8}
        alphaTest={0.01}
      />
    </Points>
  );
};

export default Particles;