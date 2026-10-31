import React from 'react';
import Link from 'next/link';
import { Flame, Instagram, Twitter, Youtube, ShieldAlert, Award } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="w-full bg-[#07070C] border-t-2 border-[#232338] pt-16 pb-12 relative overflow-hidden">
      {/* Decorative background grid and slant divider */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FF2E93_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#1E1E30]">
          {/* Col 1: Brand & Blurb */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-pink-hot flex items-center justify-center skew-tag shadow-hard-yellow">
                <Flame className="w-6 h-6 text-black skew-tag-inner fill-black" />
              </div>
              <span className="font-display text-3xl font-black italic tracking-wider text-white">
                {SITE_CONFIG.name.split(' ')[0]}{' '}
                <span className="text-pink-hot">{SITE_CONFIG.name.split(' ')[1] || 'HQ'}</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              The premier collegiate gaming and department identity kit portal. Custom 3D interactive viewer, 
              precision sublimation print specs, and instant campus order passes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#socials"
                className="w-10 h-10 bg-[#13131F] border border-[#232338] flex items-center justify-center text-zinc-400 hover:text-pink-hot hover:border-pink-hot transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#socials"
                className="w-10 h-10 bg-[#13131F] border border-[#232338] flex items-center justify-center text-zinc-400 hover:text-yellow-electric hover:border-yellow-electric transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#socials"
                className="w-10 h-10 bg-[#13131F] border border-[#232338] flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-widest text-yellow-electric uppercase italic">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-pink-hot transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link href="/jerseys" className="text-zinc-400 hover:text-pink-hot transition-colors">
                  All Department Jerseys
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-zinc-400 hover:text-pink-hot transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/my-order" className="text-zinc-400 hover:text-pink-hot transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-400 hover:text-yellow-electric transition-colors">
                  Admin Demo Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collection Venue & Batch */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-widest text-pink-hot uppercase italic">
              COLLECTION INFO
            </h4>
            <div className="text-sm text-zinc-400 space-y-2">
              <p className="flex items-start gap-2">
                <Award className="w-4 h-4 text-yellow-electric shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.collectionVenue}</span>
              </p>
              <p className="text-xs text-zinc-500">
                Show digital QR code received in order confirmation for instant counter verification.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-[#1B1B2C] text-yellow-electric border border-yellow-electric/30 px-3 py-1 text-xs font-mono font-bold uppercase">
                {SITE_CONFIG.batch} OFFICIAL
              </span>
            </div>
          </div>
        </div>

        {/* Bottom strip with Demo Notice & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-yellow-electric/90">
            <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-electric" />
            <span>
              <strong>DEMO ONLY:</strong> No actual monetary transaction takes place. Purely simulated for campus preview.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Sizing FAQ</span>
            <span className="text-zinc-600">© 2026 {SITE_CONFIG.name}.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

