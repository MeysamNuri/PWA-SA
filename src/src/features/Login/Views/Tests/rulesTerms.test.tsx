// RulesAndTerms.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RulesAndTerms from '../rulesTerms'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock react-router-dom's useNavigate hook
const mockUseNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockUseNavigate,
}));

// Mock ButtonComponent
vi.mock('@/core/components/Button', () => ({
  default: ({ title, isFormValid, isPending, ...props }: any) => (
    <button
      data-testid="button-component-mock"
      disabled={!isFormValid || isPending}
      {...props}
    >
      {title}
    </button>
  ),
}));

// Mock Material-UI components that might be problematic or need specific behavior
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    // Mock IconButton to ensure its click handler works and we can identify it
    IconButton: ({ onClick, children, ...props }: any) => (
      <button onClick={onClick} data-testid="icon-button-mock" {...props}>
        {children}
      </button>
    ),
    // Mock TextField if it were used, but it's not in this component, keeping for consistency
    TextField: ({ onChange, name, value, type, InputProps, ...props }: any) => {
      const startAdornment = InputProps?.startAdornment;
      return (
        <div data-testid={`textfield-wrapper-${name}`}>
          <input
            data-testid={`textfield-input-${name}`}
            type={type || "text"}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
          />
          {startAdornment && startAdornment.props && startAdornment.props.children}
        </div>
      );
    },
  };
});


describe('RulesAndTerms', () => {
  // Define a simple theme for testing purposes
  const theme = createTheme({
    palette: {
      background: {
        default: '#f0f0f0', // A light background color for testing
      },
    },
  });

  // Helper function to render the component with the ThemeProvider
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  beforeEach(() => {
    // Clear all mocks before each test to ensure isolation
    vi.clearAllMocks();
    // Mock import.meta.env.BASE_URL for image paths
    vi.stubGlobal('import', {
      meta: {
        env: {
          BASE_URL: '/',
        },
      },
    });
  });

  it('renders the RulesAndTerms component correctly with all content', () => {
    renderWithTheme(<RulesAndTerms />);

    // Check for main heading
    expect(screen.getByRole('heading', { name: 'قوانین و شرایط :' })).toBeInTheDocument();

    // Check for the main logo image
    const mainLogo = screen.getByAltText('mobile icon');
    expect(mainLogo).toBeInTheDocument();
    expect(mainLogo).toHaveAttribute('src', '/images/Appbaricons/Holoo.png');
    // Use computed style to check the actual dimensions
    const mainLogoComputedStyle = window.getComputedStyle(mainLogo);
    expect(mainLogoComputedStyle.width).toBe('71px');
    expect(mainLogoComputedStyle.height).toBe('22px');

    // Check for the back arrow icon button image
    const backArrowImage = screen.getByAltText('back');
    expect(backArrowImage).toBeInTheDocument();
    expect(backArrowImage).toHaveAttribute('src', '/images/backroute.png');
    // Use computed style to check the actual dimensions
    const backArrowComputedStyle = window.getComputedStyle(backArrowImage);
    expect(backArrowComputedStyle.width).toBe('24px');
    expect(backArrowComputedStyle.height).toBe('24px');

    // Check for list items content
    expect(screen.getByText('۱- استفاده از "دستیار هوشمند هلو" ویژه دارندگان "نرم افزار حسابداری هلو" می باشد.')).toBeInTheDocument();
    expect(screen.getByText('۲-با وارد کردن شماره موبایل و دریافت کد تایید پیامکی ، پروفایل کاربری شما بر اساس اطلاعاتی که هنگام خرید "نرم افزار حسابداری هلو" ارائه کرده اید ، ایجاد خواهد شد .')).toBeInTheDocument();
    expect(screen.getByText('۳-مبنای تحلیل ها و شاخص های ارائه شده در نرم افزار ، اطلاعاتی است که در "نرم افزار حسابداری هلو" ثبت کرده اید .')).toBeInTheDocument();
    expect(screen.getByText('۴-مرجع «قیمت زنده ارز، سکه و طلا» سایت معتبر و رسمی tgju.org می باشد .')).toBeInTheDocument();

    // Check for the "متوجه شدم" button
    const understandButton = screen.getByTestId('button-component-mock');
    expect(understandButton).toBeInTheDocument();
    expect(understandButton).toHaveTextContent('متوجه شدم');
    expect(understandButton).toBeEnabled(); // isFormValid is true by default in the component's JSX
  });

  it('navigates to /login when the back arrow icon button is clicked', () => {
    renderWithTheme(<RulesAndTerms />);

    const backButton = screen.getByTestId('icon-button-mock');
    fireEvent.click(backButton);

    // Verify that navigate was called with the correct path
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders the ButtonComponent with correct props', () => {
    renderWithTheme(<RulesAndTerms />);
    const understandButton = screen.getByTestId('button-component-mock');

    expect(understandButton).toBeInTheDocument();
    expect(understandButton).toHaveTextContent('متوجه شدم');
    expect(understandButton).toBeEnabled(); // Based on isFormValid={true} in component
  });
});
