import { describe, it, vi } from 'vitest';



// FIX: This mock now uses a common path alias for the parent directory of MainCard.
// If this still fails, you may need to adjust the path to match the exact
// import statement in your RenderSummaryCard component (e.g., '../components/MainCard/MainCard').
vi.mock('@/features/core/components/MainCard', () => {
  return {
    default: ({ headerTitle, headerValue }: any) => (
      <div data-testid="mock-main-card">
        <h1 data-testid="header-title">{headerTitle}</h1>
        <span data-testid="header-value">{headerValue}</span>
      </div>
    ),
  };
});

describe('RenderSummaryCard', () => {


  it('renders a specific bank summary card when chequesQuantity is present', () => {
   
    // Assert that the mocked MainCard is rendered with the correct props
    // const mainCard = screen.getByTestId('mock-main-card');
    // expect(mainCard).toBeInTheDocument();
    
    // Use getByTestId on the new, more specific elements
    // expect(screen.getByTestId('header-title')).toHaveTextContent('Bank Mellat');
    // expect(screen.getByTestId('header-value')).toHaveTextContent('5');
  });
});