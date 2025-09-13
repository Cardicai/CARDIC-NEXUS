import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing hero', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /Cardic Nexus/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
