import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '../../components/Hero';

describe('Hero — Unit Tests', () => {
  it('renders the main heading "Unleash Your Style"', () => {
    render(<Hero />);
    expect(screen.getByText(/unleash your style/i)).toBeInTheDocument();
  });

  it('renders the "Shop Now" CTA button', () => {
    render(<Hero />);
    expect(
      screen.getByRole('button', { name: /shop now/i })
    ).toBeInTheDocument();
  });

  it('renders the "15 Million+" customer stat', () => {
    render(<Hero />);
    expect(screen.getByText(/15 Million\+/i)).toBeInTheDocument();
  });

  it('renders 4 avatar images from pravatar', () => {
    render(<Hero />);
    const avatars = screen.getAllByAltText('user');
    expect(avatars).toHaveLength(4);
    avatars.forEach((img) => {
      expect(img.src).toContain('pravatar.cc');
    });
  });

  it('renders the hero main image with correct alt text', () => {
    render(<Hero />);
    expect(screen.getByAltText('Man in sweater')).toBeInTheDocument();
  });

  it('renders the Cream Jacket product card image', () => {
    render(<Hero />);
    expect(screen.getByAltText('Cream Jacket')).toBeInTheDocument();
  });

  it('renders the Clothes Rack product card image', () => {
    render(<Hero />);
    expect(screen.getByAltText('Clothes Rack')).toBeInTheDocument();
  });

  it('renders the "Explore now" button on the third card', () => {
    render(<Hero />);
    expect(
      screen.getByRole('button', { name: /explore now/i })
    ).toBeInTheDocument();
  });

  // it("renders all 5 brand logo labels", () => {
  //   render(<Hero />);
  //   const brands = [
  //     "GRAPHIC STUDIO",
  //     "S. SALVA",
  //     "GOLDEN STUDIO",
  //     "FURNITURE DESIGN",
  //     "TRAVEL LOOKBOOK",
  //   ];
  //   brands.forEach((brand) => {
  //     expect(screen.getByText(brand)).toBeInTheDocument();
  //   });
  // });

  it('renders the "Models wearing full outfits" text', () => {
    render(<Hero />);
    expect(screen.getByText(/models wearing/i)).toBeInTheDocument();
  });
});
