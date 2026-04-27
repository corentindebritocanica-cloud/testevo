import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { useControls } from '../../hooks/useControls';
import * as THREE from 'three';

const carWidth = 1.2;
const carHeight = 0.6;
const carLength = 2.4;
const wheelRadius = 0.35;

export const Car = () => {
  const chassisRef = useRef<THREE.Group>(null!);
  const controls = useControls();

  const [chassis, chassisApi] = useBox(
    () => ({
      args: [carWidth, carHeight, carLength],
      mass: 500,
      position: [0, 1, 0],
    }),
    chassisRef
  );

  const wheelRef1 = useRef<THREE.Group>(null!);
  const wheelRef2 = useRef<THREE.Group>(null!);
  const wheelRef3 = useRef<THREE.Group>(null!);
  const wheelRef4 = useRef<THREE.Group>(null!);

  const wheelInfo = {
    radius: wheelRadius,
    directionLocal: [0, -1, 0] as [number, number, number],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 100000,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0] as [number, number, number],
    chassisConnectionPointLocal: [1, 0, 1] as [number, number, number],
    useCustomSlidingFrictionMultiplier: true,
    slidingFrictionMultiplier: 0.5,
    customSlidingFrictionMultiplier: 0.5,
    frictionSlip: 2,
    rollInfluence: 0.01,
  };

  const wheelInfo1 = { ...wheelInfo, chassisConnectionPointLocal: [-carWidth / 2, 0, carLength / 2] as [number, number, number], isFrontWheel: true };
  const wheelInfo2 = { ...wheelInfo, chassisConnectionPointLocal: [carWidth / 2, 0, carLength / 2] as [number, number, number], isFrontWheel: true };
  const wheelInfo3 = { ...wheelInfo, chassisConnectionPointLocal: [-carWidth / 2, 0, -carLength / 2] as [number, number, number], isFrontWheel: false };
  const wheelInfo4 = { ...wheelInfo, chassisConnectionPointLocal: [carWidth / 2, 0, -carLength / 2] as [number, number, number], isFrontWheel: false };

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: [wheelRef1, wheelRef2, wheelRef3, wheelRef4],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const bodyRef = useRef<THREE.Group>(null!);

  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  
  import('react').then(({ useEffect }) => {
    useEffect(() => {
      const unsubscribe = chassisApi.velocity.subscribe((v) => (velocityRef.current = v));
      return unsubscribe;
    }, [chassisApi.velocity]);
  });

  useFrame((state) => {
    const { forward, backward, left, right, brake, reset } = controls;

    const force = 1200;
    const steer = 0.5;

    if (reset) {
      chassisApi.position.set(0, 5, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }

    vehicleApi.applyEngineForce(forward ? -force : backward ? force : 0, 2);
    vehicleApi.applyEngineForce(forward ? -force : backward ? force : 0, 3);

    vehicleApi.setSteeringValue(left ? steer : right ? -steer : 0, 0);
    vehicleApi.setSteeringValue(left ? steer : right ? -steer : 0, 1);

    vehicleApi.setBrake(brake ? 15 : 0, 2);
    vehicleApi.setBrake(brake ? 15 : 0, 3);

    // Speed calculation
    const speedKmh = Math.round(
      new THREE.Vector3(...velocityRef.current).length() * 3.6
    );
    window.dispatchEvent(new CustomEvent('car-speed', { detail: speedKmh }));

    // Suspension Animation (Body Roll)
    if (bodyRef.current) {
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, (left ? 0.05 : right ? -0.05 : 0), 0.1);
        bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, (forward ? 0.02 : backward ? -0.04 : 0), 0.1);
    }

    // Follow Camera
    const carPos = new THREE.Vector3();
    chassisRef.current.getWorldPosition(carPos);
    
    // Dynamic Camera FOV based on speed
    const perspectiveCamera = state.camera as THREE.PerspectiveCamera;
    perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 50 + speedKmh * 0.1, 0.1);
    perspectiveCamera.updateProjectionMatrix();

    const cameraPos = new THREE.Vector3(0, 2.5, 6.5);
    cameraPos.applyQuaternion(chassisRef.current.quaternion);
    cameraPos.add(carPos);
    
    state.camera.position.lerp(cameraPos, 0.1);
    state.camera.lookAt(carPos);
  });

  return (
    <group ref={vehicle}>
      <group ref={chassisRef}>
        <group ref={bodyRef}>
            {/* Chassis Low */}
            <mesh castShadow>
              <boxGeometry args={[carWidth, carHeight, carLength]} />
              <meshStandardMaterial color="#00ffff" roughness={0.05} metalness={0.9} />
            </mesh>
            {/* Cabin */}
            <mesh position={[0, 0.4, -0.2]} castShadow>
              <boxGeometry args={[carWidth * 0.8, carHeight * 0.8, carLength * 0.4]} />
              <meshStandardMaterial color="#050505" roughness={0} metalness={1} />
            </mesh>
            {/* Spoiler */}
            <mesh position={[0, 0.5, -1.0]} castShadow>
              <boxGeometry args={[carWidth * 1.1, 0.1, 0.4]} />
              <meshStandardMaterial color="#00ffff" />
            </mesh>
            {/* Spoiler Supports */}
            <mesh position={[0.4, 0.3, -1.0]}>
                <boxGeometry args={[0.05, 0.4, 0.1]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.4, 0.3, -1.0]}>
                <boxGeometry args={[0.05, 0.4, 0.1]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            
            {/* Headlights GFX */}
            <mesh position={[0.4, 0, 1.2]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial color="#fff" emissive="#00ffff" emissiveIntensity={5} />
            </mesh>
            <mesh position={[-0.4, 0, 1.2]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial color="#fff" emissive="#00ffff" emissiveIntensity={5} />
            </mesh>
            
            <pointLight position={[0.5, 0, 1.3]} intensity={50} color="#00ffff" distance={15} />
            <pointLight position={[-0.5, 0, 1.3]} intensity={50} color="#00ffff" distance={15} />
        </group>
      </group>

      {/* Wheels */}
      {[wheelRef1, wheelRef2, wheelRef3, wheelRef4].map((ref, i) => (
        <group ref={ref} key={i}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[wheelRadius, wheelRadius, 0.3, 32]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
