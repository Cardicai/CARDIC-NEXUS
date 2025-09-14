import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the landing page', () => {
    render(<HomePage />);

    expect(screen.getByText('Contact & Socials')).toBeInTheDocument();
  });
});
