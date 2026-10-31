'use client';

import React from 'react';
import { NEWS_ITEMS } from '@/data/news';
import { Bell, Flame, ChevronRight } from 'lucide-react';

export default function Announcements() {
  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'DROP':
        return 'bg-pink-hot text-black';
      case 'ALERT':
        return 'bg-yellow-electric text-black';
      case 'EVENT':
        return 'bg-[#00F0FF] text-black';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <section className="relative w-full py-20 bg-[#0B0B12] border-b-2 border-[#232338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-pink-hot text-xs font-mono font-bold px-3 py-1 uppercase skew-tag mb-2">
              <Bell className="w-3.5 h-3.5 skew-tag-inner" />
              <span className="skew-tag-inner">LATEST DISPATCHES</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight uppercase text-white leading-none">
              NEWS & UPDATES
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase">
            CAMPUS DISPATCH FEED • UPDATED REGULARLY
          </span>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {NEWS_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-[#13131F] border border-[#232338] hover:border-pink-hot p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-[#181829] group shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Badge & Date */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-display text-xs font-black uppercase px-2.5 py-1 tracking-wider skew-tag ${getBadgeColor(
                      item.label
                    )}`}
                  >
                    <span className="skew-tag-inner">{item.label}</span>
                  </span>
                  <span className="font-mono text-xs text-zinc-400 font-bold">
                    {item.date}
                  </span>
                </div>

                {/* Title and summary */}
                <div className="space-y-1">
                  <h3 className="font-display text-xl sm:text-2xl text-white italic tracking-wider group-hover:text-yellow-electric transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action arrow */}
              <div className="shrink-0 flex items-center gap-1 text-xs font-mono text-zinc-500 group-hover:text-pink-hot transition-colors uppercase font-bold">
                <Flame className="w-4 h-4 text-pink-hot" />
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

