import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function Background3D() {
  const count = 100;
  const positions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const r = 20;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {positions.map((position, i) => (
        <Sphere key={i} position={position as [number, number, number]} args={[0.1]}>
          <meshStandardMaterial color="#4f46e5" />
        </Sphere>
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}

export default Background3D;