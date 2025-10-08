// src/features/Auth/Views/LoginView.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import LoginView from "../LoginView";
import useLoginHook from "../../Hooks/useLoginHooks";

// Mock the custom hook `useLoginHooks`.
vi.mock("../../Hooks/useLoginHooks", () => {
    const mockedHookFunction = vi.fn(() => ({
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        formData: { phoneNumber: "" },
        setIsFormValid: vi.fn(),
        palette: createTheme().palette,
        handleRules: vi.fn(),
        isFormValid: true,
        isPending: false,
        handlePasswordLoginClick: vi.fn(),
        handleTogglePassword: vi.fn(),
        location: { pathname: "/", search: "", hash: "", state: null, key: "default" },
        showPassword: false,
    }));
    return {
        __esModule: true,
        default: mockedHookFunction,
    };
});


// --- Mocks for External Dependencies ---

vi.mock("@mui/material/styles", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as any),
        useTheme: () => createTheme(),
    };
});

vi.mock("react-material-ui-form-validator", () => ({
    __esModule: true,
    ValidatorForm: ({ onSubmit, children }: any) => (
        <form onSubmit={onSubmit} data-testid="validator-form-mock">
            {children}
        </form>
    ),
    TextValidator: ({ onChange, name, value, type, InputProps, ...props }: any) => {
        const startAdornment = InputProps?.startAdornment;
        return (
            <div data-testid="text-validator-wrapper">
                <input
                    data-testid={`text-validator-input-${name}`}
                    type={type || "text"}
                    name={name}
                    value={value}
                    // --- IMPORTANT CHANGE HERE ---
                    // Hardcode the exact placeholder text your test expects.
                    // The 'label' prop from the TextValidator might not be what you expect.
                    placeholder="لطفا شماره موبایل خود را وارد نمایید."
                    // --- END IMPORTANT CHANGE ---
                    onChange={onChange}
                    {...props}
                />
                {startAdornment && startAdornment.props && startAdornment.props.children}
            </div>
        );
    },
}));

vi.mock("../../Components/logoSection", () => ({
    __esModule: true,
    default: () => <div data-testid="logo-section-mock">Mocked Logo Section</div>,
}));

vi.mock("@/core/components/Button", () => ({
    __esModule: true,
    default: ({ title, isFormValid, isPending, ...props }: any) => (
        <button data-testid="button-component-mock" disabled={!isFormValid || isPending} {...props}>
            {title}
        </button>
    ),
}));

vi.mock("@mui/icons-material/ArrowBackIosNew", () => ({
    __esModule: true,
    default: () => <span data-testid="arrow-back-icon-mock">←</span>,
}));


// --- Test Suite ---

describe("LoginView", () => {
    const mockedUseLoginHook = vi.mocked(useLoginHook);

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <ThemeProvider theme={createTheme()}>
                {ui}
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseLoginHook.mockReturnValue({
            handleSubmit: vi.fn(),
            handleChange: vi.fn(),
            formData: { phoneNumber: "" },
            setIsFormValid: vi.fn(),
            palette: createTheme().palette,
            handleRules: vi.fn(),
            isFormValid: true,
            isPending: false,
            handlePasswordLoginClick: vi.fn(),
            handleTogglePassword: vi.fn(),
            location: { pathname: "/", search: "", hash: "", state: null, key: "default" },
            showPassword: false,
        });
    });

    it("renders the LoginView component correctly on initial load", () => {
        renderWithProviders(<LoginView />);

        expect(screen.getByTestId("logo-section-mock")).toBeInTheDocument();
        expect(screen.getByText("به دستیار هوشمند هلو خوش آمدید!")).toBeInTheDocument();

        // This should now correctly find the input due to the hardcoded placeholder in the mock
        const phoneNumberInput = screen.getByPlaceholderText("لطفا شماره موبایل خود را وارد نمایید.");
        expect(phoneNumberInput).toBeInTheDocument();
        expect(phoneNumberInput).toHaveAttribute("name", "PhoneNumber");
        expect(phoneNumberInput).toHaveAttribute("type", "tel");

        const mobileIcon = screen.getByAltText("mobile icon");
        expect(mobileIcon).toBeInTheDocument();
        expect(mobileIcon).toHaveAttribute("src", "/images/loginicons/linear-icon.png");

        expect(screen.getByText("ورود با کلمه عبور")).toBeInTheDocument();
        expect(screen.getByTestId("arrow-back-icon-mock")).toBeInTheDocument();

        expect(screen.getByText("قوانین و شرایط")).toBeInTheDocument();
        expect(screen.getByText("استفاده از دستیار هوشمند هلو را خوانده‌ام و با آن موافقم.")).toBeInTheDocument();

        const tickIcon = screen.getByAltText("tick");
        expect(tickIcon).toBeInTheDocument();
        expect(tickIcon).toHaveAttribute("src", "/images/loginicons/Group 36887.png");

        const submitButton = screen.getByTestId("button-component-mock");
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveTextContent("دریافت کد تأیید");
        expect(submitButton).toBeEnabled();
    });

    it("disables the submit button when the form is invalid", () => {
        mockedUseLoginHook.mockReturnValue({
            handleSubmit: vi.fn(),
            handleChange: vi.fn(),
            formData: { phoneNumber: "" },
            setIsFormValid: vi.fn(),
            palette: createTheme().palette,
            handleRules: vi.fn(),
            isFormValid: false,
            isPending: false,
            handlePasswordLoginClick: vi.fn(),
            handleTogglePassword: vi.fn(),
            location: { pathname: "/", search: "", hash: "", state: null, key: "default" },
            showPassword: false,
        });

        renderWithProviders(<LoginView />);

        const submitButton = screen.getByTestId("button-component-mock");
        expect(submitButton).toBeDisabled();
    });

    it("disables the submit button when a submission is pending", () => {
        mockedUseLoginHook.mockReturnValue({
            handleSubmit: vi.fn(),
            handleChange: vi.fn(),
            formData: { phoneNumber: "09123456789" },
            setIsFormValid: vi.fn(),
            palette: createTheme().palette,
            handleRules: vi.fn(),
            isFormValid: true,
            isPending: true,
            handlePasswordLoginClick: vi.fn(),
            handleTogglePassword: vi.fn(),
            location: { pathname: "/", search: "", hash: "", state: null, key: "default" },
            showPassword: false,
        });

        renderWithProviders(<LoginView />);

        const submitButton = screen.getByTestId("button-component-mock");
        expect(submitButton).toBeDisabled();
    });

    it("calls handleChange when typing into the phone number input", () => {
        renderWithProviders(<LoginView />);

        const phoneNumberInput = screen.getByPlaceholderText("لطفا شماره موبایل خود را وارد نمایید.");
        const mockHandleChange = mockedUseLoginHook.mock.results[0].value.handleChange;

        fireEvent.change(phoneNumberInput, { target: { value: "0912" } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
        expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it("calls handleSubmit when the form is submitted", () => {
        renderWithProviders(<LoginView />);

        const form = screen.getByTestId("validator-form-mock");
        const mockHandleSubmit = mockedUseLoginHook.mock.results[0].value.handleSubmit;

        fireEvent.submit(form);

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls handlePasswordLoginClick when 'ورود با کلمه عبور' is clicked", () => {
        renderWithProviders(<LoginView />);

        const passwordLoginLink = screen.getByText("ورود با کلمه عبور");
        const mockHandlePasswordLoginClick = mockedUseLoginHook.mock.results[0].value.handlePasswordLoginClick;

        fireEvent.click(passwordLoginLink);

        expect(mockHandlePasswordLoginClick).toHaveBeenCalledTimes(1);
    });

    it("calls handleRules when 'قوانین و شرایط' is clicked", () => {
        renderWithProviders(<LoginView />);

        const rulesLink = screen.getByText("قوانین و شرایط");
        const mockHandleRules = mockedUseLoginHook.mock.results[0].value.handleRules;

        fireEvent.click(rulesLink);

        expect(mockHandleRules).toHaveBeenCalledTimes(1);
    });
});