import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useUnsettledInvoices from '../useUnsettledInvoices';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { UnsettledInvoicesData } from '../../../types';

// Mock axiosInstance
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock translation utility
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((text: string) => text),
}));

describe('useUnsettledInvoices', () => {
  let queryClient: QueryClient;
  const mockAxiosInstance = axiosInstance as any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  const mockSuccessResponse: IResponse<UnsettledInvoicesData> = {
    Status: true,
    Data: {
      unsettledQuantity: 5,
      unsettledAmount: 1500000,
      formattedUnsettledAmount: "۱,۵۰۰,۰۰۰",
      unsettledAmountUOM: "تومان",
    },
    Message: [],
    RequestUrl: '/SalesRevenue/GetUnsettledInvoices',
    HttpStatusCode: 200,
  };

  const mockErrorResponse: IResponse<UnsettledInvoicesData> = {
    Status: false,
    Data: null as any,
    Message: ["Error message 1", "Error message 2"],
    RequestUrl: '/SalesRevenue/GetUnsettledInvoices',
    HttpStatusCode: 400,
  };

  describe('Successful API calls', () => {
    it('should return data when API call is successful', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSuccessResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toEqual(mockSuccessResponse);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading state correctly', () => {
      mockAxiosInstance.get.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle API errors correctly', async () => {
      const errorMessage = 'Network Error';
      mockAxiosInstance.get.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle API response with Status: false', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockErrorResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toEqual(mockErrorResponse);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Toast notifications', () => {
    it('should show toast error when Status is false', async () => {
      const { toast } = await import('react-toastify');
      const { getTranslation } = await import('@/core/helper/translationUtility');
      
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockErrorResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      // Wait for useEffect to run
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledTimes(2);
        expect(toast.error).toHaveBeenCalledWith("Error message 1");
        expect(toast.error).toHaveBeenCalledWith("Error message 2");
        expect(getTranslation).toHaveBeenCalledTimes(2);
      });
    });

    it('should not show toast when Status is true', async () => {
      const { toast } = await import('react-toastify');
      
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSuccessResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      // Wait for useEffect to run
      await waitFor(() => {
        expect(toast.error).not.toHaveBeenCalled();
      });
    });

    it('should not show toast when Message is empty', async () => {
      const { toast } = await import('react-toastify');
      
      const responseWithEmptyMessage: IResponse<UnsettledInvoicesData> = {
        Status: false,
        Data: null as any,
        Message: [],
        RequestUrl: '/SalesRevenue/GetUnsettledInvoices',
        HttpStatusCode: 400,
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: responseWithEmptyMessage });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      // Wait for useEffect to run
      await waitFor(() => {
        expect(toast.error).not.toHaveBeenCalled();
      });
    });
  });

  describe('Query configuration', () => {
    it('should use correct query key', () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSuccessResponse });

      renderHook(() => useUnsettledInvoices(), { wrapper });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/SalesRevenue/GetUnsettledInvoices');
    });

    it('should call the correct API endpoint', () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSuccessResponse });

      renderHook(() => useUnsettledInvoices(), { wrapper });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/SalesRevenue/GetUnsettledInvoices');
    });
  });

  describe('Return values', () => {
    it('should return all expected properties', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSuccessResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('error');
    });
  });

  describe('Edge cases', () => {
    it('should handle null data response', async () => {
      const nullDataResponse: IResponse<UnsettledInvoicesData> = {
        Status: true,
        Data: null as any,
        Message: [],
        RequestUrl: '/SalesRevenue/GetUnsettledInvoices',
        HttpStatusCode: 200,
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: nullDataResponse });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toEqual(nullDataResponse);
      expect(result.current.isError).toBe(false);
    });

    it('should handle undefined data response', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: undefined });

      const { result } = renderHook(() => useUnsettledInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true); // React Query treats undefined as an error
    });
  });
});