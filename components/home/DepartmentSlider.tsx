'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import { DEPARTMENTS } from '@/data/departments';

export default function DepartmentSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-20 bg-pink-hot text-black overflow-hidden border-b-2 border-black">
      {/* Background Esports Decals */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 font-display text-[180px] font-black italic text-black/5 select-none pointer-events-none">
        5 BRANCHES
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-black text-yellow-electric text-xs font-mono font-bold px-3 py-1 uppercase skew-tag mb-2">
              <Sparkles className="w-3.5 h-3.5 skew-tag-inner" />
              <span className="skew-tag-inner">5 OFFICIAL BRANCH COLORWAYS</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-none text-black">
              DEPARTMENT LINEUP
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 bg-black text-white hover:bg-yellow-electric hover:text-black flex items-center justify-center transition-all shadow-[4px_4px_0_0_#FFE600] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Previous departments"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 bg-black text-white hover:bg-yellow-electric hover:text-black flex items-center justify-center transition-all shadow-[4px_4px_0_0_#FFE600] active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Next departments"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.slug}
              href={`/jerseys/${dept.slug}`}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] bg-[#0B0B12] text-white p-6 border-2 border-black hover:border-yellow-electric transition-all shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#FFE600] hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Top Card Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-yellow-electric text-black font-mono text-[11px] font-black px-2.5 py-0.5 uppercase tracking-wider skew-tag">
                    <span className="skew-tag-inner">{dept.badgeText}</span>
                  </span>
                  <span className="font-display text-xl text-yellow-electric italic">
                    ₹{dept.basePrice}
                  </span>
                </div>

                {/* Jersey Image Preview */}
                <div className="relative w-full h-52 bg-[#0B0B12] border border-[#232338] flex items-center justify-center overflow-hidden mb-4 group-hover:border-pink-hot transition-colors p-2">
                  <img
                    src={dept.frontImage}
                    alt={dept.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono text-yellow-electric px-2 py-0.5">
                    3D VIEW →
                  </div>
                </div>

                {/* Dept Names */}
                <h3 className="font-display text-2xl text-white italic tracking-wider group-hover:text-yellow-electric transition-colors leading-snug">
                  {dept.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {dept.tagline}
                </p>
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 pt-4 border-t border-[#232338] flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 font-bold uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-pink-hot" /> {dept.stats.registeredCount} BOOKED
                </span>
                <span className="font-display text-sm text-yellow-electric uppercase italic tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  CUSTOMIZE 3D <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
