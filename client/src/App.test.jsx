import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
  it('renders SHOPSMART title', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'ok',
            message: 'Test Msg',
          }),
      })
    );

    render(<App />);
    const title = screen.getByText(/SHOPSMART/);
    expect(title).toBeInTheDocument();
  });
});
