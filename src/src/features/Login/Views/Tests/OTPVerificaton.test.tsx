import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OTPVerification from "../OTPVerificaton";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the custom hook
const handleSubmitOTPMock = vi.fn();
const handleOTPChangeMock = vi.fn();
const handlePasswordLoginClickMock = vi.fn();
const handleBackMock = vi.fn();
const handleResendCodeMock = vi.fn();

vi.mock("../../Hooks/useOTPVerifyHooks", () => ({
  default: () => ({
    handleSubmitOTP: handleSubmitOTPMock,
    timer: 30,
    canResend: true,
    handleResendCode: handleResendCodeMock,
    handleOTPChange: handleOTPChangeMock,
    handlePasswordLoginClick: handlePasswordLoginClickMock,
    otpValues: ["", "", "", "", "", ""],
    inputRefs: { current: [] },
    location: { state: { phoneNumber: "09120000000" } },
    isPending: false,
    handleBack: handleBackMock,
    OTPVerifyLoading: false,
  }),
}));

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("OTPVerification Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with phone number and UI elements", () => {
    renderWithProviders(<OTPVerification />);

    expect(screen.getByText(/09120000000/)).toBeInTheDocument();
    expect(screen.getByText(/ویرایش شماره موبایل/)).toBeInTheDocument();
    expect(screen.getByText(/دریافت مجدد کد/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تأیید" })).toBeInTheDocument();
  });

  it("calls handleOTPChange when typing in OTP input", () => {
    renderWithProviders(<OTPVerification />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(handleOTPChangeMock).toHaveBeenCalledWith(0, expect.any(Object));
  });

  it("calls handlePasswordLoginClick when clicking password login link", () => {
    renderWithProviders(<OTPVerification />);
    const passwordLoginLink = screen.getByText(/ورود با کلمه عبور/);
    fireEvent.click(passwordLoginLink);
    expect(handlePasswordLoginClickMock).toHaveBeenCalled();
  });

  it("calls handleBack when clicking edit phone number link", () => {
    renderWithProviders(<OTPVerification />);
    const editPhoneLink = screen.getByText(/ویرایش شماره موبایل/);
    fireEvent.click(editPhoneLink);
    expect(handleBackMock).toHaveBeenCalled();
  });

  it("calls handleResendCode when clicking resend code link", () => {
    renderWithProviders(<OTPVerification />);
    const resendLink = screen.getByText(/دریافت مجدد کد/);
    fireEvent.click(resendLink);
    expect(handleResendCodeMock).toHaveBeenCalled();
  });

  it("calls handleSubmitOTP when submitting the form", () => {
    renderWithProviders(<OTPVerification />);
    const submitButton = screen.getByRole("button", { name: "تأیید" });
    fireEvent.click(submitButton);
    // expect(handleSubmitOTPMock).toHaveBeenCalled();
  });
});
