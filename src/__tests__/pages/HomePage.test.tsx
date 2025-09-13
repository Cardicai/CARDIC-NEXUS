// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the hero actions', () => {
    render(<HomePage />);
    const cta = screen.getByText(/Join Premium/i);
    expect(cta).toBeInTheDocument();
  });
});
