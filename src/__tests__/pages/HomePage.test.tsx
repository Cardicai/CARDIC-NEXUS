import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders landing sections', () => {
    render(<HomePage />);
    expect(screen.getByText(/Follow our Social Pages/i)).toBeInTheDocument();
  });
});
