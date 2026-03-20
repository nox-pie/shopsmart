import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../App';

describe('App Integration — Route Rendering', () => {
  it('renders Navbar on the home route', () => {
    render(<App />);
    expect(screen.getByText('SHOPSMART')).toBeInTheDocument();
  });

  it('home route renders Hero heading', () => {
    render(<App />);
    expect(screen.getByText(/unleash your/i)).toBeInTheDocument();
  });

  it('renders the explore collection button on the home page', () => {
    render(<App />);
    expect(
      screen.getByRole('link', { name: /explore collection/i })
    ).toBeInTheDocument();
  });
});
