import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useGetAllPersonality from './useGetAllPersonality';
import axiosInstance from '@/core/constant/axios';
import type { IPersonality } from '../../types';

// Mock dependencies
vi.mock('@/core/constant/axios', () => ({
  default: { get: vi.fn() }
}));

vi.mock('react-toastify', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((message: string) => `translated_${message}`),
}));

const mockGet = vi.mocked(axiosInstance).get as any;
const mockToast = vi.mocked(toast);

describe('useGetAllPersonality', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockPersonalities: IPersonality[] = [
    {
      id: '1',
      name: 'Market Savvy',
      picture: '/path/to/image1.jpg',
      summery: 'Market savvy summary',
      description: 'A market-savvy personality'
    },
    {
      id: '2',
      name: 'Conservative',
      picture: '/path/to/image2.jpg',
      summery: 'Conservative summary',
      description: 'A conservative personality'
    }
  ];

  const mockSuccessResponse = {
    Status: true,
    Message: [],
    Data: mockPersonalities
  };

  const mockErrorResponse = {
    Status: false,
    Message: ['Error occurred', 'Something went wrong'],
    Data: null
  };

  it('should successfully fetch personalities', async () => {
    mockGet.mockResolvedValueOnce({
      data: mockSuccessResponse
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify the data was fetched correctly
    expect(result.current.personalitiesData).toEqual(mockPersonalities);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify axios was called with correct endpoint
    expect(mockGet).toHaveBeenCalledWith('/Personality/GetAllPersonalitySync');
  });

  it('should handle API error response and show error messages', async () => {
    mockGet.mockResolvedValueOnce({
      data: mockErrorResponse
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify error toasts were shown for each message
    expect(mockToast.error).toHaveBeenCalledWith('translated_Error occurred');
    expect(mockToast.error).toHaveBeenCalledWith('translated_Something went wrong');

    // Verify the data is null
    expect(result.current.personalitiesData).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should handle response with empty message array', async () => {
    const mockResponseWithEmptyMessages = {
      ...mockErrorResponse,
      Message: []
    };

    mockGet.mockResolvedValueOnce({
      data: mockResponseWithEmptyMessages
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify no error toasts were shown
    expect(mockToast.error).not.toHaveBeenCalled();

    // Verify the data is null
    expect(result.current.personalitiesData).toBeNull();
  });

  it('should handle response with single error message', async () => {
    const mockResponseWithSingleMessage = {
      ...mockErrorResponse,
      Message: ['Single error message']
    };

    mockGet.mockResolvedValueOnce({
      data: mockResponseWithSingleMessage
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify error toast was shown
    expect(mockToast.error).toHaveBeenCalledWith('translated_Single error message');
    expect(mockToast.error).toHaveBeenCalledTimes(1);
  });

  it('should handle axios error', async () => {
    const axiosError = new Error('Network error');
    mockGet.mockRejectedValueOnce(axiosError);

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify error state
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.personalitiesData).toBeUndefined();

    // Verify no toasts were shown (axios errors don't trigger toast logic)
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.personalitiesData).toBeUndefined();
  });

  it('should handle response with null data', async () => {
    const mockResponseWithNullData = {
      ...mockSuccessResponse,
      Data: null
    };

    mockGet.mockResolvedValueOnce({
      data: mockResponseWithNullData
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify the data is null when Data is null
    expect(result.current.personalitiesData).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should handle response with empty data array', async () => {
    const mockResponseWithEmptyData = {
      ...mockSuccessResponse,
      Data: []
    };

    mockGet.mockResolvedValueOnce({
      data: mockResponseWithEmptyData
    });

    const { result } = renderHook(() => useGetAllPersonality(), { wrapper });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Verify the data is an empty array
    expect(result.current.personalitiesData).toEqual([]);
    expect(result.current.isError).toBe(false);
  });
});
