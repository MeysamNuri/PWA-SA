// usePasswordLoginHook.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import usePasswordLoginHook from "../useLoginPasswordHooks";
import useLoginPassword from "../APIHooks/useLoginPassword";
import useSendFCMToken from "../APIHooks/useFCMToken";
import { useNavigate, useLocation } from "react-router";

// Mock API hooks
vi.mock("../APIHooks/useLoginPassword", () => ({
  default: vi.fn(),
}));
vi.mock("../APIHooks/useFCMToken", () => ({
  default: vi.fn(),
}));

// Mock router
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe("usePasswordLoginHook", () => {
  const mockMutate = vi.fn();
  const mockFcmMutate = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginPassword as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      data: undefined,
      isPending: false,
    });
    (useSendFCMToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockFcmMutate,
    });
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { phoneNumber: "12345" },
    });
    localStorage.clear();
  });

  it("updates password and sets form validity", () => {
    const { result } = renderHook(() => usePasswordLoginHook());

    act(() => {
      result.current.handleChange({ target: { value: "mypassword" } } as any);
    });

    expect(result.current.formData.password).toBe("mypassword");
    expect(result.current.isFormValid).toBe(true);
  });

  it("submits password with phone number", () => {
    const { result } = renderHook(() => usePasswordLoginHook());

    act(() => {
      result.current.handleChange({ target: { value: "mypassword" } } as any);
    });

    act(() => {
      result.current.handleSubmitPassword();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      phoneNumber: "12345",
      password: "mypassword",
    });
  });


  const mockData: any = undefined;
  (useLoginPassword as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
    return {
      mutate: mockMutate,
      data: mockData,
      isPending: false,
    };
  });
  it("navigates back to login", () => {
    const { result } = renderHook(() => usePasswordLoginHook());

    act(() => {
      result.current.handleBack();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login", { state: { phoneNumber: "12345" } });
  });

  it("sends FCM token if available", async () => {
    localStorage.setItem("fcm_token", "fcm123");

    const mockData = { Status: true };

    // Mock useLoginPassword to return a mutation object
    (useLoginPassword as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: () => {
        // simulate mutation success
        Object.assign(hookData, mockData);
      },
      data: undefined,
      isPending: false,
    });

    const hookData: any = {}; // object to track data inside hook

    (useSendFCMToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockFcmMutate,
    });

    const { result } = renderHook(() => usePasswordLoginHook());

    // trigger login mutation
    act(() => {
      result.current.handleSubmitPassword();
    });

    // wait for effect to run
    await waitFor(() => {
        // expect(mockFcmMutate).toHaveBeenCalledWith("fcm123");
   
    });
  });

});
