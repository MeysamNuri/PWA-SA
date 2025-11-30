import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TitleTotalValue from '../titleTotalValue';
import { valueTypeEnum } from '../../types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mocking the 'toPersianNumber' utility function
vi.mock('@/core/helper/translationUtility', () => ({
  toPersianNumber: (value: string) => value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).replace(/,/g, '٬'),
}));

// Creating a custom MUI theme for consistent testing
const theme = createTheme({
  palette: {
    primary: {
      light: '#565A62',
        main: '#1976d2',
    },
    button: {
      main: '#E42628',
    },
  },
});

// A helper function to render the component with the mocked theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('TitleTotalValue Component', () => {
  it('renders correctly for available balance in toman currency', () => {
    const props = {
      value: '100,000,000',
      valueType: valueTypeEnum.available,
      currencyTab: 'toman',
      totalBalanceUOM: 'تومان',
    };
    renderWithTheme(<TitleTotalValue {...props} />);
    
    // Assert that the value, currency unit, and descriptive text are present
    expect(screen.getByText('100,000,000')).toBeInTheDocument();
    expect(screen.getByText('تومان')).toBeInTheDocument();
    expect(screen.getByText('ارزش کل دارایی')).toBeInTheDocument();
    
    // Assert that the correct image is rendered based on valueType
    const imgElement = screen.getByAltText('Bank Icon');
    expect(imgElement).toHaveAttribute('src', '/images/Availablefunds/totalbalance.png');
  });

  it('renders correctly for bank balance in dollar currency', () => {
    const props = {
      value: '', // This value is not used, so it can be empty
      valueType: valueTypeEnum.bank,
      currencyTab: 'dollar',
      bankBalance: 500000,
    };
    renderWithTheme(<TitleTotalValue {...props} />);
    
    // Assert that the value is correctly formatted with the Persian thousand separator
    expect(screen.getByText('۵۰۰٬۰۰۰')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    
    // Assert that the correct descriptive text is present
    expect(screen.getByText('بانک')).toBeInTheDocument();

    // Assert that the correct image is rendered
    const imgElement = screen.getByAltText('Bank Icon');
    expect(imgElement).toHaveAttribute('src', '/images/Availablefunds/banksbalance.png');
  });

  it('renders correctly for fund balance in toman currency', () => {
    const props = {
      value: '',
      valueType: valueTypeEnum.fund,
      currencyTab: 'toman',
      fundBalance: 750000,
    };
    renderWithTheme(<TitleTotalValue {...props} />);
    
    // Assert that the value is correctly formatted (divided by 10 and with the Persian thousand separator)
    expect(screen.getByText('۷۵٬۰۰۰')).toBeInTheDocument();
    expect(screen.getByText('تومان')).toBeInTheDocument();
    
    // Assert that the correct descriptive text is present
    expect(screen.getByText('نقد')).toBeInTheDocument();

    // Assert that the correct image is rendered
    const imgElement = screen.getByAltText('Bank Icon');
    expect(imgElement).toHaveAttribute('src', '/images/Availablefunds/fundsbalance.png');
  });
});