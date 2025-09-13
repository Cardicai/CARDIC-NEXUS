import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the Projects section', () => {
    render(<HomePage />);
    const headings = screen.getAllByText(/Projects/i);
    expect(headings.length).toBeGreaterThan(0);
  });
});
