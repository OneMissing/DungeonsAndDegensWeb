"use client";

import { skillRoll } from "@/lib/rolling/skillRoll";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useState, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20;

const DICE_GEOMETRIES: Record<DiceType, () => THREE.BufferGeometry> = {
  4: () => new THREE.TetrahedronGeometry(1),
  6: () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
  8: () => new THREE.OctahedronGeometry(1),
  10: () => new THREE.DodecahedronGeometry(1),
  12: () => new THREE.DodecahedronGeometry(1.2),
  20: () => new THREE.IcosahedronGeometry(1),
};

// Texture paths (make sure you have these textures in your public folder)
const DICE_TEXTURES: Record<DiceType, string> = {
  4: "/textures/side.jpg",
  6: "/textures/side.jpg",
  8: "/textures/side.jpg",
  10: "/textures/side.jpg",
  12: "/textures/side.jpg",
  20: "/textures/side.jpg",
};

// Predefined stopping positions to center a face
const FINAL_ROTATIONS: Record<DiceType, [number, number, number][]> = {
  4: [[Math.PI / 4, 0, Math.PI / 4]],
  6: [
    [0, 0, 0],
    [Math.PI, 0, 0],
    [Math.PI / 2, 0, 0],
    [-Math.PI / 2, 0, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
  ],
  8: [
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI / 2],
  ],
  10: [
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI / 2],
  ],
  12: [
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI / 2],
  ],
  20: [
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI / 2],
  ],
};

const RollingDice = ({ sides }: { sides: DiceType }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [rolling, setRolling] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [targetRotation, setTargetRotation] = useState<[number, number, number]>([0, 0, 0]);
  const texture = useLoader(TextureLoader, DICE_TEXTURES[sides]);

  useEffect(() => {
    const rollDice = () => {
      if (rolling) return;

      setRolling(true);
      setRotationSpeed(10);

      const randomRotation = FINAL_ROTATIONS[sides][Math.floor(Math.random() * FINAL_ROTATIONS[sides].length)];
      setTargetRotation(randomRotation);

      setTimeout(() => {
        setRolling(false);
        setRotationSpeed(0);
      }, 2000);
    };

    rollDice();
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    if (rolling) {
      setRotationSpeed((speed) => Math.max(speed * 0.95, 0.05));
      ref.current.rotation.x += rotationSpeed * 0.1;
      ref.current.rotation.y += rotationSpeed * 0.1;
      ref.current.rotation.z += rotationSpeed * 0.1;
    } else {
      ref.current.rotation.set(...targetRotation);
    }
  });

  return (
    <mesh ref={ref} geometry={DICE_GEOMETRIES[sides]()} castShadow receiveShadow>
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.3} />

      {/* Black edges */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[DICE_GEOMETRIES[sides]()]} />
        <lineBasicMaterial attach="material" color="black" linewidth={2} />
      </lineSegments>
    </mesh>
  );
};

const DiceRoller = ({ sides, rolled }: { sides: DiceType; rolled: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldFly, setShouldFly] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), 2000);
    const flyTimer = setTimeout(() => {
      setShouldFly(true);
      setIsVisible(false)
    }, 3500);
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(flyTimer);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 flex items-center justify-center z-50 text-4xl ${isVisible ? "opacity-100" : "opacity-0"} transition-all duration-1000 ease-in-out ${shouldFly ? "animate-flyUp" : ""}`}>
        <div>{rolled}</div>
      </div>
      <div className="flex items-center justify-center h-[200px] w-[200px]">
        <Canvas shadows camera={{ position: [0, 3, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} castShadow />
          <Suspense fallback={null}>
            <RollingDice sides={sides} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default DiceRoller;
