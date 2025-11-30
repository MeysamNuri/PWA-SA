// src/features/Notifications/Hooks/useNoticeHooks.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useNoticeLogsHooks from "./useNoticeHooks";

// Mock Zustand store
const setIsReadMock = vi.fn();

// Mock API hook
const notificationsDataMock = [{ id: 1, message: "test" }];
const isPendingMock = false;
vi.mock("./APIHooks/useNotificationLogs", () => ({
  default: vi.fn(() => ({
    notificationsData: notificationsDataMock,
    isPending: isPendingMock,
  })),
}));

vi.mock("@/core/zustandStore", () => ({
  useIsreadNotice: (selector: any) => selector({ isRead: false, setIsRead: setIsReadMock }),
}));

describe("useNoticeLogsHooks", () => {
  beforeEach(() => {
    setIsReadMock.mockClear();
  });

  it("returns initial state and formatted time", () => {
    const { result } = renderHook(() => useNoticeLogsHooks());

    expect(result.current.isRead).toBe(false);
    expect(result.current.notificationsData).toEqual(notificationsDataMock);
    expect(result.current.isPending).toBe(isPendingMock);
    expect(result.current.pageModel).toEqual({ pageNumber: 1, itemsPerPage: 5 });
    expect(result.current.formattedTime24HourNoSeconds).toMatch(/\d{2}:\d{2}/);
  });

  it("calls setIsRead when handleIsReadOnchange is used", () => {
  const { result } = renderHook(() => useNoticeLogsHooks());

  act(() => result.current.handleIsReadOnchange("all")); // <- valid readStatus

  expect(setIsReadMock).toHaveBeenCalledWith("all");
});


  it("updates page model on handlePageChange and handlePageSizeChange", () => {
    const { result } = renderHook(() => useNoticeLogsHooks());

    act(() => result.current.handlePageChange({} as any, 2));
    expect(result.current.pageModel.pageNumber).toBe(2);

    act(() => result.current.handlePageSizeChange({ target: { value: 10 } }));
    expect(result.current.pageModel.itemsPerPage).toBe(10);
    expect(result.current.pageModel.pageNumber).toBe(1); // resets pageNumber to 1
  });
});
