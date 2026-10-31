import React from 'react';
import Hero from '@/components/home/Hero';
import StatsStrip from '@/components/home/StatsStrip';
import DepartmentSlider from '@/components/home/DepartmentSlider';
import Marquee from '@/components/home/Marquee';
import Highlights from '@/components/home/Highlights';
import HowItWorks from '@/components/home/HowItWorks';
import Announcements from '@/components/home/Announcements';
import FAQSection from '@/components/home/FAQSection';
import FinalCTA from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO */}
      <Hero />

      {/* 2. STATS STRIP */}
      <StatsStrip />

      {/* 3. DEPARTMENT SLIDER */}
      <DepartmentSlider />

      {/* 4. MARQUEE */}
      <Marquee />

      {/* 5. HIGHLIGHTS */}
      <Highlights />

      {/* 6. HOW IT WORKS */}
      <HowItWorks />

      {/* 7. ANNOUNCEMENTS / NEWS */}
      <Announcements />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. FINAL CTA */}
      <FinalCTA />
    </div>
  );
}

