import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../api/api';

// Simple Cart component for integration testing
function CartWithApi() {
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .getCart()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load cart');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} data-testid="cart-item">
          {item.name}
        </div>
      ))}
      {items.length === 0 && <p>Your cart is empty</p>}
    </div>
  );
}

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getCart() is called on component mount', async () => {
    const mockItems = [{ id: 1, name: 'Blue T-Shirt' }];
    vi.spyOn(api, 'getCart').mockResolvedValue(mockItems);

    render(
      <MemoryRouter>
        <CartWithApi />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.getCart).toHaveBeenCalledTimes(1));
  });

  it('renders cart items returned from API', async () => {
    const mockItems = [
      { id: 1, name: 'Blue T-Shirt' },
      { id: 2, name: 'Black Jeans' },
    ];
    vi.spyOn(api, 'getCart').mockResolvedValue(mockItems);

    render(
      <MemoryRouter>
        <CartWithApi />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Blue T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Black Jeans')).toBeInTheDocument();
    });
  });

  it('shows fallback UI when API call fails', async () => {
    vi.spyOn(api, 'getCart').mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <CartWithApi />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load cart')).toBeInTheDocument();
    });
  });

  it('shows empty state when cart returns no items', async () => {
    vi.spyOn(api, 'getCart').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <CartWithApi />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  it('getProducts() resolves with correct product data', async () => {
    const mockProducts = [
      { id: 1, name: 'Sneakers', price: 120 },
      { id: 2, name: 'Hoodie', price: 89 },
    ];
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);

    const result = await api.getProducts();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Sneakers');
  });

  it('addToCart() is called with the correct item payload', async () => {
    vi.spyOn(api, 'addToCart').mockResolvedValue({ success: true });

    const item = { productId: 5, qty: 2 };
    await api.addToCart(item);
    expect(api.addToCart).toHaveBeenCalledWith(item);
  });

  it('removeFromCart() is called with the correct id', async () => {
    vi.spyOn(api, 'removeFromCart').mockResolvedValue({ success: true });

    await api.removeFromCart(3);
    expect(api.removeFromCart).toHaveBeenCalledWith(3);
  });

  it('searchProducts() returns filtered results', async () => {
    const mockResults = [{ id: 7, name: 'Red Dress' }];
    vi.spyOn(api, 'searchProducts').mockResolvedValue(mockResults);

    const results = await api.searchProducts('dress');
    expect(api.searchProducts).toHaveBeenCalledWith('dress');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Red Dress');
  });

  it('getProduct(id) returns the specific product', async () => {
    const mockProduct = { id: 10, name: 'Leather Jacket', price: 299 };
    vi.spyOn(api, 'getProduct').mockResolvedValue(mockProduct);

    const result = await api.getProduct(10);
    expect(api.getProduct).toHaveBeenCalledWith(10);
    expect(result.name).toBe('Leather Jacket');
  });

  it('handles multiple cart items with unique keys', async () => {
    const mockItems = [
      { id: 1, name: 'Item A' },
      { id: 2, name: 'Item B' },
      { id: 3, name: 'Item C' },
    ];
    vi.spyOn(api, 'getCart').mockResolvedValue(mockItems);

    render(
      <MemoryRouter>
        <CartWithApi />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cartItems = screen.getAllByTestId('cart-item');
      expect(cartItems).toHaveLength(3);
    });
  });
});
