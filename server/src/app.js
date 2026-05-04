const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { PRODUCTS } = require('./catalog');

const app = express();

app.use(cors());
app.use(express.json());

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function filterProducts(search) {
  if (!search || !String(search).trim()) {
    return PRODUCTS;
  }
  const term = String(search).toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term))
  );
}

function recalcTotal(cart) {
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

const cart = { items: [], total: 0 };

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/products', (req, res) => {
  const search = req.query.search;
  res.json(filterProducts(search));
});

app.get('/api/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/cart', (req, res) => {
  res.json({
    ...cart,
    items: cart.items.map((i) => ({ ...i, product: { ...i.product } }))
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  const product = findProduct(productId);
  if (!product) {
    return res.status(400).json({ error: 'Invalid productId' });
  }
  const raw = Number(quantity);
  const qty = Number.isFinite(raw) ? Math.trunc(raw) : 1;
  const existing = cart.items.find((i) => i.product.id === productId);
  if (existing) {
    existing.quantity += qty;
    if (existing.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.id !== productId);
    }
  } else if (qty > 0) {
    cart.items.push({ product: { ...product }, quantity: qty });
  }
  recalcTotal(cart);
  res.json({
    ...cart,
    items: cart.items.map((i) => ({ ...i, product: { ...i.product } }))
  });
});

app.delete('/api/cart/:productId', (req, res) => {
  cart.items = cart.items.filter((i) => i.product.id !== req.params.productId);
  recalcTotal(cart);
  res.json({
    ...cart,
    items: cart.items.map((i) => ({ ...i, product: { ...i.product } }))
  });
});

function resolveStaticDir() {
  const fromEnv = process.env.SHOPSMART_STATIC_DIR;
  if (fromEnv) {
    const resolved = path.resolve(fromEnv);
    if (fs.existsSync(path.join(resolved, 'index.html'))) {
      return resolved;
    }
  }
  const fallback = path.join(__dirname, '..', 'static');
  if (fs.existsSync(path.join(fallback, 'index.html'))) {
    return fallback;
  }
  return null;
}

const staticDir = resolveStaticDir();
if (staticDir) {
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('ShopSmart Backend Service');
  });
}

module.exports = app;
