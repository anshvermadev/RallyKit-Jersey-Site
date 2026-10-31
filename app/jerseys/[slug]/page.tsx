'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ChevronRight, Shield, Award, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { getDepartmentBySlug, DEPARTMENTS } from '@/data/departments';
import { useCustomizerStore } from '@/lib/store/useCustomizerStore';
import CustomizerPanel from '@/components/jersey/CustomizerPanel';

// Dynamic import with SSR disabled for optimal client-side 3D initialization
const JerseyCanvas = dynamic(() => import('@/components/jersey/JerseyCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] md:h-[600px] bg-[#10101C] border-2 border-[#232338] flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <Flame className="w-12 h-12 text-pink-hot animate-bounce mb-3" />
      <span className="font-display text-2xl text-yellow-electric italic tracking-wider">
        PREPARING 3D CANVAS...
      </span>
      <span className="text-xs font-mono text-zinc-500 mt-2">
        Allocating WebGL buffers & lighting rigs
      </span>
    </div>
  ),
});

export default function JerseyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const dept = getDepartmentBySlug(params.slug);

  const {
    customName,
    jerseyNumber,
    sleeveColor,
    collarColor,
    setDepartment,
    setSnapshotUrl,
  } = useCustomizerStore();

  useEffect(() => {
    if (dept) {
      setDepartment(dept);
    }
  }, [dept, setDepartment]);

  if (!dept) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0B12] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-pink-hot transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/jerseys" className="hover:text-pink-hot transition-colors">
            JERSEYS
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-yellow-electric font-bold">{dept.shortName}</span>
        </div>

        {/* Main 3D Canvas + Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Interactive Viewer Stage */}
          <div className="lg:col-span-7 space-y-4">
            <JerseyCanvas
              department={dept}
              customName={customName}
              jerseyNumber={jerseyNumber}
              sleeveColor={sleeveColor}
              collarColor={collarColor}
              onSnapshot={(url) => setSnapshotUrl(url)}
              className="h-[460px] sm:h-[560px] lg:h-[620px]"
            />

            {/* Quick Department Switcher Strip */}
            <div className="bg-[#13131F] border border-[#232338] p-3 flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase shrink-0 px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-hot" /> SWITCH SQUAD:
              </span>
              <div className="flex items-center gap-2">
                {DEPARTMENTS.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/jerseys/${d.slug}`}
                    className={`px-2.5 py-1 text-xs font-display italic uppercase tracking-wider transition-colors shrink-0 ${
                      d.slug === dept.slug
                        ? 'bg-yellow-electric text-black font-black'
                        : 'bg-[#1A1A2E] text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {d.shortName}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Customisation Panel */}
          <div className="lg:col-span-5">
            <CustomizerPanel department={dept} />
          </div>
        </div>

        {/* Technical Product Specifications Section */}
        <div className="mt-16 pt-12 border-t-2 border-[#232338]">
          <h3 className="font-display text-3xl font-black italic uppercase tracking-wider text-white mb-6">
            AUTHENTIC PRODUCT SPECIFICATIONS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#13131F] border border-[#232338] p-5 space-y-2">
              <div className="w-9 h-9 bg-pink-hot/15 flex items-center justify-center text-pink-hot skew-tag mb-2">
                <Shield className="w-5 h-5 skew-tag-inner" />
              </div>
              <h4 className="font-display text-lg text-white uppercase italic">
                220 GSM SUBLIMATION
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                High-definition digital sublimation guarantees zero fading, cracking, or peeling after multiple washes.
              </p>
            </div>

            <div className="bg-[#13131F] border border-[#232338] p-5 space-y-2">
              <div className="w-9 h-9 bg-yellow-electric/15 flex items-center justify-center text-yellow-electric skew-tag mb-2">
                <Sparkles className="w-5 h-5 skew-tag-inner" />
              </div>
              <h4 className="font-display text-lg text-white uppercase italic">
                SWEAT-WICKING CYBER-DRY
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Micro-perforated polyester yarn pulls moisture rapidly to keep you cool under stage lights and campus sun.
              </p>
            </div>

            <div className="bg-[#13131F] border border-[#232338] p-5 space-y-2">
              <div className="w-9 h-9 bg-cyan-400/15 flex items-center justify-center text-cyan-400 skew-tag mb-2">
                <Award className="w-5 h-5 skew-tag-inner" />
              </div>
              <h4 className="font-display text-lg text-white uppercase italic">
                REINFORCED DOUBLE SEAMS
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engineered collar binding and double-stitched sleeve hems built to endure active campus seasons.
              </p>
            </div>

            <div className="bg-[#13131F] border border-[#232338] p-5 space-y-2">
              <div className="w-9 h-9 bg-green-400/15 flex items-center justify-center text-green-400 skew-tag mb-2">
                <CheckCircle2 className="w-5 h-5 skew-tag-inner" />
              </div>
              <h4 className="font-display text-lg text-white uppercase italic">
                CAMPUS PICKUP QR PASS
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instant digital authentication pass sent immediately upon registration for frictionless collection at SAC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
