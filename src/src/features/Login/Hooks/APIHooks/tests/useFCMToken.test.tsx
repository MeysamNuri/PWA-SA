// useSendFCMToken.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSendFCMToken from "../useFCMToken";
import axiosInstance from "@/core/constant/axios";
import { toast } from "react-toastify";


vi.mock("@/core/constant/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@/core/helper/translationUtility", () => ({
  getTranslation: vi.fn((msg) => `translated-${msg}`),
}));

describe("useSendFCMToken", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls axios with correct payload", async () => {
    (axiosInstance.post as any).mockResolvedValueOnce({
      data: { Status: true, Data: "ok" },
    });

    const { result } = renderHook(() => useSendFCMToken(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("fake-token");
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/FirebaseNotification/SendFirebaseToken",
      { fCMToken: "fake-token" }
    );
  });

  it("shows error toasts when Status is false", async () => {
    (axiosInstance.post as any).mockResolvedValueOnce({
      data: { Status: false, Message: ["err1", "err2"] },
    });

    const { result } = renderHook(() => useSendFCMToken(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("bad-token");
    });

    expect(toast.error).toHaveBeenCalledWith("translated-err1", { toastId: "err1" });
    expect(toast.error).toHaveBeenCalledWith("translated-err2", { toastId: "err2" });
  });

  it("does not show error toast when Status is true", async () => {
    (axiosInstance.post as any).mockResolvedValueOnce({
      data: { Status: true, Message: [] },
    });

    const { result } = renderHook(() => useSendFCMToken(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("good-token");
    });

    expect(toast.error).not.toHaveBeenCalled();
  });
});
