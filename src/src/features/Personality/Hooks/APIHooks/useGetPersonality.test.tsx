import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useGetUserPersonality from "./useGetPersonality";
import axiosInstance from "@/core/constant/axios";
import { getUserIdFromToken } from "@/core/helper/jwtUtility";
import { toast } from "react-toastify";

// ---- Mock dependencies ----
vi.mock("@/core/constant/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("@/core/helper/jwtUtility", () => ({
  getUserIdFromToken: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Utility wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetUserPersonality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches user personality successfully", async () => {
    // Mock userId returned from token
    (getUserIdFromToken as any).mockReturnValue("123");

    // Mock API response
    (axiosInstance.get as any).mockResolvedValue({
      data: {
        Status: true,
        Message: [],
        Data: { personalityType: "INTJ" },
      },
    });

    const { result } = renderHook(() => useGetUserPersonality(), {
      wrapper: createWrapper(),
    });

    // Wait until React Query finishes
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/Personality/GetPersonality?userId=123"
    );

    expect(result.current.userPersonality).toEqual({
      personalityType: "INTJ",
    });
  });

  it("shows toast errors when API returns Status = false", async () => {
    (getUserIdFromToken as any).mockReturnValue("123");

    // Mock error case
    (axiosInstance.get as any).mockResolvedValue({
      data: {
        Status: false,
        Message: ["Error_Message_Key"],
        Data: null,
      },
    });

    const { result } = renderHook(() => useGetUserPersonality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(toast.error).toHaveBeenCalled();
  });
});
