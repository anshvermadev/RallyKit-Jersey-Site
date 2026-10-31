import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/lib/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: ['college jersey', '3d jersey viewer', 'department jerseys', 'campus esports', 'student merchandise'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased min-h-screen flex flex-col selection:bg-pink-hot selection:text-black">
        {/* Top Demo Banner */}
        <div className="bg-gradient-to-r from-pink-hot via-yellow-electric to-pink-hot text-black text-[11px] font-bold py-1 px-4 text-center tracking-widest uppercase z-50">
          ⚡ {SITE_CONFIG.demoNotice} ⚡
        </div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
