import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from '../../components/Navbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar Integration Tests', () => {
  it('About Us link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('Blog link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute(
      'href',
      '/blog'
    );
  });

  it('Cart icon link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute(
      'href',
      '/cart'
    );
  });

  it('Profile icon link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute(
      'href',
      '/profile'
    );
  });

  it('Search input accepts typed text', async () => {
    renderNavbar();
    const searchInput = screen.getByPlaceholderText('Clothing');
    await userEvent.type(searchInput, 'jeans');
    expect(searchInput.value).toBe('jeans');
  });

  it('"Clothing" category pill links to /collections', () => {
    renderNavbar();
    const clothingLinks = screen.getAllByRole('link', { name: /clothing/i });
    expect(clothingLinks[0]).toHaveAttribute('href', '/collections');
  });

  it('"New Arrivals" pill links to /collections', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /new arrivals/i })).toHaveAttribute(
      'href',
      '/collections'
    );
  });

  it('"Sales" pill links to /collections', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /sales/i })).toHaveAttribute(
      'href',
      '/collections'
    );
  });

  it('Cart badge displays correct item count', () => {
    renderNavbar();
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('Logo link sits inside the nav element', () => {
    renderNavbar();
    const logo = screen.getByText('SHOPSMART');
    expect(logo.closest('nav')).toBeInTheDocument();
  });
});
