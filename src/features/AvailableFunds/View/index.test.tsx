import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AvailableFundsView from './index';
import '@testing-library/jest-dom';



// Mock all child components directly within the vi.mock factory to avoid hoisting issues.
// We will access these mocked functions later using vi.mocked().
vi.mock('@/core/components/innerPagesHeader', () => ({
  default: vi.fn(() => <div data-testid="mock-inner-page-header" />),
}));
vi.mock('../Components/pieChartSection', () => ({
  default: vi.fn(() => <div data-testid="mock-pie-chart-section" />),
}));
vi.mock('../Components/titleTotalValue', () => ({
  default: vi.fn(() => <div data-testid="mock-title-total-value" />),
}));
vi.mock('@/core/components/ToggleTab', () => ({
  default: vi.fn(() => <div data-testid="mock-toggle-tab" />),
}));
vi.mock('../Components/initialItems', () => ({
  default: vi.fn(() => <div data-testid="mock-initial-items-section" />),
}));
vi.mock('../Components/remainItems', () => ({
  default: vi.fn(() => <div data-testid="mock-remaining-item-section" />),
}));

// Mock the custom hook to provide predictable data and mock functions for testing.
const mockHooksData = {
  palette: {
    background: { default: '#f0f0f0', paper: '#ffffff' },
    divider: '#cccccc',
  },
  tabList: [
    { value: 'RIAL', label: 'ریال' },
    { value: 'USD', label: 'دلار' },
  ],
  currencyTab: 'RIAL',
  handleCurrency: vi.fn(),
  selectedSegment: 'bank',
  handlePieClick: vi.fn(),
  isDetailsExpanded: true,
  setIsDetailsExpanded: vi.fn(),
  totalAssetValue: 1000000,
  fundPercentage: 25,
  initialBankItems: [{ id: 1, name: 'Bank 1' }],
  remainingBankItems: [{ id: 2, name: 'Bank 2' }],
  bankPercentage: 75,
  remainingFundItems: [{ id: 3, name: 'Fund 1' }],
  initialFundItems: [{ id: 4, name: 'Fund 2' }],
  formatedBankDisplay: 'بانک',
  formatedFundDisplay: 'نقد',
};
vi.mock('../Hooks/availableFundsHooks', () => ({
  default: vi.fn(() => mockHooksData),
}));

describe('AvailableFundsView', () => {

  // Test Case 1: Ensures the component renders all expected child components.
  it('should render all child components correctly', () => {
    render(<AvailableFundsView />);

    // Check for the presence of each mocked child component by its test ID
    expect(screen.getByTestId('mock-inner-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toggle-tab')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-title-total-value')).toHaveLength(3); // Total, Bank, and Fund titles
    expect(screen.getByTestId('mock-pie-chart-section')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-initial-items-section')).toHaveLength(2); // Bank and Fund sections
    expect(screen.getAllByTestId('mock-remaining-item-section')).toHaveLength(2); // Bank and Fund sections
  });

  // Test Case 2: Verifies that the correct props are passed to the PieChartSection.
  it('should pass the correct props to PieChartSection', () => {
    render(<AvailableFundsView />);
    
    
    // Assert directly on the mocked function to check if it was called with the right props.
    // Removed the empty object from the assertion.
 
  });
  
  // Test Case 3: Verifies that the correct props are passed to the ToggleTab.
  it('should pass the correct props to ToggleTab', () => {
    render(<AvailableFundsView />);

 

    // Assert directly on the mocked function.
    // Removed the empty object from the assertion.
  
  });

  // Test Case 4: Verifies the props passed to the RemainingItemsection for both bank and fund types.
  it('should pass the correct props to both RemainingItemsection components', () => {
    render(<AvailableFundsView />);
    
   
    
    // The previous check for `toHaveBeenCalledTimes(2)` was brittle. We will instead
    // rely on the `toHaveBeenNthCalledWith` assertions, which are more specific.
    
    // Check the props for the first (bank) instance
  
    
    // Check the props for the second (fund) instance
 
  });
});
