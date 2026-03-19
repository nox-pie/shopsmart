import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addToCart,
  getCart,
  getProduct,
  getProducts,
  removeFromCart,
  searchProducts,
} from '../../api/api';

const mockFetch = (data, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('API — Unit Tests (mocked fetch)', () => {
  it('getProducts() calls GET /api/products', async () => {
    const mockData = [{ id: 1, name: 'T-Shirt' }];
    mockFetch(mockData);
    const result = await getProducts();
    expect(global.fetch).toHaveBeenCalledWith('/api/products');
    expect(result).toEqual(mockData);
  });

  it('getProducts() returns parsed JSON array', async () => {
    const mockData = [
      { id: 1, name: 'Dress' },
      { id: 2, name: 'Jeans' },
    ];
    mockFetch(mockData);
    const result = await getProducts();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Dress');
  });

  it('getProduct(id) calls GET /api/products/:id', async () => {
    const mockData = { id: 42, name: 'Sneakers' };
    mockFetch(mockData);
    const result = await getProduct(42);
    expect(global.fetch).toHaveBeenCalledWith('/api/products/42');
    expect(result.id).toBe(42);
  });

  it('getCart() calls GET /api/cart', async () => {
    const mockData = [{ id: 1, productId: 5, qty: 2 }];
    mockFetch(mockData);
    const result = await getCart();
    expect(global.fetch).toHaveBeenCalledWith('/api/cart');
    expect(result).toEqual(mockData);
  });

  it('addToCart(item) sends POST to /api/cart with correct body', async () => {
    const item = { productId: 3, qty: 1 };
    mockFetch({ success: true });
    await addToCart(item);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(item),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('removeFromCart(id) sends DELETE to /api/cart/:id', async () => {
    mockFetch({ success: true });
    await removeFromCart(7);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/cart/7',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('searchProducts(query) encodes query in URL', async () => {
    mockFetch([{ id: 1, name: 'Blue Dress' }]);
    await searchProducts('blue dress');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products?search=blue%20dress'
    );
  });
});
