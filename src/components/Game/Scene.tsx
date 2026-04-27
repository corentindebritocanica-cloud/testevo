import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Bloom, EffectComposer, ChromaticAberration } from '@react-three/postprocessing';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { Car } from './Car';
import { Track } from './Track';
import { Vector2 } from 'three';

export const Scene = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
      <color attach="background" args={['#000']} />
      
      <ambientLight intensity={0.2} />
      <spotLight
        position={[10, 10, 10]}
        angle={1}
        penumbra={0.5}
        intensity={100}
        castShadow
        shadow-bias={-0.0001}
      />
      
      <Physics gravity={[0, -9.81, 0]} tolerance={0.001}>
        <Car />
        <Track />
      </Physics>

      <Environment preset="night" />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={1.5} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <ChromaticAberration 
          offset={new Vector2(0.002, 0.002)} 
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  );
};
