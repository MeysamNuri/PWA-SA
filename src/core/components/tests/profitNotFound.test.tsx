import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfitNotFound from '../profitNotFound';

// The fix is to return an object with a "default" key.
// This correctly mocks a default module export, which is how Vite
// handles static asset imports.
vi.mock('/images/salesnotfound.png', () => ({
  default: 'test-sales-not-found-icon.png'
}));
vi.mock('/images/chequenotfound.png', () => ({
  default: 'test-cheques-not-found-icon.png'
}));

describe('ProfitNotFound', () => {

  it('should render the message and the default icon when isFromCheques is not provided', () => {
    const testMessage = 'No data found for this period.';
    
    render(<ProfitNotFound message={testMessage} />);

    // Assert that the message text is present
    expect(screen.getByText(testMessage)).toBeInTheDocument();

    // Assert that the default "sales not found" icon is rendered
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'test-sales-not-found-icon.png');
  });

  it('should render the message and the cheques icon when isFromCheques is true', () => {
    const testMessage = 'No cheques found.';

    render(<ProfitNotFound message={testMessage} isFromCheques={true} />);

    // Assert that the message text is present
    expect(screen.getByText(testMessage)).toBeInTheDocument();

    // Assert that the specific "cheques not found" icon is rendered
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'test-cheques-not-found-icon.png');
  });

});
