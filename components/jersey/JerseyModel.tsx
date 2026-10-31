'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import { Department } from '@/data/departments';

interface JerseyModelProps {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
  collarColor?: string;
}

// Preload all 5 GLB models for instantaneous department switching
useGLTF.preload('/models/cse.glb');
useGLTF.preload('/models/csbs.glb');
useGLTF.preload('/models/it.glb');
useGLTF.preload('/models/aiml.glb');
useGLTF.preload('/models/extc.glb');

export default function JerseyModel({
  department,
  customName,
  jerseyNumber,
}: JerseyModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the department's dedicated official GLB model
  const { scene } = useGLTF(department.modelUrl || `/models/${department.slug}.glb`);

  // Clone scene so multiple instances don't collide
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Subtle idle cloth sway (respects prefers-reduced-motion)
  useFrame((state) => {
    if (groupRef.current) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReduced) {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      }
    }
  });

  // Pick high-contrast text color for back player name & number
  const textColor =
    department.slug === 'it'
      ? '#E5C158'
      : department.slug === 'aiml'
      ? '#0F1D38'
      : '#FFFFFF';

  const displayName = (customName || 'STUDENT').toUpperCase().slice(0, 12);
  const numStr = String(jerseyNumber).padStart(2, '0');

  // Scale: Original models have height ~0.82m. Scale 2.5x to match 2.1m arena stage fit
  const MODEL_SCALE = 2.5;

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} dispose={null}>
      {/* 1. Official 3D Jersey Model */}
      <primitive object={clonedScene} scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]} />

      {/* 2. Live Custom Back Name & Jersey Number (Anchored to Upper Back) */}
      <group position={[0, 0, -0.32]} rotation={[0, Math.PI, 0]}>
        {/* Custom Player Name */}
        <Text
          position={[0, 0.42, 0]}
          fontSize={0.16}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fontWeight="bold"
          fontStyle="italic"
        >
          {displayName}
        </Text>

        {/* Squad Jersey Number */}
        <Text
          position={[0, -0.06, 0]}
          fontSize={0.52}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          fontWeight="900"
        >
          {numStr}
        </Text>

        {/* Lower Campus Rivals Watermark */}
        <Text
          position={[0, -0.52, 0]}
          fontSize={0.075}
          color={department.slug === 'aiml' ? 'rgba(15,29,56,0.5)' : 'rgba(255,255,255,0.4)'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
          fontWeight="700"
        >
          CAMPUS RIVALS 2026
        </Text>
      </group>
    </group>
  );
}
