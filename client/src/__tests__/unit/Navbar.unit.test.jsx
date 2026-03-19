import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from '../../components/Navbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar — Unit Tests', () => {
  it('renders SHOPSMART logo text', () => {
    renderNavbar();
    expect(screen.getByText('SHOPSMART')).toBeInTheDocument();
  });

  it('logo links to the home route "/"', () => {
    renderNavbar();
    const logo = screen.getByText('SHOPSMART').closest('a');
    expect(logo).toHaveAttribute('href', '/');
  });

  it('renders "About Us" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /about us/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders "Blog" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /blog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog');
  });

  it('renders "FAQ" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /faq/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/faq');
  });

  it('renders search input with placeholder "Clothing"', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Clothing');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders cart icon link pointing to "/cart"', () => {
    renderNavbar();
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders cart badge with count "2"', () => {
    renderNavbar();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders profile icon link pointing to "/profile"', () => {
    renderNavbar();
    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('renders all 6 category navigation pills', () => {
    renderNavbar();
    const categories = [
      'New Arrivals',
      'Sales',
      'Men',
      'Women',
      "Kid's",
      'Brand',
    ];
    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });
});
