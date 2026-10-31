'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Play, ShoppingBag, ArrowRight, X, Flame } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import { DEPARTMENTS } from '@/data/departments';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import with SSR disabled for maximum Lighthouse score and fast initial paint
const JerseyCanvas = dynamic(() => import('@/components/jersey/JerseyCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] md:h-[560px] bg-[#121220] border-2 border-[#232338] flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="w-16 h-16 bg-pink-hot/20 rounded-full flex items-center justify-center mb-4">
        <Flame className="w-8 h-8 text-pink-hot animate-bounce" />
      </div>
      <span className="font-display text-2xl text-yellow-electric italic tracking-wider">
        INITIALIZING 3D ENGINE...
      </span>
      <span className="text-xs font-mono text-zinc-500 mt-2">
        Loading WebGL Canvas & Textures
      </span>
    </div>
  ),
});

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const featuredDept = DEPARTMENTS[0]; // CSE default showcase

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-[#0B0B12] overflow-hidden pt-6 pb-16 lg:py-12 border-b-2 border-[#232338]">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-hot/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-electric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b1b2c15_1px,transparent_1px),linear-gradient(to_bottom,#1b1b2c15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Big Esports Poster Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Batch & Season Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="bg-pink-hot text-black font-display text-sm tracking-wider px-3 py-1 skew-tag shadow-hard-yellow">
                <span className="skew-tag-inner font-bold">{SITE_CONFIG.batch}</span>
              </span>
              <span className="bg-[#1A1A2E] text-yellow-electric border border-[#232338] text-xs font-mono font-bold px-3 py-1 uppercase tracking-widest">
                OFFICIAL CAMPUS MERCHANDISE
              </span>
            </div>

            {/* Giant Stacked Italic Title */}
            <div className="space-y-1">
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tight leading-[0.88] text-white uppercase select-none">
                WEAR YOUR <br />
                <span className="text-pink-hot hover:text-yellow-electric transition-colors drop-shadow-[0_4px_0_#FFE600]">
                  DEPARTMENT
                </span>
              </h1>
            </div>

            {/* Subtext description */}
            <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-body leading-relaxed">
              Step onto the arena and into class with your branch colors. Full 3D interactive preview, custom player names, authentic sublimation mesh, and instant campus order passes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="btn-hard-pink skew-tag px-8 py-4 flex items-center justify-center group"
              >
                <span className="skew-tag-inner font-display text-xl uppercase tracking-wider text-black flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 fill-black" />
                  REGISTER NOW
                </span>
              </Link>

              <Link
                href="/jerseys"
                className="btn-hard-yellow skew-tag px-8 py-4 flex items-center justify-center group"
              >
                <span className="skew-tag-inner font-display text-xl uppercase tracking-wider text-black flex items-center gap-2">
                  <span>VIEW JERSEYS</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Watch Reveal Play Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-[#13131F] border border-zinc-700 hover:border-pink-hot text-zinc-300 hover:text-white transition-all group font-display text-sm uppercase tracking-wider italic"
              >
                <div className="w-8 h-8 rounded-full bg-pink-hot/20 flex items-center justify-center group-hover:bg-pink-hot transition-colors">
                  <Play className="w-4 h-4 text-pink-hot group-hover:text-black fill-current ml-0.5" />
                </div>
                <span>WATCH REVEAL</span>
              </button>
            </div>

            {/* Live department chips */}
            <div className="pt-4 flex items-center gap-2 flex-wrap text-xs font-mono text-zinc-400">
              <span className="text-zinc-500 font-bold uppercase">5 BRANCHES:</span>
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/jerseys/${d.slug}`}
                  className="bg-[#181829] hover:bg-pink-hot hover:text-black border border-zinc-800 px-2.5 py-1 transition-colors uppercase font-bold flex items-center gap-1.5"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.primaryColor }}
                  />
                  <span>
                    {d.shortName} ({d.badgeText})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Live Auto-Rotating 3D Jersey Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Esports card frame around 3D canvas */}
            <div className="relative p-2 bg-[#18182B] border-2 border-pink-hot shadow-hard-yellow">
              <div className="bg-[#0B0B12] border border-[#232338]">
                <JerseyCanvas
                  department={featuredDept}
                  customName="RIVALS"
                  jerseyNumber={26}
                  className="h-[430px] sm:h-[520px]"
                />
              </div>

              {/* Floating Department Badge */}
              <div className="absolute -bottom-4 left-6 bg-[#0B0B12] border-2 border-yellow-electric px-4 py-2 flex items-center gap-3 skew-tag shadow-hard-pink">
                <span className="skew-tag-inner font-display text-lg text-white italic tracking-wider">
                  FEATURED: <span className="text-yellow-electric">{featuredDept.shortName}</span>
                </span>
                <Link
                  href={`/jerseys/${featuredDept.slug}`}
                  className="skew-tag-inner text-xs font-mono text-pink-hot underline uppercase font-bold"
                >
                  CUSTOMIZE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Reveal Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[#13131F] border-2 border-pink-hot p-6 shadow-hard-pink z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#232338]">
                <h3 className="font-display text-2xl text-yellow-electric italic tracking-wider">
                  COLLEGE RIVALS 2026 OFFICIAL KIT REVEAL
                </h3>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-zinc-400 hover:text-pink-hot p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 aspect-video bg-black flex flex-col items-center justify-center border border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-hot/30 to-yellow-electric/20 pointer-events-none" />
                <Flame className="w-16 h-16 text-pink-hot animate-pulse mb-3" />
                <span className="font-display text-3xl text-white italic tracking-wider">
                  OFFICIAL CINEMATIC TRAILER
                </span>
                <p className="text-xs font-mono text-zinc-400 mt-2 max-w-sm text-center">
                  Teaser playback placeholder. Pre-orders are live across all 8 branches.
                </p>
                <Link
                  href="/jerseys"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="mt-6 btn-hard-pink skew-tag px-6 py-2.5 font-display text-sm tracking-wider uppercase text-black"
                >
                  <span className="skew-tag-inner">EXPLORE 3D JERSEYS</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

