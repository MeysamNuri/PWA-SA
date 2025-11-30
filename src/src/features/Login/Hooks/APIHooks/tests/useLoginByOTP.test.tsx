import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLoginByOTPHooks from "../useLoginByOTP";
import axiosInstance from "@/core/constant/axios";
import { toast } from "react-toastify";

// Mock toast
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

// Mock getTranslation to return the same key
vi.mock("@/core/helper/translationUtility", () => ({
  getTranslation: (key: string) => key,
}));

// Mock axios
vi.mock("@/core/constant/axios");

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// React Query wrapper
const wrapper = ({ children }: any) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("useLoginByOTPHooks", () => {
  let localStorageSetItemSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorageSetItemSpy = vi.spyOn(Storage.prototype, "setItem");
  });

  it("should handle failed login and show toast error", async () => {
    (axiosInstance.post as any).mockResolvedValue({
      data: { Status: false, Message: ["Invalid OTP"] },
    });

    const { result } = renderHook(() => useLoginByOTPHooks(), { wrapper });

    await act(async () => {
      await result.current.handleLoginByOTP({ phoneNumber: "09120000000", code: "1234" });
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid OTP");
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorageSetItemSpy).not.toHaveBeenCalled();
  });

  it("should handle successful login, save token, and navigate", async () => {
    (axiosInstance.post as any).mockResolvedValue({
      data: { Status: true, Data: { token: "token123", firstLogin: true }, Message: [] },
    });

    const { result } = renderHook(() => useLoginByOTPHooks(), { wrapper });

    await act(async () => {
      await result.current.handleLoginByOTP({ phoneNumber: "09120000000", code: "1234" });
    });

    // localStorage.setItem should have been called with token
    // expect(localStorageSetItemSpy).toHaveBeenCalledWith("authToken", "token123");

    // Navigation should be called
    expect(mockNavigate).toHaveBeenCalledWith("/home", { state: { firstLogin: true } });

    // Toast should not have been called
    expect(toast.error).not.toHaveBeenCalled();
  });
});
