export interface Department {
  slug: 'cse' | 'csbs' | 'it' | 'aiml' | 'extc';
  shortName: string;
  fullName: string;
  name: string; // compatibility alias
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string; // high contrast text for name/number
  collarColor: string;
  sleeveColor: string;
  sleeveColors: string[];
  collarColors: string[];
  basePrice: number;
  badgeText: string;
  batch: string;
  availableSizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | '2XL')[];
  frontImage: string;
  backImage: string;
  logoPath: string;
  modelUrl: string;
  stats: {
    registeredCount: number;
    rating: number;
  };
}

export const BASE_PRICE = 599;

export const DEPARTMENTS: Department[] = [
  {
    slug: 'cse',
    shortName: 'CSE',
    fullName: 'Computer Science and Engineering',
    name: 'Computer Science and Engineering',
    tagline: 'MIDNIGHT MATRIX. DOMINATE THE CODE ARENA.',
    description: 'Deep Navy Blue base with brush camouflage texture, crisp white shoulder stripes, and tournament crest.',
    primaryColor: '#141E34', // Navy Blue sampled from cse-front.png
    secondaryColor: '#FFFFFF', // White stripes & accents
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    collarColor: '#141E34',
    sleeveColor: '#141E34',
    sleeveColors: ['#141E34', '#FFFFFF'],
    collarColors: ['#FFFFFF', '#141E34'],
    basePrice: BASE_PRICE,
    badgeText: 'NAVY BLUE',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    frontImage: '/jerseys/cse-front.png',
    backImage: '/jerseys/cse-back.png',
    logoPath: '/logos/cse.svg',
    modelUrl: '/models/cse.glb',
    stats: {
      registeredCount: 194,
      rating: 4.9,
    },
  },
  {
    slug: 'csbs',
    shortName: 'CSBS',
    fullName: 'Computer Science and Business Systems',
    name: 'Computer Science and Business Systems',
    tagline: 'STEALTH LOGIC. BUSINESS-DRIVEN EXECUTION.',
    description: 'Stealth Carbon Black body featuring dynamic charcoal camouflage textures and bold white trim contouring.',
    primaryColor: '#18181A', // Carbon Black sampled from csbs-front.png
    secondaryColor: '#FFFFFF', // White stripes & accents
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    collarColor: '#18181A',
    sleeveColor: '#18181A',
    sleeveColors: ['#18181A', '#FFFFFF'],
    collarColors: ['#FFFFFF', '#18181A'],
    basePrice: BASE_PRICE,
    badgeText: 'BLACK',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    frontImage: '/jerseys/csbs-front.png',
    backImage: '/jerseys/csbs-back.png',
    logoPath: '/logos/cse.svg',
    modelUrl: '/models/csbs.glb',
    stats: {
      registeredCount: 138,
      rating: 4.8,
    },
  },
  {
    slug: 'it',
    shortName: 'IT',
    fullName: 'Information Technology',
    name: 'Information Technology',
    tagline: 'CRIMSON VOLT. MAXIMUM BANDWIDTH & GOLD GLORY.',
    description: 'Rich Deep Crimson Red torso with darker brush camo textures, complemented by metallic gold shoulder stripes.',
    primaryColor: '#630E1A', // Deep Maroon Red sampled from it-front.png
    secondaryColor: '#E5C158', // Metallic Gold sampled from it-front.png
    accentColor: '#FFD700',
    textColor: '#E5C158',
    collarColor: '#630E1A',
    sleeveColor: '#630E1A',
    sleeveColors: ['#630E1A', '#E5C158'],
    collarColors: ['#E5C158', '#630E1A'],
    basePrice: BASE_PRICE,
    badgeText: 'RED',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    frontImage: '/jerseys/it-front.png',
    backImage: '/jerseys/it-back.png',
    logoPath: '/logos/it.svg',
    modelUrl: '/models/it.glb',
    stats: {
      registeredCount: 162,
      rating: 4.9,
    },
  },
  {
    slug: 'aiml',
    shortName: 'AIML',
    fullName: 'Artificial Intelligence and Machine Learning',
    name: 'Artificial Intelligence and Machine Learning',
    tagline: 'BLIZZARD APEX. PREDICT AND CONQUER.',
    description: 'Pristine Tech White athletic body with light gray camouflage texturing, framed by contrasting deep navy stripes.',
    primaryColor: '#F4F5F9', // White sampled from aiml-front.png
    secondaryColor: '#0F1D38', // Deep Navy Blue sampled from aiml-front.png
    accentColor: '#0F1D38',
    textColor: '#0F1D38', // Dark text for contrast on white jersey
    collarColor: '#0F1D38',
    sleeveColor: '#F4F5F9',
    sleeveColors: ['#F4F5F9', '#0F1D38'],
    collarColors: ['#0F1D38', '#F4F5F9'],
    basePrice: BASE_PRICE,
    badgeText: 'WHITE',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    frontImage: '/jerseys/aiml-front.png',
    backImage: '/jerseys/aiml-back.png',
    logoPath: '/logos/aiml.svg',
    modelUrl: '/models/aiml.glb',
    stats: {
      registeredCount: 175,
      rating: 4.9,
    },
  },
  {
    slug: 'extc',
    shortName: 'EXTC',
    fullName: 'Electronics and Telecommunication Engineering',
    name: 'Electronics and Telecommunication Engineering',
    tagline: 'TACTICAL RADAR. HIGH FREQUENCY SUPREMACY.',
    description: 'Tactical Olive Green body with dark green brush camo texture, white shoulder stripes, and white side contour panels.',
    primaryColor: '#383D2A', // Tactical Olive Green sampled from extc-front.png
    secondaryColor: '#FFFFFF', // White stripes & side panels
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    collarColor: '#383D2A',
    sleeveColor: '#383D2A',
    sleeveColors: ['#383D2A', '#FFFFFF'],
    collarColors: ['#FFFFFF', '#383D2A'],
    basePrice: BASE_PRICE,
    badgeText: 'OLIVE GREEN',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    frontImage: '/jerseys/extc-front.png',
    backImage: '/jerseys/extc-back.png',
    logoPath: '/logos/ece.svg',
    modelUrl: '/models/extc.glb',
    stats: {
      registeredCount: 122,
      rating: 4.8,
    },
  },
];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}
