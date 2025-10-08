import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChequeTotalCard from '../totalCard';

// Mock the 'react-router' useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the 'NumberConverter' helper to return Persian numerals
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    latinToArabic: vi.fn((value) => {
      if (typeof value !== 'string') return '';
      const latinToArabicMap: { [key: string]: string } = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
      };
      return value.replace(/\d/g, (digit) => latinToArabicMap[digit] || digit);
    }),
  },
}));

// Mock the image import
vi.mock('@/core/assets/icones/arrow-left.svg', () => ({
  default: 'arrow-left-mock.svg',
}));

// Mock the styled components to avoid any rendering issues
// This is not strictly necessary for this component but is a good practice
vi.mock('./totalCard.styles', () => ({
  InfoRow: ({ children }: any) => <div>{children}</div>,
  HeaderCard: ({ children }: any) => <div>{children}</div>,
  StyledCardContent: ({ children }: any) => <div>{children}</div>,
  BodyStyledCardContent: ({ children }: any) => <div>{children}</div>,
  HeaderInfoRow: ({ children }: any) => <div>{children}</div>,
  Label: ({ children }: any) => <span>{children}</span>,
  Value: ({ children }: any) => <span>{children}</span>,
  BodyCard: ({ children }: any) => <div>{children}</div>,
}));

describe('ChequeTotalCard', () => {
  // Reset the mock functions before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Corrected mock data for payable cheques, including all required properties
  const payableData = {
    payableChequesQuantity: 15,
    payableChequesAmount: 12345000,
    formattedPayableChequesAmount: '12345000',
    payableChequesAmountUOM: 'ریال',
    receivableChequesQuantity: 0,
    receivableChequesAmount: 0,
    formattedReceivableChequesAmount: '0',
    receivableChequesAmountUOM: '-',
    allChequesBalanceAmount: 0,
    formattedAllChequesBalanceAmount: '0',
    allChequesBalanceAmountUOM: '-',
  };

  // Corrected mock data for receivable cheques, including all required properties
  const receivableData = {
    payableChequesQuantity: 0,
    payableChequesAmount: 0,
    formattedPayableChequesAmount: '0',
    payableChequesAmountUOM: '-',
    receivableChequesQuantity: 20,
    receivableChequesAmount: 98765000,
    formattedReceivableChequesAmount: '98765000',
    receivableChequesAmountUOM: 'تومان',
    allChequesBalanceAmount: 0,
    formattedAllChequesBalanceAmount: '0',
    allChequesBalanceAmountUOM: '-',
  };

  it('renders correctly for "Payable" status', () => {
    // Render the component with payable data
    render(<ChequeTotalCard chequeStatus="Payable" data={payableData} />);

    // Expect the correct header text to be displayed
    expect(screen.getByText('همه چک های پرداختی')).toBeInTheDocument();

    // Expect the payable quantity to be displayed (in Persian numerals)
    expect(screen.getByText('١٥')).toBeInTheDocument();

    // Expect the amount to be displayed in Persian numerals
    expect(screen.getByText('١٢٣٤٥٠٠٠')).toBeInTheDocument();

    // Expect the correct UOM to be displayed
    expect(screen.getByText('ریال')).toBeInTheDocument();
  });

  it('renders correctly for "Receivable" status', () => {
    // Render the component with receivable data
    render(<ChequeTotalCard chequeStatus="Receivable" data={receivableData} />);

    // Expect the correct header text to be displayed
    expect(screen.getByText('همه چک های دریافتی')).toBeInTheDocument();

    // Expect the receivable quantity to be displayed (in Persian numerals)
    expect(screen.getByText('٢٠')).toBeInTheDocument();

    // Expect the amount to be displayed in Persian numerals
    expect(screen.getByText('٩٨٧٦٥٠٠٠')).toBeInTheDocument();

    // Expect the correct UOM to be displayed
    expect(screen.getByText('تومان')).toBeInTheDocument();
  });

  it('navigates when clicked if a path is provided', () => {
    const testPath = '/cheques/all';
    // Render the component with a path and data
    render(<ChequeTotalCard chequeStatus="Payable" data={payableData} path={testPath} />);

    // Simulate a click on the component's main container
    fireEvent.click(screen.getByText('همه چک های پرداختی').closest('div') as HTMLElement);

    // Expect the navigate function to have been called with the correct path and state
    expect(mockNavigate).toHaveBeenCalledWith(testPath, { state: { itemsData: payableData } });
  });

  it('does not navigate when clicked if no path is provided', () => {
    // Render the component without a path
    render(<ChequeTotalCard chequeStatus="Payable" data={payableData} />);

    // Simulate a click
    fireEvent.click(screen.getByText('همه چک های پرداختی').closest('div') as HTMLElement);

    // Expect the navigate function not to have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles undefined data gracefully', () => {
    // Render the component with no data
    render(<ChequeTotalCard chequeStatus="Payable" />);

    // Expect labels to be present, but values to be empty or default
    expect(screen.getByText('تعداد چک ها')).toBeInTheDocument();
    expect(screen.getByText('جمع مبالغ چک ها')).toBeInTheDocument();
  });
});