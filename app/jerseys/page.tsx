'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, Flame, ArrowUpRight, ShoppingBag, Sparkles } from 'lucide-react';
import { DEPARTMENTS, Department } from '@/data/departments';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useCustomizerStore } from '@/lib/store/useCustomizerStore';

// Dynamic import of mini canvas for hover 3D interaction (max 1 active canvas)
const MiniJerseyCanvas = dynamic(() => import('@/components/jersey/JerseyCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0B0B12] animate-pulse" />,
});

export default function JerseysListingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const setJerseyData = useRegistrationStore((state) => state.setJerseyData);
  const setStudentData = useRegistrationStore((state) => state.setStudentData);
  const setDepartment = useCustomizerStore((state) => state.setDepartment);

  const filteredDepartments = useMemo(() => {
    return DEPARTMENTS.filter((dept) => {
      const q = searchQuery.toLowerCase();
      return (
        dept.name.toLowerCase().includes(q) ||
        dept.shortName.toLowerCase().includes(q) ||
        dept.badgeText.toLowerCase().includes(q) ||
        dept.tagline.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleQuickRegister = (dept: Department) => {
    setDepartment(dept);
    setJerseyData({
      departmentSlug: dept.slug,
      departmentName: dept.name,
      customName: 'STUDENT',
      jerseyNumber: 10,
      size: 'L',
      sleeveColor: dept.sleeveColor,
      collarColor: dept.collarColor,
      quantity: 1,
    });
    setStudentData({
      department: dept.name,
    });
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-yellow-electric font-mono text-xs font-bold px-3 py-1 uppercase skew-tag border border-yellow-electric/30">
            <Flame className="w-3.5 h-3.5 skew-tag-inner fill-yellow-electric" />
            <span className="skew-tag-inner">5 OFFICIAL CAMPUS BRANCHES</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase text-white leading-none">
            DEPARTMENT JERSEYS
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Hover over any jersey to spin it in 3D. Choose your branch, customize your back name and squad number, and claim your campus pass.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-4 sm:p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-zinc-500 font-bold uppercase mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-hot" /> 5 BRANCH COLORWAYS:
            </span>
            {DEPARTMENTS.map((dept) => (
              <span
                key={dept.slug}
                className="bg-[#1A1A2E] text-white border border-[#232338] px-3 py-1 text-xs font-display italic uppercase"
              >
                {dept.shortName} ({dept.badgeText})
              </span>
            ))}
          </div>

          <div className="relative min-w-[260px] sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CSE, IT, CSBS, AIML, EXTC..."
              className="w-full bg-[#0B0B12] border border-[#232338] focus:border-yellow-electric px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* 5 Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredDepartments.map((dept) => {
            const isHovered = hoveredSlug === dept.slug;

            return (
              <div
                key={dept.slug}
                onMouseEnter={() => setHoveredSlug(dept.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className="bg-[#13131F] border-2 border-[#232338] hover:border-pink-hot p-5 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg hover:shadow-hard-pink group"
              >
                <div>
                  {/* Badge & Price Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-yellow-electric text-black font-mono text-[10px] font-black px-2 py-0.5 uppercase tracking-wider skew-tag">
                      <span className="skew-tag-inner">{dept.badgeText}</span>
                    </span>
                    <span className="font-display text-2xl font-black text-white italic">
                      ₹{dept.basePrice}
                    </span>
                  </div>

                  {/* 3D-on-hover preview container (static image otherwise) */}
                  <Link
                    href={`/jerseys/${dept.slug}`}
                    className="block relative w-full h-64 bg-[#0B0B12] border border-[#232338] group-hover:border-pink-hot/60 transition-colors p-2 flex items-center justify-center overflow-hidden mb-4"
                  >
                    {isHovered ? (
                      <div className="w-full h-full">
                        <MiniJerseyCanvas
                          department={dept}
                          customName="STUDENT"
                          jerseyNumber={10}
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={dept.frontImage}
                          alt={dept.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400 group-hover:text-yellow-electric">
                          HOVER FOR 3D ↺
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-xl text-yellow-electric font-black italic">
                      {dept.shortName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
                      • {dept.badgeText}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold italic tracking-wider text-white leading-tight">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {dept.tagline}
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#232338]">
                  <Link
                    href={`/jerseys/${dept.slug}`}
                    className="bg-[#1A1A2E] hover:bg-zinc-800 border border-zinc-700 text-white font-display text-xs uppercase italic tracking-wider py-2.5 px-2 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>VIEW 3D</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickRegister(dept)}
                    className="btn-hard-pink text-black font-display text-xs uppercase italic tracking-wider py-2.5 px-2 flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                    <span>REGISTER</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
