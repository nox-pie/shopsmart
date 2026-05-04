import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Navbar from '../../components/Navbar';

vi.mock('../../api/api', () => ({
  getCart: vi.fn(() =>
    Promise.resolve({
      items: [{ product: { id: 'm1', price: 55, name: 'Test' }, quantity: 3 }],
      total: 165,
    })
  ),
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar Integration Tests', () => {
  it('About link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /^About$/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('Blog link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /^Blog$/i })).toHaveAttribute(
      'href',
      '/blog'
    );
  });

  it('Cart icon link has correct href for routing', () => {
    renderNavbar();
    const cartLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '/cart');
    expect(cartLink).toBeInTheDocument();
  });

  it('Profile icon link has correct href for routing', () => {
    renderNavbar();
    const profileLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '/profile');
    expect(profileLink).toBeInTheDocument();
  });

  it('Collection link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /^Collection$/i })).toHaveAttribute(
      'href',
      '/collection'
    );
  });

  it('Cart badge displays correct item count', async () => {
    renderNavbar();
    await waitFor(() => {
      expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3');
    });
  });

  it('Logo link sits inside the nav element', () => {
    renderNavbar();
    const logo = screen.getByText('SHOPSMART');
    expect(logo.closest('nav')).toBeInTheDocument();
  });
});
