import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /CARDIC NEXUS/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
