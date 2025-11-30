import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useEffect } from "react";
import useHandleNoticeByIdHook from "./useHandleNoticeByIdHook";
import type { INotificationItems } from "../types";

// -----------------------------
// Mocks
// -----------------------------
const setDataFilterMock = vi.fn();
vi.mock("@/core/zustandStore", () => ({
  useChequeFilterStore: vi.fn((selector: any) =>
    selector({ setDataFilter: setDataFilterMock })
  ),
}));

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const handleUpdateNoticeMock = vi.fn();
const responseDataMock = { Status: true, Message: [] };
vi.mock("./APIHooks/useUpdateNotificationLog", () => ({
  default: () => ({
    handleUpdateNotice: handleUpdateNoticeMock,
    responseData: responseDataMock,
  }),
}));

const refetchMock = vi.fn();
vi.mock("./APIHooks/useNotificationLogs", () => ({
  default: () => ({
    refetch: refetchMock,
  }),
}));

// -----------------------------
// Test Component
// -----------------------------
function TestComponent({ notice }: { notice: INotificationItems }) {
  const { handleUpdateNoticeById } = useHandleNoticeByIdHook();

  useEffect(() => {
    handleUpdateNoticeById(notice);
  }, [handleUpdateNoticeById, notice]);

  return null;
}

// -----------------------------
// Tests
// -----------------------------
describe("useHandleNoticeByIdHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to notFoundNotice when URL is missing", async () => {
    render(<TestComponent notice={{ id: "1", url: "" } as any} />);
    expect(navigateMock).toHaveBeenCalledWith("/notifications/notFoundNotice");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("1", expect.any(Object));
  });

  it("navigates and sets filter when URL exists", async () => {
    render(<TestComponent notice={{ id: "2", url: "Tomorrow" } as any} />);

    // The hook maps "Tomorrow" -> ChequesDateFilterType.TomorrowDate
    expect(setDataFilterMock).toHaveBeenCalledWith("TomorrowDate");
    expect(navigateMock).toHaveBeenCalledWith("Tomorrow");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("2", expect.any(Object));
  });


  it("falls back to Next7DaysDate if URL key is unknown", async () => {
    render(<TestComponent notice={{ id: "3", url: "UnknownURL" } as any} />);
    expect(setDataFilterMock).toHaveBeenCalledWith("Next7DaysDate");
    expect(navigateMock).toHaveBeenCalledWith("UnknownURL");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("3", expect.any(Object));
  });
});
// complete test==
import { renderHook, act } from "@testing-library/react";
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";



// Mock modules
vi.mock("./APIHooks/useNotificationLogs", () => ({
  default: () => ({ refetch: refetchMock }),
}));

vi.mock("./APIHooks/useUpdateNotificationLog", () => ({
  default: () => ({ handleUpdateNotice: handleUpdateNoticeMock, responseData: undefined }),
}));

vi.mock("@/core/zustandStore", () => ({
  useChequeFilterStore: () => setDataFilterMock,
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("useHandleNoticeByIdHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to notFoundNotice when URL is missing", async () => {
    const { result } = renderHook(() => useHandleNoticeByIdHook());

    await act(async () => {
      await result.current.handleUpdateNoticeById({ id: "1", url: "" } as any);
    });

    expect(navigateMock).toHaveBeenCalledWith("/notifications/notFoundNotice");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("1", expect.any(Object));
  });

  it("maps URL key to ChequesDateFilterType and navigates", async () => {
    const { result } = renderHook(() => useHandleNoticeByIdHook());

    await act(async () => {
      await result.current.handleUpdateNoticeById({ id: "2", url: "Tomorrow" } as any);
    });

    // Correct filter from mapping
    expect(setDataFilterMock).toHaveBeenCalledWith(ChequesDateFilterType.TomorrowDate);
    expect(navigateMock).toHaveBeenCalledWith("Tomorrow");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("2", expect.any(Object));
  });

  it("falls back to Next7DaysDate if URL key is unknown", async () => {
    const { result } = renderHook(() => useHandleNoticeByIdHook());

    await act(async () => {
      await result.current.handleUpdateNoticeById({ id: "3", url: "UnknownURL" } as any);
    });

    expect(setDataFilterMock).toHaveBeenCalledWith(ChequesDateFilterType.Next7DaysDate);
    expect(navigateMock).toHaveBeenCalledWith("UnknownURL");
    expect(handleUpdateNoticeMock).toHaveBeenCalledWith("3", expect.any(Object));
  });

  it("calls refetch when onSuccess callback is triggered", async () => {
    // Reset mock so we can inspect onSuccess
    handleUpdateNoticeMock.mockImplementation((_, { onSuccess }) => {
      // call onSuccess manually to simulate API success
      onSuccess();
    });

    const { result } = renderHook(() => useHandleNoticeByIdHook());

    await act(async () => {
      await result.current.handleUpdateNoticeById({ id: "4", url: "Tomorrow" } as any);
    });

    expect(refetchMock).toHaveBeenCalled();
  });

  it("returns error if handleUpdateNotice throws", async () => {
    handleUpdateNoticeMock.mockImplementation(() => {
      throw new Error("Test error");
    });

    const { result } = renderHook(() => useHandleNoticeByIdHook());

    let error: any;
    await act(async () => {
      error = await result.current.handleUpdateNoticeById({ id: "5", url: "Tomorrow" } as any);
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Test error");
  });
});
