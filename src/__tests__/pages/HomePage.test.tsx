// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the heading', () => {
    render(<HomePage />);
    const heading = screen.getByText(/CARDIC NEXUS/i);
    expect(heading).toBeInTheDocument();
  });
});
