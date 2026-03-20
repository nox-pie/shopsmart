import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Hero from '../../components/Hero';

describe('Hero — Unit Tests', () => {
  const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);

  it('renders the main heading "Unleash Your Style"', () => {
    renderHero();
    expect(screen.getByText(/unleash your/i)).toBeInTheDocument();
  });

  it('renders the "Explore Collection" button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /explore collection/i })).toBeInTheDocument();
  });

  it('renders the "Our Story" button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /our story/i })).toBeInTheDocument();
  });

  it('renders the "15M+" customer stat', () => {
    renderHero();
    expect(screen.getByText(/15M\+/i)).toBeInTheDocument();
  });

  it('renders the "4.9/5" rating stat', () => {
    renderHero();
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument();
  });

  it('renders the hero main image with correct alt text', () => {
    renderHero();
    expect(screen.getByAltText('Premium Apparel Models')).toBeInTheDocument();
  });

  it('renders the Premium Quality Assured badge', () => {
    renderHero();
    expect(screen.getByText(/Premium Quality Assured/i)).toBeInTheDocument();
  });
});
