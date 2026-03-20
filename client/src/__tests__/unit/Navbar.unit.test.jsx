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

  it('renders "About" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /^About$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders "Blog" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /^Blog$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog');
  });

  it('renders "FAQ" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /^FAQ$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/faq');
  });

  it('renders "Collection" nav link with correct href', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /^Collection$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/collection');
  });

  it('renders cart icon link pointing to "/cart"', () => {
    renderNavbar();
    const cartLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/cart');
    expect(cartLink).toBeInTheDocument();
  });

  it('renders profile icon link pointing to "/profile"', () => {
    renderNavbar();
    const profileLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/profile');
    expect(profileLink).toBeInTheDocument();
  });
});
