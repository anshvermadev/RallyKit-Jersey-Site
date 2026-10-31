export interface Department {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sleeveColors: string[];
  collarColors: string[];
  basePrice: number;
  badgeText: string;
  batch: string;
  availableSizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL')[];
  logoPath: string;
  texturePath?: string;
  pattern: 'cyber-circuit' | 'speed-slash' | 'hex-matrix' | 'quantum-grid' | 'glitch-stripes' | 'heavy-mesh';
  stats: {
    registeredCount: number;
    rating: number;
  };
}

export const DEPARTMENTS: Department[] = [
  {
    slug: 'cse',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    tagline: 'BINARY BLOOD. CODE WARRIORS.',
    description: 'Forged with high-contrast cyber pink and electric cyan. Designed for algorithmic dominance and esports supremacy.',
    primaryColor: '#FF2E93', // Hot Pink
    secondaryColor: '#00F0FF', // Cyan
    accentColor: '#121226',
    sleeveColors: ['#00F0FF', '#FF2E93', '#121226', '#FFFFFF'],
    collarColors: ['#FFE600', '#FF2E93', '#000000'],
    basePrice: 599,
    badgeText: 'HOT PICK',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/cse.svg',
    pattern: 'cyber-circuit',
    stats: {
      registeredCount: 184,
      rating: 4.9,
    },
  },
  {
    slug: 'aiml',
    name: 'Artificial Intelligence & Data Science',
    shortName: 'AI & DS',
    tagline: 'NEURAL SUPREMACY. PREDICT THE WIN.',
    description: 'Electric yellow matrix slashes across deep cosmic indigo. Synthetic intelligence tailored for the campus apex.',
    primaryColor: '#8A2BE2', // Neon Violet
    secondaryColor: '#FFE600', // Electric Yellow
    accentColor: '#0A0A16',
    sleeveColors: ['#FFE600', '#8A2BE2', '#FFFFFF', '#14142B'],
    collarColors: ['#FFE600', '#8A2BE2', '#000000'],
    basePrice: 599,
    badgeText: 'TRENDING',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/aiml.svg',
    pattern: 'hex-matrix',
    stats: {
      registeredCount: 142,
      rating: 4.8,
    },
  },
  {
    slug: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    tagline: 'ZERO DOWNTIME. PURE BANDWIDTH.',
    description: 'High-octane neon cyan with hot pink accents and matrix energy. Engineered for network dominators.',
    primaryColor: '#00D2FF', // Vivid Cyan
    secondaryColor: '#FF2E93', // Pink
    accentColor: '#0B0D1B',
    sleeveColors: ['#FF2E93', '#00D2FF', '#FFFFFF', '#0B0D1B'],
    collarColors: ['#00D2FF', '#FF2E93', '#000000'],
    basePrice: 599,
    badgeText: 'CAMPUS HIT',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/it.svg',
    pattern: 'quantum-grid',
    stats: {
      registeredCount: 119,
      rating: 4.7,
    },
  },
  {
    slug: 'ece',
    name: 'Electronics & Communication',
    shortName: 'ECE',
    tagline: 'HIGH FREQUENCY. MAXIMUM VOLTAGE.',
    description: 'Blazing crimson volt combined with acid yellow-green waveforms. Built to transmit unstoppable energy.',
    primaryColor: '#FF1744', // Crimson Volt
    secondaryColor: '#CCFF00', // Acid Lime
    accentColor: '#1A0B10',
    sleeveColors: ['#CCFF00', '#FF1744', '#FFFFFF', '#1A0B10'],
    collarColors: ['#CCFF00', '#FF1744', '#000000'],
    basePrice: 599,
    badgeText: 'HIGH VOLT',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/ece.svg',
    pattern: 'speed-slash',
    stats: {
      registeredCount: 96,
      rating: 4.8,
    },
  },
  {
    slug: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'MECH',
    tagline: 'HEAVY TORQUE. UNBREAKABLE WILL.',
    description: 'Industrial cyber orange fused with volcanic yellow and titanium alloy accents. Pure raw horsepower.',
    primaryColor: '#FF6D00', // Vivid Orange
    secondaryColor: '#FFE600', // Electric Yellow
    accentColor: '#18120A',
    sleeveColors: ['#FFE600', '#FF6D00', '#2B2B36', '#FFFFFF'],
    collarColors: ['#FFE600', '#FF6D00', '#000000'],
    basePrice: 599,
    badgeText: 'POWERHOUSE',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/mech.svg',
    pattern: 'heavy-mesh',
    stats: {
      registeredCount: 135,
      rating: 4.9,
    },
  },
  {
    slug: 'civil',
    name: 'Civil Engineering',
    shortName: 'CIVIL',
    tagline: 'SOLID FOUNDATION. ARCHITECTS OF REALITY.',
    description: 'Hazard yellow warning graphics coupled with asphalt carbon blacks and structural grid lines.',
    primaryColor: '#FFE600', // High-vis Yellow
    secondaryColor: '#1E1E28', // Dark Carbon
    accentColor: '#FF2E93',
    sleeveColors: ['#1E1E28', '#FFE600', '#FFFFFF', '#FF2E93'],
    collarColors: ['#FFE600', '#1E1E28', '#FF2E93'],
    basePrice: 599,
    badgeText: 'TITAN',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/civil.svg',
    pattern: 'glitch-stripes',
    stats: {
      registeredCount: 88,
      rating: 4.6,
    },
  },
  {
    slug: 'eee',
    name: 'Electrical & Electronics',
    shortName: 'EEE',
    tagline: 'TESLA COILS & LIGHTNING STRIKES.',
    description: 'High voltage electric shock blue paired with flash white and neon yellow accents. Boundless currents.',
    primaryColor: '#0066FF', // Tesla Blue
    secondaryColor: '#FFE600', // Electric Yellow
    accentColor: '#091325',
    sleeveColors: ['#FFE600', '#0066FF', '#FFFFFF', '#091325'],
    collarColors: ['#FFE600', '#0066FF', '#000000'],
    basePrice: 599,
    badgeText: 'SURGE',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/eee.svg',
    pattern: 'speed-slash',
    stats: {
      registeredCount: 78,
      rating: 4.7,
    },
  },
  {
    slug: 'chem',
    name: 'Chemical Engineering',
    shortName: 'CHEM',
    tagline: 'CATALYST FOR CHAOS. MOLECULAR FUSION.',
    description: 'Toxic acid green with explosive hot pink reaction zones. Bold, volatile, and impossible to ignore.',
    primaryColor: '#00FF88', // Toxic Acid Green
    secondaryColor: '#FF2E93', // Hot Pink
    accentColor: '#0B1E14',
    sleeveColors: ['#FF2E93', '#00FF88', '#FFFFFF', '#0B1E14'],
    collarColors: ['#FF2E93', '#00FF88', '#000000'],
    basePrice: 599,
    badgeText: 'REACTION',
    batch: 'BATCH 2026',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    logoPath: '/logos/chem.svg',
    pattern: 'hex-matrix',
    stats: {
      registeredCount: 65,
      rating: 4.8,
    },
  },
];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}
