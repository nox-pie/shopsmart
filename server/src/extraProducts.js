/**
 * Synthetic archive-line products (ids s1…s30) — same data shape as core catalog.
 * Kept in sync with client/src/data/extraProducts.js
 */
const IMAGES = [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1479064555552-3ef5479ace8d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=800'
];

const PREFIX = [
  'Nocturne',
  'Vertex',
  'Lumen',
  'Arc',
  'Mono',
  'Stratum',
  'Helix',
  'Cipher',
  'Pavilion',
  'Rail'
];
const SUFFIX = [
  'Merino Crew',
  'Compact Tote',
  'Field Shell',
  'Rib Knit',
  'Travel Wrap',
  'Oxford Shirt',
  'Wool Vest',
  'City Short',
  'Cashmere Beanie',
  'Utility Belt',
  'Linen Blazer',
  'Tech Parka',
  'Silk Scarf',
  'Leather Pouch',
  'Running Crew',
  'Studio Hoodie',
  'Tailored Trouser',
  'Modular Gilet',
  'Weekend Dress',
  'Thermal Sock'
];

function build() {
  return Array.from({ length: 30 }, (_, i) => {
    const category = i % 4 === 0 ? 'Limited' : 'Essential';
    const price = 52 + ((i * 17) % 228);
    const name = `${PREFIX[i % PREFIX.length]} ${SUFFIX[i % SUFFIX.length]}`;
    return {
      id: `s${i + 1}`,
      name,
      price,
      category,
      description: `${name} — archive-line piece with the same quiet tailoring and material discipline as our main collection. Designed for layering, travel, and long-wear comfort.`,
      image: IMAGES[i % IMAGES.length]
    };
  });
}

module.exports = { EXTRA_PRODUCTS: build() };
