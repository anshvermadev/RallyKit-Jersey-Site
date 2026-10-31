'use client';

import React, { useState } from 'react';
import { FAQS } from '@/data/faq';
import { Plus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative w-full py-24 bg-[#08080E] border-b-2 border-[#232338]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#141424] text-yellow-electric font-mono text-xs font-bold px-3 py-1 uppercase skew-tag border border-yellow-electric/30">
            <HelpCircle className="w-3.5 h-3.5 skew-tag-inner" />
            <span className="skew-tag-inner">EVERYTHING YOU NEED TO KNOW</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-black italic tracking-tight uppercase text-white leading-none">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Got questions about sizing, printing cuts, demo checkout, or campus pickup? We got you covered.
          </p>
        </div>

        {/* Numbered Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border-2 transition-all duration-200 ${
                  isOpen
                    ? 'border-pink-hot bg-[#13131F] shadow-hard-pink'
                    : 'border-[#232338] bg-[#0E0E18] hover:border-zinc-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`font-display text-2xl sm:text-3xl font-black italic tracking-wider leading-none transition-colors ${
                        isOpen ? 'text-pink-hot' : 'text-zinc-500'
                      }`}
                    >
                      {faq.number}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl text-white italic tracking-wider leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Plus/Minus Rotating Icon */}
                  <div
                    className={`w-10 h-10 shrink-0 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'bg-pink-hot text-black rotate-45' : 'bg-[#1A1A2E] text-zinc-400'
                    }`}
                  >
                    <Plus className="w-5 h-5 font-bold" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-[#1F1F32] ml-12 sm:ml-16">
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
