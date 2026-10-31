'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Trophy, Shield } from 'lucide-react';

interface HighlightSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
}

const HIGHLIGHTS_DATA: HighlightSlide[] = [
  {
    id: 'hl-1',
    badge: 'STAGE REVEAL',
    title: 'THE 2026 MAIN STAGE ARENA DROP',
    subtitle: 'Over 800 students cheered as the CSE and AI&DS jerseys were revealed under laser strobes.',
    tag: 'ESPORTS FINALS',
    color: '#FF2E93',
  },
  {
    id: 'hl-2',
    badge: 'FABRIC TECH',
    title: '220 GSM SUBLIMATION CYBER-DRY MESH',
    subtitle: 'Micro-perforated breathable weave engineered for high-heat gaming and campus sports.',
    tag: 'PRODUCTION LAB',
    color: '#FFE600',
  },
  {
    id: 'hl-3',
    badge: 'CAMPUS PRIDE',
    title: 'MECHANICAL & CIVIL WARRIORS ASSEMBLE',
    subtitle: 'Industrial hazard patterns that turn heads in lecture halls and outdoor tournament courts.',
    tag: 'INTER-DEPT CLASH',
    color: '#00F0FF',
  },
  {
    id: 'hl-4',
    badge: 'LIMITED EDITION',
    title: 'METALLIC FOIL BADGES FOR CAPTAINS',
    subtitle: 'Exclusive crest foil stamping reserved for team leaders and branch champions.',
    tag: 'VIP ACCESS',
    color: '#FF1744',
  },
];

export default function Highlights() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HIGHLIGHTS_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + HIGHLIGHTS_DATA.length) % HIGHLIGHTS_DATA.length);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % HIGHLIGHTS_DATA.length);
  };

  const slide = HIGHLIGHTS_DATA[current];

  return (
    <section className="relative w-full py-20 bg-[#0B0B12] border-b-2 border-[#232338] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-yellow-electric text-xs font-mono font-bold px-3 py-1 uppercase skew-tag mb-2">
              <Zap className="w-3.5 h-3.5 skew-tag-inner" />
              <span className="skew-tag-inner">CAMPUS ACTION & PHOTO RECAP</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight uppercase text-white leading-none">
              MOMENTS & HIGHLIGHTS
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 bg-[#13131F] text-white hover:bg-pink-hot hover:text-black border border-[#232338] flex items-center justify-center transition-all shadow-hard-yellow"
              aria-label="Previous highlight slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 bg-[#13131F] text-white hover:bg-yellow-electric hover:text-black border border-[#232338] flex items-center justify-center transition-all shadow-hard-pink"
              aria-label="Next highlight slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div className="relative w-full min-h-[380px] sm:min-h-[440px] bg-gradient-to-br from-[#151528] to-[#0A0A14] border-2 border-[#232338] p-8 sm:p-12 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Decorative glowing gradient backdrop */}
          <div
            className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: slide.color }}
          />

          {/* Esports Background Watermark */}
          <div className="absolute right-4 bottom-0 font-display text-[120px] sm:text-[180px] font-black italic text-white/5 pointer-events-none select-none leading-none">
            {slide.tag.split(' ')[0]}
          </div>

          {/* Top Info */}
          <div className="relative z-10 flex items-center gap-3">
            <span
              className="font-display text-sm font-bold uppercase tracking-wider px-3.5 py-1 text-black skew-tag"
              style={{ backgroundColor: slide.color }}
            >
              <span className="skew-tag-inner">{slide.badge}</span>
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-electric" /> {slide.tag}
            </span>
          </div>

          {/* Center Main Text */}
          <div className="relative z-10 my-8 space-y-3 max-w-2xl">
            <h3 className="font-display text-3xl sm:text-5xl font-black italic uppercase tracking-wider text-white leading-tight">
              {slide.title}
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Bottom Indicators & Step Counter */}
          <div className="relative z-10 flex items-center justify-between border-t border-[#232338] pt-6">
            <div className="flex items-center gap-2">
              {HIGHLIGHTS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 transition-all ${
                    idx === current ? 'w-10 bg-pink-hot' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <Shield className="w-3.5 h-3.5 text-yellow-electric" />
              <span>
                SLIDE 0{current + 1} / 0{HIGHLIGHTS_DATA.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
