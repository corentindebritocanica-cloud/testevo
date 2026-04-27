import { usePlane } from '@react-three/cannon';
import { MeshReflectorMaterial, Stars, Detailed } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: string }) => (
  <mesh position={position}>
    <boxGeometry args={args} />
    <meshStandardMaterial 
      color="#111" 
      emissive={color} 
      emissiveIntensity={0.2} 
    />
    {/* Window Lights */}
    <gridHelper args={[args[0], 20, color, color]} position={[0, 0, args[2]/2 + 0.05]} rotation={[Math.PI/2, 0, 0]} />
  </mesh>
);

export const Track = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
  }));

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ground / Road */}
      <mesh ref={ref as any} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <MeshReflectorMaterial
          mirror={0.4}
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={10}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#080808"
          metalness={0.9}
          roughness={1}
        />
      </mesh>

      {/* Track Markers & Neon Barriers */}
      <group>
        {Array.from({ length: 40 }).map((_, i) => (
          <group key={i} position={[0, 0, i * -30]}>
            <mesh position={[12, 0.5, 0]}>
              <boxGeometry args={[0.2, 1, 15]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={4} />
            </mesh>
            <mesh position={[-12, 0.5, 0]}>
              <boxGeometry args={[0.2, 1, 15]} />
              <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={4} />
            </mesh>
            
            {/* Street Lights */}
            <mesh position={[15, 8, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 16]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <pointLight position={[15, 10, 0]} intensity={100} color="#ffaa00" distance={20} />
          </group>
        ))}
      </group>

      {/* Skyboxes / City Buildings */}
      <group>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 400;
          const z = (Math.random() - 0.5) * 1000;
          if (Math.abs(x) < 30) return null; // Keep track clear
          const h = 10 + Math.random() * 50;
          const colors = ['#00ffff', '#ff0055', '#5500ff', '#ffffff'];
          return (
            <Building 
              key={i} 
              position={[x, h/2, z]} 
              args={[10 + Math.random() * 10, h, 10 + Math.random() * 10]} 
              color={colors[Math.floor(Math.random() * colors.length)]}
            />
          );
        })}
      </group>

      {/* Grid Pattern */}
      <gridHelper args={[2000, 200, '#111', '#050505']} position={[0, -0.05, 0]} />
    </>
  );
};
