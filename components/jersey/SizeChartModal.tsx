'use client';

import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: string;
  onSelectSize: (size: any) => void;
}

const SIZE_TABLE = [
  { size: 'XS', chestInches: '34 - 36', lengthInches: '26', chestCm: '86 - 91', lengthCm: '66' },
  { size: 'S', chestInches: '36 - 38', lengthInches: '27', chestCm: '91 - 96', lengthCm: '68' },
  { size: 'M', chestInches: '38 - 40', lengthInches: '28', chestCm: '96 - 101', lengthCm: '71' },
  { size: 'L', chestInches: '40 - 42', lengthInches: '29', chestCm: '101 - 106', lengthCm: '74' },
  { size: 'XL', chestInches: '42 - 44', lengthInches: '30', chestCm: '106 - 112', lengthCm: '76' },
  { size: '2XL', chestInches: '44 - 46', lengthInches: '31', chestCm: '112 - 117', lengthCm: '79' },
];

export default function SizeChartModal({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
}: SizeChartModalProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#13131F] border-2 border-pink-hot p-6 md:p-8 shadow-hard-pink z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232338] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-electric flex items-center justify-center skew-tag">
                  <Ruler className="w-5 h-5 text-black skew-tag-inner" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white italic tracking-wider">
                    OFFICIAL FIT & SIZE GUIDE
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Engineered for athletic performance & collegiate gaming stages
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-pink-hot transition-colors"
                aria-label="Close Size Chart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center justify-end mb-4 gap-2">
              <span className="text-xs text-zinc-400 font-bold uppercase mr-1">MEASUREMENT:</span>
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                  unit === 'inches'
                    ? 'bg-pink-hot text-black shadow-hard-yellow'
                    : 'bg-[#1B1B2C] text-zinc-400 hover:text-white'
                }`}
              >
                INCHES (IN)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                  unit === 'cm'
                    ? 'bg-pink-hot text-black shadow-hard-yellow'
                    : 'bg-[#1B1B2C] text-zinc-400 hover:text-white'
                }`}
              >
                CENTIMETERS (CM)
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#232338] mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1A1A2E] text-yellow-electric uppercase font-display text-base tracking-wider border-b border-[#232338]">
                  <tr>
                    <th className="py-3 px-4">SIZE</th>
                    <th className="py-3 px-4">CHEST CIRCUMFERENCE</th>
                    <th className="py-3 px-4">BODY LENGTH</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232338] font-mono text-xs">
                  {SIZE_TABLE.map((row) => {
                    const isSelected = selectedSize === row.size;
                    return (
                      <tr
                        key={row.size}
                        className={`transition-colors ${
                          isSelected ? 'bg-pink-hot/15 text-pink-hot font-bold' : 'hover:bg-[#1B1B2C]'
                        }`}
                      >
                        <td className="py-3 px-4 font-display text-lg text-white font-bold italic">
                          {row.size}
                        </td>
                        <td className="py-3 px-4">
                          {unit === 'inches' ? row.chestInches + ' in' : row.chestCm + ' cm'}
                        </td>
                        <td className="py-3 px-4">
                          {unit === 'inches' ? row.lengthInches + ' in' : row.lengthCm + ' cm'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              onSelectSize(row.size);
                              onClose();
                            }}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                              isSelected
                                ? 'bg-pink-hot text-black'
                                : 'bg-transparent border border-zinc-600 text-zinc-300 hover:border-yellow-electric hover:text-yellow-electric'
                            }`}
                          >
                            {isSelected ? 'SELECTED' : 'SELECT'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pro-Tip Box */}
            <div className="bg-[#1B1B2C] border-l-4 border-yellow-electric p-4 text-xs text-zinc-300 space-y-1">
              <p className="font-bold text-yellow-electric uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> FIT ADVICE:
              </p>
              <p>
                Jerseys feature a tailored athletic slim-straight cut. For an oversized collegiate streetwear fit, we recommend selecting <strong>one size up</strong> from your standard T-shirt size.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

