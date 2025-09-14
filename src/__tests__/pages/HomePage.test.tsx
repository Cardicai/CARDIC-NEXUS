import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing page', () => {
    render(<HomePage />);

    expect(screen.getByText(/Cardic Nexus/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Join Premium/i).length).toBeGreaterThan(0);
  });
});
