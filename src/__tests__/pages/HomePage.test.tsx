import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the hero section', () => {
    render(<HomePage />);

    const tagline = screen.getByText(/AI • Trading • Innovation/i);
    expect(tagline).toBeInTheDocument();
  });
});
