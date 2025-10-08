// PasswordLogin.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PasswordLogin from '../PasswordLogin'; // Adjust path as necessary
import '@testing-library/jest-dom';


// Mock the custom hook `usePasswordLoginHook`
const mockUsePasswordLoginHook = vi.fn();
vi.mock('../../Hooks/useLoginPasswordHooks', () => ({
  default: () => mockUsePasswordLoginHook(),
}));

// Mock the custom hook `useLoginHook`
const mockUseLoginHook = vi.fn();
vi.mock('../../Hooks/useLoginHooks', () => ({
  default: () => mockUseLoginHook(),
}));

// Mock custom components and Material-UI elements
vi.mock('../../Components/logoSection', () => ({
  default: () => <div data-testid="logo-section-mock">Mocked Logo Section</div>,
}));

vi.mock('../../Components/backArrow', () => ({
  default: ({ handleBack }: { handleBack: () => void }) => (
    <button onClick={handleBack} data-testid="back-arrow-mock">BackArrow Mock</button>
  ),
}));

vi.mock('@/core/components/Button', () => ({
  default: ({ title, isFormValid, isPending }: { title: string; isFormValid: boolean; isPending: boolean }) => (
    <button
      data-testid="button-component-mock"
      disabled={!isFormValid || isPending}
      type="submit" // Important for form submission tests
    >
      {isPending ? 'Loading...' : title}
    </button>
  ),
}));

vi.mock('react-material-ui-form-validator', () => ({
  __esModule: true,
  ValidatorForm: ({ onSubmit, children }: any) => (
    <form onSubmit={onSubmit} data-testid="validator-form-mock">
      {children}
    </form>
  ),
  // TextValidator is not directly used in PasswordLogin, TextField from MUI is.
  // We will mock TextField from @mui/material directly.
}));

vi.mock('@mui/icons-material/Visibility', () => ({
  default: () => <span data-testid="visibility-icon">👁️</span>,
}));

vi.mock('@mui/icons-material/VisibilityOff', () => ({
  default: () => <span data-testid="visibility-off-icon">🚫</span>,
}));

vi.mock('@mui/material/InputAdornment', () => ({
  default: ({ children }: any) => <div data-testid="input-adornment-mock">{children}</div>,
}));

vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    // Mock TextField to act as a simple input for testing
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
          {/* Render adornment children if they exist */}
          {startAdornment && startAdornment.props && startAdornment.props.children}
        </div>
      );
    },
    // Mock IconButton to ensure its click handler works
    IconButton: ({ onClick, children, ...props }: any) => (
      <button onClick={onClick} data-testid="icon-button-mock" {...props}>
        {children}
      </button>
    ),
  };
});


describe('PasswordLogin', () => {
  // Default mock values for usePasswordLoginHook
  let defaultPasswordLoginHookValues: {
    handleBack: ReturnType<typeof vi.fn>;
    handleSubmitPassword: ReturnType<typeof vi.fn>;
    isFormValid: boolean;
    handleChange: ReturnType<typeof vi.fn>;
    formData: { password: string };
    handleFogetPassword: ReturnType<typeof vi.fn>;
    isPending: boolean;
  };

  // Default mock values for useLoginHook
  let defaultLoginHookValues: {
    handleTogglePassword: ReturnType<typeof vi.fn>;
    showPassword: boolean;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize mock values for usePasswordLoginHook
    defaultPasswordLoginHookValues = {
      handleBack: vi.fn(),
      handleSubmitPassword: vi.fn(),
      isFormValid: true,
      handleChange: vi.fn(),
      formData: { password: "" },
      handleFogetPassword: vi.fn(),
      isPending: false,
    };
    mockUsePasswordLoginHook.mockReturnValue(defaultPasswordLoginHookValues);

    // Initialize mock values for useLoginHook
    defaultLoginHookValues = {
      handleTogglePassword: vi.fn(),
      showPassword: false,
    };
    mockUseLoginHook.mockReturnValue(defaultLoginHookValues);
  });

  it('renders the PasswordLogin component correctly with initial state', () => {
    render(<PasswordLogin />);

    // Check for mocked components
    expect(screen.getByTestId('back-arrow-mock')).toBeInTheDocument();
    expect(screen.getByTestId('logo-section-mock')).toBeInTheDocument();

    // Check header text
    expect(screen.getByRole('heading', { name: 'ورود با کلمه عبور' })).toBeInTheDocument();

    // Check password input field
    const passwordInput = screen.getByTestId('textfield-input-passwordLogin');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'passwordLogin');
    expect(passwordInput).toHaveValue('');

    // Check password visibility icon (initially off)
    expect(screen.getByTestId('visibility-off-icon')).toBeInTheDocument();

    // Check navigation links
    expect(screen.getByText('ورود با کلمه یکبار مصرف')).toBeInTheDocument();
    expect(screen.getByText('فراموشی کلمه عبور')).toBeInTheDocument();

    // Check submit button
    const submitButton = screen.getByTestId('button-component-mock');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('ورود');
    expect(submitButton).toBeEnabled(); // isFormValid is true by default mock
  });

  it('calls handleChange when typing into the password input', () => {
    render(<PasswordLogin />);
    const passwordInput = screen.getByTestId('textfield-input-passwordLogin');

    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(defaultPasswordLoginHookValues.handleChange).toHaveBeenCalledTimes(1);
    expect(defaultPasswordLoginHookValues.handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('toggles password visibility when the icon is clicked', () => {
    // Initial render
    const { rerender } = render(<PasswordLogin />);
    const toggleButton = screen.getByTestId('icon-button-mock');

    // Initially, expect VisibilityOff icon and password input type 'password'
    const passwordInput = screen.getByTestId('textfield-input-passwordLogin');
    expect(screen.getByTestId('visibility-off-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('visibility-icon')).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to toggle visibility
    fireEvent.click(toggleButton);
    expect(defaultLoginHookValues.handleTogglePassword).toHaveBeenCalledTimes(1);

    // Simulate the hook's state change for the next render cycle
    mockUseLoginHook.mockReturnValue({
      ...defaultLoginHookValues,
      showPassword: true, // Simulate the state becoming true
    });

    // Re-render the component to reflect the new mock state
    rerender(<PasswordLogin />);

    // After first toggle, expect Visibility icon and password input type 'text'
    expect(screen.getByTestId('visibility-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('visibility-off-icon')).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'text'); // Check input type after toggle

    // Test toggling back
    fireEvent.click(toggleButton);
    expect(defaultLoginHookValues.handleTogglePassword).toHaveBeenCalledTimes(2); // Should be called again

    mockUseLoginHook.mockReturnValue({
      ...defaultLoginHookValues,
      showPassword: false, // Simulate state becoming false again
    });
    rerender(<PasswordLogin />);

    // After second toggle, expect VisibilityOff icon and password input type 'password'
    expect(screen.getByTestId('visibility-off-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('visibility-icon')).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password'); // Check input type after toggle back
  });

  it('calls handleSubmitPassword on form submission', () => {
    render(<PasswordLogin />);
    const form = screen.getByTestId('validator-form-mock');

    fireEvent.submit(form);
    expect(defaultPasswordLoginHookValues.handleSubmitPassword).toHaveBeenCalledTimes(1);
  });

  it('disables the submit button when isFormValid is false', () => {
    mockUsePasswordLoginHook.mockReturnValue({
      ...defaultPasswordLoginHookValues,
      isFormValid: false,
    });
    render(<PasswordLogin />);
    const submitButton = screen.getByTestId('button-component-mock');
    expect(submitButton).toBeDisabled();
  });

  it('disables the submit button when isPending is true', () => {
    mockUsePasswordLoginHook.mockReturnValue({
      ...defaultPasswordLoginHookValues,
      isPending: true,
    });
    render(<PasswordLogin />);
    const submitButton = screen.getByTestId('button-component-mock');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Loading...');
  });

  it('calls handleBack when "ورود با کلمه یکبار مصرف" is clicked', () => {
    render(<PasswordLogin />);
    const oneTimePasswordLink = screen.getByText('ورود با کلمه یکبار مصرف');

    fireEvent.click(oneTimePasswordLink);
    expect(defaultPasswordLoginHookValues.handleBack).toHaveBeenCalledTimes(1);
  });

  it('calls handleFogetPassword when "فراموشی کلمه عبور" is clicked', () => {
    render(<PasswordLogin />);
    const forgotPasswordLink = screen.getByText('فراموشی کلمه عبور');

    fireEvent.click(forgotPasswordLink);
    expect(defaultPasswordLoginHookValues.handleFogetPassword).toHaveBeenCalledTimes(1);
  });
});
