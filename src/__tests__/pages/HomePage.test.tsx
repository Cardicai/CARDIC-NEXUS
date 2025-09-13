// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing sections', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /cardic nexus/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /projects/i })
    ).toBeInTheDocument();
  });
});
