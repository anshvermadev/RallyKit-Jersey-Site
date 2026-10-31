'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, ArrowUpRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { DEPARTMENTS } from '@/data/departments';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useCustomizerStore } from '@/lib/store/useCustomizerStore';

export default function JerseysListingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'TECH' | 'CORE' | 'CIRCUITS'>('ALL');

  const setJerseyData = useRegistrationStore((state) => state.setJerseyData);
  const setStudentData = useRegistrationStore((state) => state.setStudentData);
  const setDepartment = useCustomizerStore((state) => state.setDepartment);

  const filteredDepartments = useMemo(() => {
    return DEPARTMENTS.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'TECH') {
        return ['cse', 'aiml', 'it'].includes(dept.slug);
      }
      if (selectedFilter === 'CIRCUITS') {
        return ['ece', 'eee'].includes(dept.slug);
      }
      if (selectedFilter === 'CORE') {
        return ['mech', 'civil', 'chem'].includes(dept.slug);
      }
      return true;
    });
  }, [searchQuery, selectedFilter]);

  const handleQuickRegister = (dept: (typeof DEPARTMENTS)[0]) => {
    setDepartment(dept);
    setJerseyData({
      departmentSlug: dept.slug,
      departmentName: dept.name,
      customName: 'STUDENT',
      jerseyNumber: 10,
      size: 'L',
      sleeveColor: dept.sleeveColors[0] || dept.secondaryColor,
      collarColor: dept.collarColors[0] || dept.primaryColor,
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
            <span className="skew-tag-inner">CAMPUS LEAGUE 2026 KITS</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase text-white leading-none">
            ALL DEPARTMENT JERSEYS
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Pick your squad jersey, customize your personal player name and number in the interactive 3D viewer, and secure your campus collection pass.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-4 sm:p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-zinc-500 font-bold uppercase flex items-center gap-1 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-pink-hot" /> FILTER:
            </span>
            {(['ALL', 'TECH', 'CIRCUITS', 'CORE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-xs font-display font-bold italic tracking-wider uppercase transition-all ${
                  selectedFilter === filter
                    ? 'bg-pink-hot text-black shadow-hard-yellow'
                    : 'bg-[#1A1A2E] text-zinc-400 hover:text-white border border-[#232338]'
                }`}
              >
                {filter === 'ALL' ? 'ALL BRANCHES' : filter}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CSE, Mech, ECE..."
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

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.slug}
              className="bg-[#13131F] border-2 border-[#232338] hover:border-pink-hot p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg hover:shadow-hard-pink group"
            >
              <div>
                {/* Badge & Price Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-yellow-electric text-black font-mono text-[10px] font-black px-2 py-0.5 uppercase tracking-wider skew-tag">
                    <span className="skew-tag-inner">{dept.badgeText}</span>
                  </span>
                  <span className="font-display text-2xl font-black text-white italic">
                    ₹{dept.basePrice}
                  </span>
                </div>

                {/* 3D-Lite Vector Preview Card */}
                <Link
                  href={`/jerseys/${dept.slug}`}
                  className="block relative w-full h-52 bg-[#0B0B12] border border-[#232338] group-hover:border-pink-hot/50 transition-colors p-4 flex items-center justify-center overflow-hidden mb-5"
                >
                  <svg viewBox="0 0 160 180" className="w-36 h-40 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    {/* Sleeves */}
                    <path
                      d="M 25,45 L 0,70 L 20,105 L 40,75 Z"
                      fill={dept.sleeveColors[0] || dept.secondaryColor}
                    />
                    <path
                      d="M 135,45 L 160,70 L 140,105 L 120,75 Z"
                      fill={dept.sleeveColors[0] || dept.secondaryColor}
                    />
                    {/* Main Torso */}
                    <path
                      d="M 35,45 L 125,45 L 130,170 L 30,170 Z"
                      fill={dept.primaryColor}
                    />
                    {/* Collar */}
                    <path
                      d="M 55,45 Q 80,75 105,45 Z"
                      fill={dept.collarColors[0] || '#FFE600'}
                    />
                  </svg>

                  {/* Overlay ShortName badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display text-3xl font-black text-white italic tracking-wider drop-shadow-lg">
                      {dept.shortName}
                    </span>
                    <span className="font-mono text-[9px] text-yellow-electric font-bold tracking-widest mt-1">
                      {dept.batch}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400 group-hover:text-yellow-electric">
                    3D PREVIEW →
                  </div>
                </Link>

                <h3 className="font-display text-2xl font-black italic tracking-wider text-white group-hover:text-yellow-electric transition-colors leading-tight">
                  {dept.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {dept.tagline}
                </p>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">COLORWAY:</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: dept.primaryColor }}
                    title="Primary"
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: dept.secondaryColor }}
                    title="Secondary"
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: dept.collarColors[0] || '#FFE600' }}
                    title="Accent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#232338]">
                <Link
                  href={`/jerseys/${dept.slug}`}
                  className="bg-[#1A1A2E] hover:bg-zinc-800 border border-zinc-700 text-white font-display text-sm uppercase italic tracking-wider py-2.5 px-3 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>VIEW 3D</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleQuickRegister(dept)}
                  className="btn-hard-pink text-black font-display text-sm uppercase italic tracking-wider py-2.5 px-3 flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                  <span>REGISTER</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-20 bg-[#13131F] border border-[#232338] p-8">
            <p className="font-display text-2xl text-yellow-electric italic">
              NO DEPARTMENTS MATCHED &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs font-mono text-zinc-400 mt-2">
              Try searching for &quot;CSE&quot;, &quot;Mechanical&quot;, or click All Branches.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('ALL');
              }}
              className="mt-6 btn-hard-pink skew-tag px-6 py-2 text-xs font-display uppercase font-bold text-black"
            >
              <span className="skew-tag-inner">RESET FILTERS</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
