import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TitleTotalValue from '../titleTotalValue'; // Adjust path as needed

// Define the valueTypeEnum for mocking purposes, mirroring its original structure
export enum valueTypeEnum {
  fund = 'fund',
  bank = 'bank',
  available = 'available',
}

// Mock the useTheme hook to provide a consistent theme object
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>();
  return {
    ...actual,
    useTheme: vi.fn(() => ({
      palette: {
        primary: {
          light: '#1a73e8', // A consistent color for testing
        },
      },
    })),
  };
});

// FIX: Use vi.stubEnv to mock import.meta.env.BASE_URL for predictable image paths
// vi.stubEnv is the correct way to mock environment variables in Vitest.
vi.stubEnv('BASE_URL', '/mock-base-url/');

describe('TitleTotalValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with fund valueType and toman currency', () => {
    render(
      <TitleTotalValue
        value={12345}
        valueType={valueTypeEnum.fund}
        currencyTab="toman"
      />
    );

    // Check currency and value
    expect(screen.getByText('تومان')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();

    // Check value type text
    expect(screen.getByText('نقد')).toBeInTheDocument();

    // Check image src
    const img = screen.getByAltText('Bank Icon');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `/mock-base-url/images/Availablefunds/fundsbalance.png`);
  });

  it('should render correctly with bank valueType and dollar currency', () => {
    render(
      <TitleTotalValue
        value={987.65}
        valueType={valueTypeEnum.bank}
        currencyTab="dollar"
      />
    );

    // Check currency and value
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('987.65')).toBeInTheDocument();

    // Check value type text
    expect(screen.getByText('بانک')).toBeInTheDocument();

    // Check image src
    const img = screen.getByAltText('Bank Icon');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `/mock-base-url/images/Availablefunds/banksbalance.png`);
  });

  it('should render correctly with available valueType and default currency', () => {
    render(
      <TitleTotalValue
        value={1000000}
        valueType={valueTypeEnum.available}
        currencyTab="anyOther" // Should default to '$'
      />
    );

    // Check currency and value
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('1000000')).toBeInTheDocument();

    // Check value type text
    expect(screen.getByText('ارزش کل دارایی')).toBeInTheDocument();

    // Check image src
    const img = screen.getByAltText('Bank Icon');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `/mock-base-url/images/Availablefunds/totalbalance.png`);
  });

  it('should apply the correct color from theme palette for currency text', () => {
    render(
      <TitleTotalValue
        value={100}
        valueType={valueTypeEnum.fund}
        currencyTab="toman"
      />
    );
    const currencyText = screen.getByText('تومان');
    expect(currencyText).toHaveStyle('color: #1a73e8'); // Expect the mocked primary.light color
  });

  it('should apply the correct color from theme palette for fund/bank type text', () => {
    render(
      <TitleTotalValue
        value={100}
        valueType={valueTypeEnum.fund}
        currencyTab="toman"
      />
    );
    const typeText = screen.getByText('نقد');
    expect(typeText).toHaveStyle('color: #1a73e8'); // Expect the mocked primary.light color
  });

  it('should apply the correct color for "ارزش کل دارایی" text', () => {
    render(
      <TitleTotalValue
        value={100}
        valueType={valueTypeEnum.available}
        currencyTab="toman"
      />
    );
    const typeText = screen.getByText('ارزش کل دارایی');
    expect(typeText).toHaveStyle('color: #E42628'); // Expect the hardcoded color
  });
});
