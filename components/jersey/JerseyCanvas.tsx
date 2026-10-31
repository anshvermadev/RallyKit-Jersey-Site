'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, useProgress, Html } from '@react-three/drei';
import { RotateCcw, Camera, Eye, Sparkles } from 'lucide-react';
import { Department } from '@/data/departments';
import { CameraView } from '@/lib/store/useCustomizerStore';
import SafeJerseyRenderer from './GLBJerseyModel';
import CameraController from './CameraController';

interface JerseyCanvasProps {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
  collarColor?: string;
  onSnapshot?: (dataUrl: string) => void;
  className?: string;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-[#0B0B12]/90 border border-pink-hot p-4 rounded skew-tag text-center min-w-[180px] shadow-hard-pink">
        <div className="text-yellow-electric font-display text-xl skew-tag-inner tracking-wider italic animate-pulse">
          LOADING 3D KIT...
        </div>
        <div className="w-full bg-[#1A1A2E] h-2 mt-2 rounded-full overflow-hidden skew-tag-inner border border-zinc-700">
          <div
            className="h-full bg-pink-hot transition-all duration-300"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-zinc-400 mt-1 skew-tag-inner">
          {Math.round(progress)}% LOADED
        </span>
      </div>
    </Html>
  );
}

// 2D SVG Fallback if WebGL is unsupported
function WebGLFallback({
  department,
  customName,
  jerseyNumber,
  sleeveColor,
}: {
  department: Department;
  customName: string;
  jerseyNumber: number;
  sleeveColor?: string;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#13131F] border border-pink-hot/30">
      <div className="relative w-64 h-72 flex items-center justify-center">
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_10px_20px_rgba(255,46,147,0.3)]">
          {/* Sleeves */}
          <path d="M 30,50 L 0,80 L 25,120 L 50,85 Z" fill={sleeveColor || department.secondaryColor} />
          <path d="M 170,50 L 200,80 L 175,120 L 150,85 Z" fill={sleeveColor || department.secondaryColor} />
          {/* Main Body */}
          <path
            d="M 45,50 L 155,50 L 160,210 L 40,210 Z"
            fill={department.primaryColor}
            stroke="#232338"
            strokeWidth="3"
          />
          {/* Collar */}
          <path d="M 70,50 Q 100,85 130,50 Z" fill="#FFE600" />
        </svg>

        {/* Live Text Overlay on SVG */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pt-8">
          <span className="text-white font-black text-xs tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded">
            {customName || 'STUDENT'}
          </span>
          <span className="text-yellow-electric font-black text-4xl mt-2 drop-shadow-md">
            {String(jerseyNumber).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">
            {department.shortName}
          </span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 mt-4">
        (WebGL acceleration disabled on this browser; 2D reactive preview active)
      </p>
    </div>
  );
}

export default function JerseyCanvas({
  department,
  customName,
  jerseyNumber,
  sleeveColor,
  collarColor,
  onSnapshot,
  className = 'h-[460px] md:h-[580px]',
}: JerseyCanvasProps) {
  const [cameraView, setCameraView] = useState<CameraView>('perspective');
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  const handleTakeSnapshot = () => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onSnapshot?.(dataUrl);
      } catch (e) {
        console.warn('Could not capture canvas snapshot:', e);
      }
    }
  };

  if (!webGLSupported) {
    return (
      <WebGLFallback
        department={department}
        customName={customName}
        jerseyNumber={jerseyNumber}
        sleeveColor={sleeveColor}
      />
    );
  }

  return (
    <div className={`relative w-full ${className} bg-gradient-to-b from-[#10101C] via-[#0D0D17] to-[#08080E] border-2 border-[#232338] overflow-hidden group select-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]`}>
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,46,147,0.12),transparent_70%)] pointer-events-none" />

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [1.8, 1.2, 2.6], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        {/* Main Key Light */}
        <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
        {/* Hot Pink Rim Light (Esports style) */}
        <directionalLight position={[-5, 3, -4]} color="#FF2E93" intensity={2.6} />
        {/* Electric Yellow Fill */}
        <directionalLight position={[5, -2, -3]} color="#FFE600" intensity={1.2} />

        <Suspense fallback={<Loader />}>
          <SafeJerseyRenderer
            department={department}
            customName={customName}
            jerseyNumber={jerseyNumber}
            sleeveColor={sleeveColor}
            collarColor={collarColor}
          />
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.8}
            scale={5}
            blur={2.4}
            far={4}
            color="#000000"
          />
          <Environment preset="city" />
        </Suspense>

        <CameraController
          view={cameraView}
          autoRotate={autoRotate}
          onInteractionStart={() => setAutoRotate(false)}
        />
      </Canvas>

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="bg-[#13131F]/90 backdrop-blur border border-pink-hot/40 px-3 py-1 flex items-center gap-1.5 skew-tag">
          <Sparkles className="w-3.5 h-3.5 text-pink-hot skew-tag-inner" />
          <span className="font-display text-xs text-white skew-tag-inner tracking-widest">
            3D REAL-TIME KIT
          </span>
        </div>
      </div>

      {/* Top Right Auto-Rotate Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
            autoRotate
              ? 'bg-yellow-electric text-black border-yellow-electric'
              : 'bg-[#13131F]/90 text-zinc-300 border-zinc-700 hover:border-pink-hot'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? 'ROTATING' : 'PAUSED'}</span>
        </button>

        <button
          onClick={handleTakeSnapshot}
          className="bg-[#13131F]/90 text-zinc-300 border border-zinc-700 hover:border-yellow-electric hover:text-yellow-electric p-1.5 transition-colors"
          title="Snapshot 3D View"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Snap View Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 sm:gap-2 bg-[#0B0B12]/85 backdrop-blur-md p-1.5 border border-[#232338] shadow-2xl">
        <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 hidden sm:inline flex items-center gap-1">
          <Eye className="w-3 h-3 text-pink-hot" /> SNAP:
        </span>
        {(['front', 'back', 'left', 'right', 'perspective'] as CameraView[]).map((v) => (
          <button
            key={v}
            onClick={() => {
              setCameraView(v);
              setAutoRotate(false);
            }}
            className={`px-2.5 py-1 text-[11px] font-display uppercase tracking-wider transition-all ${
              cameraView === v
                ? 'bg-pink-hot text-black font-black shadow-hard-yellow'
                : 'text-zinc-400 hover:text-white hover:bg-[#1B1B2C]'
            }`}
          >
            {v === 'perspective' ? 'RESET' : v}
          </button>
        ))}
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-zinc-500 font-mono hidden md:block">
        DRAG TO ORBIT • PINCH TO ZOOM
      </div>
    </div>
  );
}
