// src/features/AvailableFunds/Hooks/APIHooks/tests/getAvailableFunds.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useGetAvailableFunds from "../getAvailableFunds";
import axiosInstance from "@/core/constant/axios";

vi.mock("@/core/constant/axios");
vi.mock("react-toastify");
vi.mock("@/core/helper/translationUtility", () => ({
  getTranslation: (msg: string) => `translated-${msg}`,
}));

// React Query wrapper
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("useGetAvailableFunds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data correctly when API succeeds", async () => {
    (axiosInstance.get as any).mockResolvedValue({
      data: { Status: true, Message: [], Data: { balance: 1000 } },
    });

    const { result } = renderHook(() => useGetAvailableFunds(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBeFalsy());

    expect(result.current.availableFundsData).toEqual({ balance: 1000 });
    expect(result.current.isError).toBe(false);
  });

  it("shows toast error when API returns Status=false", async () => {
    (axiosInstance.get as any).mockResolvedValue({
      data: { Status: false, Message: ["ERR1", "ERR2"], Data: null },
    });

    const { result } = renderHook(() => useGetAvailableFunds(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBeFalsy());

    expect(result.current.availableFundsData).toBeNull(); // Status=false returns null
    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.error).toHaveBeenCalledWith("translated-ERR1", { toastId: "ERR1" });
    expect(toast.error).toHaveBeenCalledWith("translated-ERR2", { toastId: "ERR2" });
    expect(result.current.isError).toBe(false);
  });

  it("handles API errors", async () => {
    const errorObj = new Error("Network Error");
    (axiosInstance.get as any).mockRejectedValue(errorObj);

    const { result } = renderHook(() => useGetAvailableFunds(), { wrapper });

    // wait until React Query populates the error
    await waitFor(() => expect(result.current.error).toBe(errorObj));

    expect(result.current.isError).toBe(true);
    expect(result.current.availableFundsData).toBeUndefined(); // error returns undefined
  });
});
