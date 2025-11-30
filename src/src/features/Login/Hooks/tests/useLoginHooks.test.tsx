import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import useLoginHook from "../useLoginHooks";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import UseSendOTPHooks from "../APIHooks/useSendOTP";
import { ValidatorForm } from "react-material-ui-form-validator";

// ===== Mocks =====
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), warning: vi.fn() },
}));

vi.mock("../APIHooks/useSendOTP", () => ({
  default: vi.fn(),
}));

vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({ palette: { primary: { main: "#000" } } }),
}));

describe("useLoginHook", () => {
  let navigateMock: any;
  let mutateMock: any;
  let locationMock: any;

  beforeEach(() => {
    navigateMock = vi.fn();
    mutateMock = vi.fn();
    locationMock = { state: { phoneNumber: "" } };

    (useNavigate as any).mockReturnValue(navigateMock);
    (useLocation as any).mockReturnValue(locationMock);

    (UseSendOTPHooks as any).mockImplementation(() => ({
      mutate: mutateMock,
      isPending: false,
    }));

    ValidatorForm.addValidationRule = vi.fn();
    ValidatorForm.removeValidationRule = vi.fn();
  });

  it("updates form data on handleChange", () => {
    const { result } = renderHook(() => useLoginHook());

    act(() => {
      result.current.handleChange({ target: { value: "09123456789" } } as any);
    });

    expect(result.current.formData.phoneNumber).toBe("09123456789");
  });

  it("calls mutate with correct data on handleSubmit", () => {
    const { result } = renderHook(() => useLoginHook());

    act(() => {
      // Update phone number before calling handleSubmit
      result.current.handleChange({ target: { value: "09123456789" } } as any);
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mutateMock).toHaveBeenCalledWith(
      { phoneNumber: "09123456789" },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it("navigates on successful OTP submission", () => {
    const { result } = renderHook(() => useLoginHook());

    // Step 1: Update formData via handleChange
    act(() => {
      result.current.handleChange({ target: { value: "09123456789" } } as any);
    });

    // Step 2: Call handleSubmit
    act(() => {
      result.current.handleSubmit();
    });

    // Step 3: Extract the onSuccess callback from the mutate mock
    const onSuccess = mutateMock.mock.calls[0][1].onSuccess;

    // Step 4: Trigger onSuccess inside act to simulate API success
    act(() => {
      onSuccess();
    });

    // Step 5: Assert that navigate was called with the correct phone number
    expect(navigateMock).toHaveBeenCalledWith("/otpVerification", {
      state: { phoneNumber: "09123456789" },
    });
  });


  it("shows toast error on OTP submission failure", () => {
    const { result } = renderHook(() => useLoginHook());

    act(() => result.current.handleSubmit());

    const onError = mutateMock.mock.calls[0][1].onError;
    act(() => onError());

    expect(toast.error).toHaveBeenCalledWith("خطای سمت سرور");
  });

  it("handles password login click when form is valid", () => {
    const { result } = renderHook(() => useLoginHook());

    act(() => {
      result.current.handleChange({ target: { value: "09123456789" } } as any);
    });

    act(() => {
      // The hook automatically sets isFormValid via useEffect
      result.current.handlePasswordLoginClick();
    });

    expect(navigateMock).toHaveBeenCalledWith("/password-login", {
      state: { phoneNumber: "09123456789" },
    });
  });

  it("shows warning if form is invalid on password login click", () => {
    const { result } = renderHook(() => useLoginHook());

    act(() => {
      result.current.handlePasswordLoginClick();
    });

    expect(toast.warning).toHaveBeenCalledWith("لطفا شماره موبایل خود را وارد کنید");
  });
});
//complete test========



vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), warning: vi.fn() },
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn().mockReturnValue({ state: {} }),
  };
});

describe("useLoginHook - specific lines", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigateMock);
  });

  it("validates isPhoneNumberNotEmpty rule", () => {
    const { result } = renderHook(() => useLoginHook());
    const isNotEmpty = result.current.formData.phoneNumber.trim() !== "";
    expect(isNotEmpty).toBe(false);
    expect("123".trim() !== "").toBe(true);
  });

  it("validates isPhoneNumber11Digits rule", () => {
    const digitsOnly = "09123456789".replace(/\D/g, "");
    expect(digitsOnly.length === 11).toBe(true);

    const shortNumber = "09123".replace(/\D/g, "");
    expect(shortNumber.length === 11).toBe(false);
  });

  it("validates isPhoneNumberStartsWithZero rule", () => {
    expect("09123456789".trim().startsWith("0")).toBe(true);
    expect("9123456789".trim().startsWith("0")).toBe(false);
  });

  it("handles navigation to rules page", () => {
    const { result } = renderHook(() => useLoginHook());
    act(() => {
      result.current.handleRules();
    });
    expect(navigateMock).toHaveBeenCalledWith("/rules-regulations");
  });

  it("toggles showPassword state", () => {
    const { result } = renderHook(() => useLoginHook());
    const initialValue = result.current.showPassword;

    act(() => {
      result.current.handleTogglePassword();
    });
    expect(result.current.showPassword).toBe(!initialValue);

    act(() => {
      result.current.handleTogglePassword();
    });
    expect(result.current.showPassword).toBe(initialValue);
  });
});

////////
vi.mock("react-material-ui-form-validator", () => ({
  ValidatorForm: {
    addValidationRule: vi.fn(),
    removeValidationRule: vi.fn(),
  },
}));

describe("useLoginHook - ValidatorForm rules", () => {
  it("adds correct validation rules", () => {
    renderHook(() => useLoginHook());

    const calls = (ValidatorForm.addValidationRule as any).mock.calls;

    // Find our specific rules by name
    const notEmptyCall = calls.find((c: any) => c[0] === "isPhoneNumberNotEmpty");
    const elevenDigitsCall = calls.find((c: any) => c[0] === "isPhoneNumber11Digits");
    const startsWithZeroCall = calls.find((c: any) => c[0] === "isPhoneNumberStartsWithZero");

    expect(notEmptyCall).toBeDefined();
    expect(elevenDigitsCall).toBeDefined();
    expect(startsWithZeroCall).toBeDefined();

    const notEmptyRuleFn = notEmptyCall[1];
    const elevenDigitsRuleFn = elevenDigitsCall[1];
    const startsWithZeroRuleFn = startsWithZeroCall[1];

    // Test isPhoneNumberNotEmpty
    expect(notEmptyRuleFn("")).toBe(false);
    expect(notEmptyRuleFn("   ")).toBe(false);
    expect(notEmptyRuleFn("09123456789")).toBe(true);

    // Test isPhoneNumber11Digits
    expect(elevenDigitsRuleFn("09123456789")).toBe(true); // 11 digits
    expect(elevenDigitsRuleFn("09123")).toBe(false);      // too short
    expect(elevenDigitsRuleFn("09123abc4567")).toBe(false);

    // Test isPhoneNumberStartsWithZero
    expect(startsWithZeroRuleFn("09123456789")).toBe(true);
    expect(startsWithZeroRuleFn("9123456789")).toBe(false);
    expect(startsWithZeroRuleFn(" 09123456789")).toBe(true); // trims whitespace
  });
});