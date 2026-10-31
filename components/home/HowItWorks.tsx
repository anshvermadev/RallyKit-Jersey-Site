'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Wand2, FileCheck2, PackageCheck, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'PICK DEPT',
    desc: 'Browse our 8 departmental combat colorways and choose your identity.',
    icon: Layers,
    color: '#FF2E93',
  },
  {
    number: '02',
    title: 'CUSTOMISE',
    desc: 'Inspect the 3D jersey in 360°. Add your back player name, squad number & size.',
    icon: Wand2,
    color: '#FFE600',
  },
  {
    number: '03',
    title: 'REGISTER',
    desc: 'Input your student enrollment & phone. Complete the instant sandbox demo checkout.',
    icon: FileCheck2,
    color: '#00F0FF',
  },
  {
    number: '04',
    title: 'COLLECT',
    desc: 'Receive your unique QR verification pass and collect at SAC Counter 4 on kit day.',
    icon: PackageCheck,
    color: '#FF2E93',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 bg-[#08080E] border-b-2 border-[#232338] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A1A2E_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#141424] text-pink-hot font-mono text-xs font-bold px-3 py-1 uppercase skew-tag border border-pink-hot/30">
            <Flame className="w-3.5 h-3.5 skew-tag-inner fill-current" />
            <span className="skew-tag-inner">4 SIMPLE STEPS TO GLORY</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-black italic tracking-tight uppercase text-white leading-none">
            HOW TO GET YOUR KIT
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From 3D digital customizer to campus collection slip in under two minutes.
          </p>
        </div>

        {/* Steps Grid with Progress Line */}
        <div className="relative">
          {/* Animated Connecting Progress Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-[#1A1A2E] -translate-y-12 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-pink-hot via-yellow-electric to-pink-hot origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-[#13131F] border-2 border-[#232338] p-6 flex flex-col justify-between hover:border-pink-hot transition-all shadow-hard-card group"
                >
                  <div>
                    {/* Top Step Number and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="font-display text-4xl font-black italic tracking-wider leading-none"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                      <div className="w-12 h-12 bg-[#1B1B2C] border border-zinc-700 group-hover:border-pink-hot flex items-center justify-center skew-tag transition-colors">
                        <Icon className="w-6 h-6 text-white skew-tag-inner group-hover:text-yellow-electric transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-black italic uppercase tracking-wider text-white group-hover:text-yellow-electric transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1E1E30] flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase font-bold">
                    <span>STEP {idx + 1} OF 4</span>
                    <span className="text-pink-hot group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/jerseys"
            className="btn-hard-pink inline-flex items-center gap-2 px-8 py-3.5 skew-tag uppercase"
          >
            <span className="skew-tag-inner font-display text-lg tracking-wider text-black flex items-center gap-2">
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
