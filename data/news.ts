export interface NewsItem {
  id: string;
  label: 'ALERT' | 'UPDATE' | 'EVENT' | 'DROP';
  date: string;
  title: string;
  summary: string;
  badgeColor?: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    label: 'DROP',
    date: 'OCT 31, 2026',
    title: 'OFFICIAL 2026 DEPARTMENT JERSEY LINEUP REVEALED IN 3D',
    summary: 'All 8 engineering branches now live with real-time 3D rotation, custom name rendering, and campus collection passes.',
  },
  {
    id: 'news-2',
    label: 'ALERT',
    date: 'OCT 28, 2026',
    title: 'EARLY BIRD REGISTRATION PERK: FREE CUSTOM GAMER TAG PRINTING',
    summary: 'First 200 orders across all departments get complimentary metallic foil sleeve badges and free custom back typography.',
  },
  {
    id: 'news-3',
    label: 'EVENT',
    date: 'OCT 24, 2026',
    title: 'COLLEGE RIVALS ESPORTS TOURNAMENT DATES ANNOUNCED',
    summary: 'The inter-department championships kick off Nov 20th. Jerseys are mandatory for all team captains and roster participants.',
  },
  {
    id: 'news-4',
    label: 'UPDATE',
    date: 'OCT 19, 2026',
    title: 'FABRIC SPECIFICATION: 220 GSM BREATHABLE CYBER-DRY MESH',
    summary: 'Ultra-light sweat-wicking poly-spandex blend engineered for high-intensity gaming stages and campus athletics.',
  },
];

