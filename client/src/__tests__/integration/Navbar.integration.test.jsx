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
    const cartLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/cart');
    expect(cartLink).toBeInTheDocument();
  });

  it('Profile icon link has correct href for routing', () => {
    renderNavbar();
    const profileLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/profile');
    expect(profileLink).toBeInTheDocument();
  });

  it('Collection link has correct href for routing', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /^Collection$/i })).toHaveAttribute(
      'href',
      '/collection'
    );
  });

  it('Cart badge displays correct item count', () => {
    renderNavbar();
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('Logo link sits inside the nav element', () => {
    renderNavbar();
    const logo = screen.getByText('SHOPSMART');
    expect(logo.closest('nav')).toBeInTheDocument();
  });
});
