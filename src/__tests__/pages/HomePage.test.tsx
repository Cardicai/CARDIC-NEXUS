import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the Cardic Nexus heading', () => {
    render(<HomePage />);

    expect(screen.getAllByText(/CARDIC/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/NEXUS/i)[0]).toBeInTheDocument();
  });
});
