/** In-memory product catalog (aligned with client mock data for consistent IDs). */
const PRODUCTS = [
  {
    id: 'm1',
    name: 'Obsidian Heavyweight Hoodie',
    price: 110.0,
    category: 'Limited',
    description:
      'Constructed from 450gsm organic cotton, featuring a relaxed drop-shoulder fit and our signature anti-pill finish.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm2',
    name: 'Essence Ribbed Beanie',
    price: 45.0,
    category: 'Essential',
    description:
      'A staple cold-weather accessory knit from 100% fine merino wool. Breathable yet exceptionally warm.',
    image:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm3',
    name: 'Aero Technical Jacket',
    price: 245.0,
    category: 'Limited',
    description:
      'Engineered for urban unpredictability. Features a seam-sealed waterproof shell and modular zip vents.',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm4',
    name: 'Meridian Cargo Trousers',
    price: 130.0,
    category: 'Essential',
    description:
      'Utilitarian aesthetics meet ergonomic tailoring. Crafted with a lightweight ripstop cotton blend.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm5',
    name: 'Oasis Linen Overshirt',
    price: 85.0,
    category: 'Essential',
    description:
      'The definitive layering piece. Pure Belgian linen washed for immediate softness and a perfect drape.',
    image:
      'https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm6',
    name: 'Elevate Minimal Sneaker',
    price: 165.0,
    category: 'Essential',
    description:
      'Handcrafted in Portugal using full-grain Italian leather mounted on a custom prolonged cupsole.',
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm7',
    name: 'Quantum Wool Topcoat',
    price: 320.0,
    category: 'Limited',
    description:
      'The peak of sartorial outerwear. Cut from premium Italian wool cashmere blend with dramatic lapels.',
    image:
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm8',
    name: 'Solstice Selvedge Denim',
    price: 145.0,
    category: 'Essential',
    description:
      '13oz Japanese selvedge denim woven on vintage shuttle looms. Offers incredible fading character over time.',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm9',
    name: 'Velocity Mock Neck',
    price: 75.0,
    category: 'Essential',
    description:
      'A refined take on sportswear. Features a subtle high-neck silhouette cut from brushed terry cloth.',
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm10',
    name: 'Element Recycled Shell',
    price: 195.0,
    category: 'Limited',
    description:
      '100% post-consumer recycled nylon treated with eco-fluorine waterproof finishes. Completely transparent production.',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm11',
    name: 'Atlas Leather Chelsea',
    price: 210.0,
    category: 'Essential',
    description:
      'Seamless one-piece calfskin construction resting on a Goodyear welted micro-lug sole.',
    image:
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm12',
    name: 'Paradigm Cashmere Scarf',
    price: 95.0,
    category: 'Limited',
    description:
      'Woven in Scotland using grade-A cashmere fibers. Generous proportions for maximum warmth and draping depth.',
    image:
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'
  }
];

const { EXTRA_PRODUCTS } = require('./extraProducts');

module.exports = { PRODUCTS: [...PRODUCTS, ...EXTRA_PRODUCTS] };
