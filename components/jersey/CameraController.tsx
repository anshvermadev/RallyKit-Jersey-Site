'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraView } from '@/lib/store/useCustomizerStore';

interface CameraControllerProps {
  view: CameraView;
  autoRotate: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

const VIEW_CONFIGS: Record<CameraView, [number, number, number]> = {
  front: [0, 0, 3.2],
  back: [0, 0, -3.2],
  left: [-3.2, 0, 0],
  right: [3.2, 0, 0],
  perspective: [1.8, 1.2, 2.6],
};

export default function CameraController({
  view,
  autoRotate,
  onInteractionStart,
  onInteractionEnd,
}: CameraControllerProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(...VIEW_CONFIGS[view]));
  const isTransitioning = useRef<boolean>(true);

  useEffect(() => {
    const [x, y, z] = VIEW_CONFIGS[view];
    targetPos.current.set(x, y, z);
    isTransitioning.current = true;
  }, [view]);

  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 0.08);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={1.8}
      maxDistance={5.0}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={(3 * Math.PI) / 4}
      autoRotate={autoRotate && !isTransitioning.current}
      autoRotateSpeed={1.8}
      onStart={() => {
        isTransitioning.current = false;
        onInteractionStart?.();
      }}
      onEnd={() => {
        onInteractionEnd?.();
      }}
    />
  );
}
