// API layer for ShopSmart — fetch wrapper for backend communication

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// --- Premium Mock Demo Data ---
// In a demo presentation, an empty backend makes the layout look broken.
// We intercept empty responses and inject this high-fidelity data.
const mockProducts = [
  {
    id: 'm1',
    name: "Obsidian Heavyweight Hoodie",
    price: 110.00,
    category: "Limited",
    description: "Constructed from 450gsm organic cotton, featuring a relaxed drop-shoulder fit and our signature anti-pill finish.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm2',
    name: "Essence Ribbed Beanie",
    price: 45.00,
    category: "Essential",
    description: "A staple cold-weather accessory knit from 100% fine merino wool. Breathable yet exceptionally warm.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm3',
    name: "Aero Technical Jacket",
    price: 245.00,
    category: "Limited",
    description: "Engineered for urban unpredictability. Features a seam-sealed waterproof shell and modular zip vents.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm4',
    name: "Meridian Cargo Trousers",
    price: 130.00,
    category: "Essential",
    description: "Utilitarian aesthetics meet ergonomic tailoring. Crafted with a lightweight ripstop cotton blend.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm5',
    name: "Oasis Linen Overshirt",
    price: 85.00,
    category: "Essential",
    description: "The definitive layering piece. Pure Belgian linen washed for immediate softness and a perfect drape.",
    image: "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm6',
    name: "Elevate Minimal Sneaker",
    price: 165.00,
    category: "Essential",
    description: "Handcrafted in Portugal using full-grain Italian leather mounted on a custom prolonged cupsole.",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm7',
    name: "Quantum Wool Topcoat",
    price: 320.00,
    category: "Limited",
    description: "The peak of sartorial outerwear. Cut from premium Italian wool cashmere blend with dramatic lapels.",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm8',
    name: "Solstice Selvedge Denim",
    price: 145.00,
    category: "Essential",
    description: "13oz Japanese selvedge denim woven on vintage shuttle looms. Offers incredible fading character over time.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm9',
    name: "Velocity Mock Neck",
    price: 75.00,
    category: "Essential",
    description: "A refined take on sportswear. Features a subtle high-neck silhouette cut from brushed terry cloth.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm10',
    name: "Element Recycled Shell",
    price: 195.00,
    category: "Limited",
    description: "100% post-consumer recycled nylon treated with eco-fluorine waterproof finishes. Completely transparent production.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm11',
    name: "Atlas Leather Chelsea",
    price: 210.00,
    category: "Essential",
    description: "Seamless one-piece calfskin construction resting on a Goodyear welted micro-lug sole.",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm12',
    name: "Paradigm Cashmere Scarf",
    price: 95.00,
    category: "Limited",
    description: "Woven in Scotland using grade-A cashmere fibers. Generous proportions for maximum warmth and draping depth.",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800"
  }
];

// --- Fallback Handlers ---

export async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || !data[0].image) return mockProducts;
    return data;
  } catch (error) {
    return mockProducts;
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    if (!data.image) throw new Error('No image, fallback to mock');
    return data;
  } catch (error) {
    // Check mock data
    const mock = mockProducts.find((p) => p.id === id);
    if (mock) return mock;
    throw error;
  }
}

// Global variable for local dummy cart state mirroring
let localCart = { items: [], total: 0 };

export async function getCart() {
  try {
    const res = await fetch(`${BASE_URL}/cart`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    if (!data || (!data.items && localCart.items.length > 0)) {
        return localCart;
    }
    return data;
  } catch (error) {
    return localCart;
  }
}

export async function addToCart(productId, quantity = 1) {
  try {
     // Fetch logic intended for actual backend
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) throw new Error('API down');
    return res.json();
  } catch(error) {
    // Populate local fallback cart
    const prod = mockProducts.find(p => p.id === productId);
    if (prod) {
        const existing = localCart.items.find(i => i.product.id === productId);
        if (existing) { existing.quantity += quantity; }
        else { localCart.items.push({ product: prod, quantity }); }
        
        localCart.total = localCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
    return localCart;
  }
}

export async function removeFromCart(id) {
  try {
    const res = await fetch(`${BASE_URL}/cart/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('API down');
    return res.json();
  } catch(error) {
    localCart.items = localCart.items.filter(i => i.product.id !== id);
    localCart.total = localCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return localCart;
  }
}

export async function searchProducts(query) {
  try {
    const res = await fetch(
      `${BASE_URL}/products?search=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error('API down');
    const data = await res.json();
    return data;
  } catch(error) {
    const term = query.toLowerCase();
    return mockProducts.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }
}
