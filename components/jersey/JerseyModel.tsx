'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Department } from '@/data/departments';

interface JerseyModelProps {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
  collarColor?: string;
}

// Procedural micro-knit athletic fabric bump texture
function createFabricBumpTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#949494';
  for (let y = 0; y < 128; y += 4) {
    for (let x = 0; x < 128; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

/**
 * Creates the athletic sports jersey silhouette 2D contour shape
 * matching standard collegiate jersey proportions (shoulders, sleeves, V-neck, waist, hem)
 */
function createJerseySilhouetteShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Bottom Center Hem
  shape.moveTo(0, -1.16);

  // Bottom Right Hem curve
  shape.quadraticCurveTo(0.35, -1.17, 0.64, -1.12);

  // Right Waist & Hip (gentle athletic taper)
  shape.quadraticCurveTo(0.58, -0.4, 0.56, 0.05);

  // Right Underarm / Armpit
  shape.quadraticCurveTo(0.58, 0.28, 0.65, 0.36);

  // Right Sleeve Underarm slanting downward
  shape.lineTo(1.18, 0.12);

  // Right Sleeve Cuff edge
  shape.lineTo(1.22, 0.44);

  // Right Shoulder line slanting up to neck collar
  shape.lineTo(0.40, 0.94);

  // Right Collar top point
  shape.lineTo(0.24, 0.96);

  // V-Neck collar cutout (scooped down to center)
  shape.quadraticCurveTo(0.12, 0.72, 0, 0.72);

  // Left V-Neck collar cutout rising to left collar top point
  shape.quadraticCurveTo(-0.12, 0.72, -0.24, 0.96);

  // Left Shoulder line slanting down to left sleeve
  shape.lineTo(-0.40, 0.94);

  // Left Sleeve Cuff edge
  shape.lineTo(-1.22, 0.44);

  // Left Sleeve Underarm slanting downward
  shape.lineTo(-1.18, 0.12);

  // Left Sleeve Underarm to armpit
  shape.lineTo(-0.65, 0.36);

  // Left Waist & Hip
  shape.quadraticCurveTo(-0.58, 0.28, -0.56, 0.05);
  shape.quadraticCurveTo(-0.58, -0.4, -0.64, -1.12);

  // Bottom Left Hem back to center
  shape.quadraticCurveTo(-0.35, -1.17, 0, -1.16);

  shape.closePath();
  return shape;
}

export default function JerseyModel({
  department,
  customName,
  jerseyNumber,
}: JerseyModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);

  const fabricBump = useMemo(() => createFabricBumpTexture(), []);

  // 1. Build the Unified Extruded Sports Jersey Geometry
  const jerseyGeometry = useMemo(() => {
    const shape = createJerseySilhouetteShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const spanX = bb.max.x - bb.min.x;
    const spanY = bb.max.y - bb.min.y;

    // Center geometry around Z=0
    geo.center();

    // Recompute bounding box after centering
    geo.computeBoundingBox();
    const cbb = geo.boundingBox!;

    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;

    // Split group 0 (caps) into Front Cap (material 0) and Back Cap (material 2)
    if (geo.groups && geo.groups.length >= 2) {
      const capIndicesTotal = geo.groups[0].count;
      const frontCapCount = Math.floor(capIndicesTotal / 2);

      geo.groups = [
        { start: 0, count: frontCapCount, materialIndex: 0 }, // Front Cap
        { start: frontCapCount, count: frontCapCount, materialIndex: 2 }, // Back Cap
        { start: geo.groups[1].start, count: geo.groups[1].count, materialIndex: 1 }, // Side Walls
      ];
    }

    // Normalize UV coordinates for Front and Back caps
    // Front: U from 0 to 1, V from 0 to 1
    // Back: U flipped (1 - U) so text and crest are NOT mirrored
    const zTolerance = 0.025;
    for (let i = 0; i < uvs.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      if (z >= cbb.max.z - zTolerance) {
        // Front face
        const u = (x - cbb.min.x) / spanX;
        const v = (y - cbb.min.y) / spanY;
        uvs.setXY(i, u, v);
      } else if (z <= cbb.min.z + zTolerance) {
        // Back face (flip U horizontally so player name and number are correct)
        const u = 1 - (x - cbb.min.x) / spanX;
        const v = (y - cbb.min.y) / spanY;
        uvs.setXY(i, u, v);
      }
    }
    uvs.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, []);

  // 2. Load Clean Front Texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      department.frontImage,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        setFrontTexture(tex);
      },
      undefined,
      (err) => console.warn('Front texture load error:', err)
    );
  }, [department.frontImage]);

  // 3. Generate Dynamic Back Texture with live player name & squad number
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = department.backImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw companion base back image
      ctx.drawImage(img, 0, 0, 1024, 1024);

      // Contrast color for text: auto-pick luminance
      const textColor = department.slug === 'it' ? '#E5C158' : department.textColor || '#FFFFFF';

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // PLAYER NAME (Bold athletic condensed typography)
      ctx.fillStyle = textColor;
      ctx.font = 'italic 900 64px "Bebas Neue", "Anton", sans-serif';
      ctx.letterSpacing = '6px';
      const displayName = (customName || 'STUDENT').toUpperCase().slice(0, 12);
      ctx.fillText(displayName, 512, 340);

      // SQUAD JERSEY NUMBER (Giant collegiate esports numerals)
      ctx.font = '900 230px "Bebas Neue", "Anton", sans-serif';
      const numStr = String(jerseyNumber).padStart(2, '0');
      ctx.fillText(numStr, 512, 540);

      // Bottom Campus League watermark
      ctx.font = '700 24px monospace';
      ctx.fillStyle = department.slug === 'aiml' ? 'rgba(15,29,56,0.6)' : 'rgba(255,255,255,0.4)';
      ctx.letterSpacing = '4px';
      ctx.fillText('CAMPUS RIVALS 2026', 512, 715);

      ctx.restore();

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      setBackTexture(tex);
    };
  }, [department.backImage, department.slug, department.textColor, customName, jerseyNumber]);

  // Subtle idle sway (respects prefers-reduced-motion)
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

  /*
   * =========================================================================
   * HOOK FOR FUTURE 3D ASSETS:
   * To later swap this procedural model with a real .glb:
   * 1. Import `useGLTF` from '@react-three/drei'
   * 2. Call `const { scene } = useGLTF('/models/jersey.glb')`
   * 3. Return `<primitive object={scene} />` instead of the mesh below.
   * =========================================================================
   */

  // Materials array: [0: Front Cap, 1: Side Seams, 2: Back Cap]
  const materials = useMemo(() => {
    // 0: Front face material
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      color: frontTexture ? '#FFFFFF' : department.primaryColor,
      roughness: 0.85,
      metalness: 0.05,
      bumpMap: fabricBump || undefined,
      bumpScale: 0.03,
      side: THREE.DoubleSide,
    });

    // 1: Side seams / rim material
    const sideMat = new THREE.MeshStandardMaterial({
      color: department.primaryColor,
      roughness: 0.88,
      metalness: 0.05,
      bumpMap: fabricBump || undefined,
      bumpScale: 0.03,
    });

    // 2: Back face material
    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      color: backTexture ? '#FFFFFF' : department.primaryColor,
      roughness: 0.85,
      metalness: 0.05,
      bumpMap: fabricBump || undefined,
      bumpScale: 0.03,
      side: THREE.DoubleSide,
    });

    return [frontMat, sideMat, backMat];
  }, [frontTexture, backTexture, department.primaryColor, fabricBump]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} dispose={null}>
      <mesh
        geometry={jerseyGeometry}
        material={materials}
        castShadow
        receiveShadow
      />
    </group>
  );
}
