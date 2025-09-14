// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing title', () => {
    render(<HomePage />);
    const headings = screen.getAllByText(/CARDIC/i);
    expect(headings.length).toBeGreaterThan(0);
  });
});
