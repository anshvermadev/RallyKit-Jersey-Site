export const SITE_CONFIG = {
  name: 'JERSEY HQ',
  shortName: 'JHQ',
  tagline: 'WEAR YOUR DEPARTMENT WITH PRIDE',
  description: 'The official interactive 3D jersey portal for collegiate esports and department identity.',
  batch: 'BATCH 2026',
  collegeName: 'CAMPUS LEAGUE 2026',
  navLinks: [
    { label: 'HOME', href: '/' },
    { label: 'JERSEYS', href: '/jerseys' },
    { label: 'HOW IT WORKS', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'MY ORDER', href: '/my-order' },
  ],
  adminPasscode: process.env.ADMIN_PASSCODE || 'admin123',
  contactEmail: 'support@jerseyhq.campus',
  collectionVenue: 'Student Activity Center, Counter 4',
  demoNotice: 'Demo build – no real money is charged. Authentic campus registration simulation.',
};
