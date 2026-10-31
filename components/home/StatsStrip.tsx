'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Shirt, Sparkles } from 'lucide-react';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function Counter({ end, suffix = '', duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const stepTime = Math.abs(Math.floor((duration * 1000) / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  const stats = [
    {
      id: 'stat-1',
      icon: Layers,
      value: 5,
      suffix: '',
      label: 'DEPARTMENTS',
      sublabel: 'Official campus branch colorways',
      bgClass: 'bg-pink-hot text-black',
      shadowClass: 'shadow-hard-yellow',
    },
    {
      id: 'stat-2',
      icon: Shirt,
      value: 500,
      suffix: '+',
      label: 'JERSEYS REGISTERED',
      sublabel: 'Across campus branches',
      bgClass: 'bg-yellow-electric text-black',
      shadowClass: 'shadow-hard-pink',
    },
    {
      id: 'stat-3',
      icon: Sparkles,
      value: 100,
      suffix: '%',
      label: 'CUSTOMISABLE',
      sublabel: 'Name, number & size in 3D',
      bgClass: 'bg-white text-black',
      shadowClass: 'shadow-hard-pink',
    },
  ];

  return (
    <section className="relative w-full py-12 bg-[#08080E] border-b-2 border-[#232338] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-6 sm:p-8 skew-tag ${stat.bgClass} ${stat.shadowClass} flex items-center gap-6 relative overflow-hidden group`}
              >
                {/* Background decorative faint icon */}
                <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-300" />

                <div className="skew-tag-inner flex items-center justify-center w-14 h-14 bg-black/15 shrink-0">
                  <Icon className="w-8 h-8 text-black" />
                </div>

                <div className="skew-tag-inner">
                  <div className="font-display text-5xl sm:text-6xl font-black italic tracking-tight leading-none">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-bold italic tracking-wider mt-1 uppercase">
                    {stat.label}
                  </div>
                  <div className="text-xs font-mono font-medium opacity-80 mt-0.5 uppercase">
                    {stat.sublabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

