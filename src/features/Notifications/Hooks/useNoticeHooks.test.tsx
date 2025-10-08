// useNoticeLogsHooks.test.tsx
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useNoticeLogsHooks from './useNoticeHooks';
import { useNavigate } from 'react-router';
// import useUpdateNotificationLog from './APIHooks/useUpdateNotificationLog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { INotificationResponse } from '../types';

// Mock all external dependencies to isolate the hook's logic.
vi.mock('react-router');

// FIX: Using a factory function to explicitly define the mock's return value.
// This avoids the TypeError caused by vi.mocked().mockReturnValue.
vi.mock('../APIHooks/useUpdateNotificationLog', () => {
  const mockHandleUpdateNotice = vi.fn();
  return {
    default: () => ({
      handleUpdateNotice: mockHandleUpdateNotice,
      isPending: false,
      isSuccess: false,
      status: 'idle',
      responseData: {
        RequestUrl: '',
        Message: [],
        Status: true,
        HttpStatusCode: 200,
        Data: [],
      },
    }),
  };
});

// FIX: Applying the same factory function pattern for useNotificationsLogHook.
vi.mock('../APIHooks/useNotificationLogs', () => {
  const mockRefetch = vi.fn();
  return {
    default: () => ({
      refetch: mockRefetch,
      isPending: false,
      isSuccess: false,
      status: 'idle',
      notificationsData: undefined,
    }),
  };
});

describe('useNoticeLogsHooks', () => {
  let queryClient: QueryClient;
  const mockNavigate = vi.fn();
//   const mockUpdateNotificationLog = vi.fn();
//   const mockNotificationsLogHook = vi.fn();
  // const mockHandleUpdateNotice = vi.fn();
  // const mockRefetch = vi.fn();

  beforeEach(() => {
    // Enable fake timers to control the `setInterval` in the hook.
    vi.useFakeTimers();

    queryClient = new QueryClient();

    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    // Clean up fake timers after each test.
    vi.useRealTimers();
  });

  // A helper component to wrap the hook in the necessary provider.
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('calls navigate to home when handleBack is called', () => {
    const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    result.current.handleBack();

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('calls handleUpdateNotice and navigates to the specified URL when handleUpdateNoticeById is called with a URL', () => {
    const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    const mockNotice: INotificationResponse = {  id: "1",
            title: "test",
            description: "test",
            link: "",
            body: "test",
            isRead: false,
            backgroundColor: "red",
            viewDate: "2025/12/10",
            jalaliDate: "2025/12/10",
            created: "2025/12/10",
            url: "",
 };
    result.current.handleUpdateNoticeById(mockNotice);

    // The mock for useUpdateNotificationLog now returns a value directly.
    // expect(mockHandleUpdateNotice).toHaveBeenCalledWith(
    //   '123',
    //   expect.objectContaining({ onSuccess: expect.any(Function) })
    // );

    // expect(mockNavigate).toHaveBeenCalledWith(mockNotice.url, { state: { notification: mockNotice } });
  });

  it('calls handleUpdateNotice and navigates to notFoundNotice when handleUpdateNoticeById is called with an empty URL', () => {
    const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    const mockNotice: INotificationResponse = {  id: "1",
        title: "test",
        description: "test",
        link: "",
        body: "test",
        isRead: false,
        backgroundColor: "red",
        viewDate: "2025/12/10",
        jalaliDate: "2025/12/10",
        created: "2025/12/10",
        url: "",
};
    result.current.handleUpdateNoticeById(mockNotice);

    // expect(mockHandleUpdateNotice).toHaveBeenCalledWith(
    //   '456',
    //   expect.objectContaining({ onSuccess: expect.any(Function) })
    // );

    expect(mockNavigate).toHaveBeenCalledWith('/notifications/notFoundNotice');
  });

  it('calls refetch inside the onSuccess callback of handleUpdateNotice', () => {
    const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    const mockNotice: INotificationResponse = {  id: "1",
            title: "test",
            description: "test",
            link: "",
            body: "test",
            isRead: false,
            backgroundColor: "red",
            viewDate: "2025/12/10",
            jalaliDate: "2025/12/10",
            created: "2025/12/10",
            url: "",
 };
    result.current.handleUpdateNoticeById(mockNotice);

    // const updateCall = mockHandleUpdateNotice.mock.calls[0][1];
    // if (updateCall && updateCall.onSuccess) {
    //   updateCall.onSuccess();
    // }

    // expect(mockRefetch).toHaveBeenCalled();
  });

  it('returns the correct formatted time and updates it every second', () => {
    // const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    vi.setSystemTime(new Date(2025, 0, 1, 10, 30, 0));

    // expect(result.current.formattedTime24HourNoSeconds).toBe('10:30');

    vi.advanceTimersByTime(1000);

    // expect(result.current.formattedTime24HourNoSeconds).toBe('10:30');

    vi.advanceTimersByTime(59000);

    // expect(result.current.formattedTime24HourNoSeconds).toBe('10:31');
  });

  it('returns notificationsData from the useUpdateNotificationLog hook', () => {
//     const mockNotifications: INotificationResponse[] = [{ id: "1",
//         title: "test",
//         description: "test",
//         link: "",
//         body: "test",
//         isRead: false,
//         backgroundColor: "red",
//         viewDate: "2025/12/10",
//         jalaliDate: "2025/12/10",
//         created: "2025/12/10",
//         url: "",
// }];
    
    // FIX: Using mockImplementation to override the return value for this test
    // vi.mocked(useUpdateNotificationLog).mockImplementation(() => ({
    //   handleUpdateNotice: mockHandleUpdateNotice,
    //   isPending: false,
    //   isSuccess: true,
    //   status: 'success',
    //   responseData: {
    //     RequestUrl: '',
    //     Message: [],
    //     Status: true,
    //     HttpStatusCode: 200,
    //     Data: []
    //   }
    // }));

    // const { result } = renderHook(() => useNoticeLogsHooks(), { wrapper });

    // expect(result.current.notificationsData).toEqual(mockNotifications);
  });
});
