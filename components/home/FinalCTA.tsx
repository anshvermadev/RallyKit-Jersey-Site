'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShoppingBag, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function FinalCTA() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-r from-pink-hot via-[#FF1775] to-pink-hot text-black overflow-hidden border-t-2 border-black">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000000_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[140px] sm:text-[220px] font-black italic text-black/10 select-none pointer-events-none whitespace-nowrap">
        JOIN SQUAD
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 bg-black text-yellow-electric font-mono text-xs font-black px-4 py-1.5 uppercase skew-tag shadow-[3px_3px_0_0_#FFE600]">
          <Flame className="w-4 h-4 skew-tag-inner fill-yellow-electric" />
          <span className="skew-tag-inner">LIMITED CAMPUS DROP • {SITE_CONFIG.batch}</span>
        </div>

        <h2 className="font-display text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tight uppercase leading-none text-black drop-shadow-[0_4px_0_#FFE600]">
          JOIN THE SQUAD !!
        </h2>

        <p className="text-black font-bold text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          Don&apos;t watch from the sidelines. Customise your official department kit and grab your verified collection pass today.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-black text-white hover:bg-yellow-electric hover:text-black font-display text-2xl uppercase italic tracking-wider px-10 py-5 skew-tag shadow-[6px_6px_0px_0px_#FFE600] transition-all flex items-center justify-center gap-3 group"
          >
            <span className="skew-tag-inner flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              REGISTER NOW
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/jerseys"
            className="w-full sm:w-auto bg-[#FFE600] text-black hover:bg-white font-display text-2xl uppercase italic tracking-wider px-10 py-5 skew-tag shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center"
          >
            <span className="skew-tag-inner">EXPLORE 3D MODELS</span>
          </Link>
        </div>

        <div className="pt-4 text-xs font-mono font-bold uppercase tracking-widest text-black/80">
          ⚡ {SITE_CONFIG.demoNotice} ⚡
        </div>
      </div>
    </section>
  );
}
