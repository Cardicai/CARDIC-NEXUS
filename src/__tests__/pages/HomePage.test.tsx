// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the hero heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', {
      name: /Cardic Nexus Tournament/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
