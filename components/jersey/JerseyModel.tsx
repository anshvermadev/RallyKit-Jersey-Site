'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Department } from '@/data/departments';

interface JerseyModelProps {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
  collarColor?: string;
}

export default function JerseyModel({
  department,
  customName,
  jerseyNumber,
  sleeveColor,
  collarColor,
}: JerseyModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const primaryCol = department.primaryColor;
  const secondaryCol = sleeveColor || department.secondaryColor;
  const accentCol = collarColor || department.collarColors[0] || '#FFE600';

  // Floating idle subtle sway
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  // Torso Geometry Shape
  const torsoShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Front silhouette of athletic jersey
    const widthBottom = 1.1;
    const widthWaist = 1.05;
    const widthChest = 1.35;
    const height = 2.2;

    shape.moveTo(-widthBottom / 2, -height / 2);
    shape.lineTo(widthBottom / 2, -height / 2);
    shape.quadraticCurveTo(widthWaist / 2, 0, widthChest / 2, height / 2 - 0.2);
    shape.lineTo(0.5, height / 2);
    // Neck curve
    shape.quadraticCurveTo(0, height / 2 - 0.35, -0.5, height / 2);
    shape.lineTo(-widthChest / 2, height / 2 - 0.2);
    shape.quadraticCurveTo(-widthWaist / 2, 0, -widthBottom / 2, -height / 2);

    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }),
    []
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]} dispose={null}>
      {/* MAIN BODY / TORSO */}
      <mesh position={[0, 0, -0.275]} castShadow receiveShadow>
        <extrudeGeometry args={[torsoShape, extrudeSettings]} />
        <meshStandardMaterial
          color={primaryCol}
          roughness={0.45}
          metalness={0.15}
          bumpScale={0.05}
        />
      </mesh>

      {/* FRONT SIDE SPORT STRIPES (Dynamic department graphics) */}
      <mesh position={[-0.48, 0, 0.28]} castShadow>
        <boxGeometry args={[0.08, 1.6, 0.02]} />
        <meshStandardMaterial color={secondaryCol} roughness={0.3} />
      </mesh>
      <mesh position={[0.48, 0, 0.28]} castShadow>
        <boxGeometry args={[0.08, 1.6, 0.02]} />
        <meshStandardMaterial color={secondaryCol} roughness={0.3} />
      </mesh>

      {/* FRONT CHEST CREST / EMBLEM */}
      <group position={[-0.32, 0.52, 0.29]}>
        {/* Badge background plate */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.26, 0.26, 0.02]} />
          <meshStandardMaterial color="#0B0B12" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Badge border */}
        <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.01]}>
          <boxGeometry args={[0.22, 0.22, 0.02]} />
          <meshStandardMaterial color={accentCol} />
        </mesh>
        {/* Text */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.09}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {department.shortName}
        </Text>
      </group>

      {/* FRONT CENTER SPONSOR / BATCH TEXT */}
      <group position={[0, 0.1, 0.29]}>
        <Text
          position={[0, 0.08, 0]}
          fontSize={0.16}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight="900"
        >
          {department.shortName}
        </Text>
        <Text
          position={[0, -0.08, 0]}
          fontSize={0.08}
          color={accentCol}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          fontWeight="700"
        >
          {department.batch}
        </Text>
      </group>

      {/* COLLAR (V-Neck / Ribbed Hem) */}
      <group position={[0, 0.98, 0]}>
        <mesh position={[0, -0.05, 0.05]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.32, 0.06, 12, 32, Math.PI]} />
          <meshStandardMaterial color={accentCol} roughness={0.5} />
        </mesh>
        {/* Rear neck rib */}
        <mesh position={[0, 0.02, -0.08]} rotation={[-0.2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 12, 32, Math.PI]} />
          <meshStandardMaterial color={accentCol} roughness={0.5} />
        </mesh>
      </group>

      {/* LEFT SLEEVE */}
      <group position={[-0.85, 0.65, 0]} rotation={[0, 0, 0.45]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.31, 0.75, 24]} />
          <meshStandardMaterial color={secondaryCol} roughness={0.4} />
        </mesh>
        {/* Left Sleeve Cuff Band */}
        <mesh position={[0, -0.36, 0]}>
          <cylinderGeometry args={[0.315, 0.315, 0.08, 24]} />
          <meshStandardMaterial color={accentCol} roughness={0.3} />
        </mesh>
      </group>

      {/* RIGHT SLEEVE */}
      <group position={[0.85, 0.65, 0]} rotation={[0, 0, -0.45]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.31, 0.75, 24]} />
          <meshStandardMaterial color={secondaryCol} roughness={0.4} />
        </mesh>
        {/* Right Sleeve Cuff Band */}
        <mesh position={[0, -0.36, 0]}>
          <cylinderGeometry args={[0.315, 0.315, 0.08, 24]} />
          <meshStandardMaterial color={accentCol} roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* BACK OF JERSEY: CUSTOM NAME AND NUMBER */}
      {/* ============================================================== */}
      <group position={[0, 0, -0.29]} rotation={[0, Math.PI, 0]}>
        {/* Back upper accent stripe */}
        <mesh position={[0, 0.78, 0.01]}>
          <boxGeometry args={[0.8, 0.06, 0.02]} />
          <meshStandardMaterial color={accentCol} />
        </mesh>

        {/* CUSTOM PLAYER NAME */}
        <Text
          position={[0, 0.58, 0.02]}
          fontSize={0.17}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fontWeight="900"
          fontStyle="italic"
        >
          {customName || 'STUDENT'}
        </Text>

        {/* JERSEY NUMBER (Bold large esports numerals) */}
        <Text
          position={[0, 0.02, 0.02]}
          fontSize={0.58}
          color={accentCol}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          fontWeight="900"
        >
          {String(jerseyNumber).padStart(2, '0')}
        </Text>

        {/* LOWER CAMPUS BRANDING */}
        <Text
          position={[0, -0.55, 0.02]}
          fontSize={0.075}
          color="#A1A1AA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          fontWeight="700"
        >
          CAMPUS RIVALS 2026
        </Text>
      </group>

      {/* BOTTOM WAIST HEM BAND */}
      <mesh position={[0, -1.08, 0]}>
        <boxGeometry args={[1.14, 0.08, 0.56]} />
        <meshStandardMaterial color={accentCol} roughness={0.6} />
      </mesh>
    </group>
  );
}
