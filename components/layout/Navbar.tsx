'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Flame, Shield, ShoppingBag } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B12]/95 backdrop-blur-md border-b-2 border-[#232338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 bg-pink-hot flex items-center justify-center skew-tag shadow-hard-yellow group-hover:bg-yellow-electric transition-colors">
              <Flame className="w-6 h-6 text-black skew-tag-inner fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl font-black italic tracking-wider text-white leading-none">
                {SITE_CONFIG.name.split(' ')[0]}{' '}
                <span className="text-pink-hot group-hover:text-yellow-electric transition-colors">
                  {SITE_CONFIG.name.split(' ')[1] || 'HQ'}
                </span>
              </span>
              <span className="text-[9px] tracking-widest text-zinc-400 font-bold uppercase">
                {SITE_CONFIG.collegeName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {SITE_CONFIG.navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-display text-lg tracking-wider transition-all duration-150 relative py-1 ${
                    isActive
                      ? 'text-yellow-electric font-bold'
                      : 'text-zinc-300 hover:text-pink-hot'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-electric shadow-[0_0_8px_#FFE600]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs uppercase font-bold text-zinc-400 hover:text-yellow-electric transition-colors px-2 py-1 flex items-center gap-1 border border-zinc-700/50 rounded"
              title="Demo Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            <Link
              href="/jerseys"
              className="btn-hard-pink skew-tag px-6 py-2.5 rounded-none flex items-center gap-2 group"
            >
              <span className="skew-tag-inner font-display text-base tracking-wider uppercase flex items-center gap-2 text-black">
                <ShoppingBag className="w-4 h-4 fill-black" />
                GET YOUR JERSEY
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/jerseys"
              className="btn-hard-pink text-xs px-3 py-1.5 skew-tag uppercase font-bold text-black"
            >
              <span className="skew-tag-inner">ORDER</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-pink-hot focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[108px] bg-[#0B0B12]/98 backdrop-blur-xl z-50 flex flex-col justify-between p-6 md:hidden border-t-2 border-pink-hot"
          >
            <div className="flex flex-col gap-6 pt-4">
              {SITE_CONFIG.navLinks.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="font-display text-3xl italic tracking-wider text-white hover:text-pink-hot block border-b border-zinc-800 pb-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="font-display text-xl text-yellow-electric flex items-center gap-2 pt-2"
                >
                  <Shield className="w-5 h-5" /> ADMIN DEMO PANEL
                </Link>
              </motion.div>
            </div>

            <div className="pb-8 flex flex-col gap-4">
              <Link
                href="/jerseys"
                onClick={closeMenu}
                className="btn-hard-pink w-full py-4 text-center font-display text-xl uppercase tracking-wider block"
              >
                BROWSE 8+ DEPARTMENTS
              </Link>
              <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-wider">
                {SITE_CONFIG.demoNotice}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
