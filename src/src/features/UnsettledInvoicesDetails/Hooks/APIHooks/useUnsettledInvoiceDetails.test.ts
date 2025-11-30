import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUnsettledInvoiceDetails from "./useUnsettledInvoicesDetails";
import axiosInstance from "@/core/constant/axios";
import { toast } from "react-toastify";
import type { IResponse } from "@/core/types/responseModel";
import type { UnsettledInvoicesDataDetails } from "../../types";
import React from "react";


vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

vi.mock('@/core/constant/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

let queryClient: QueryClient;

beforeEach(() => {
    queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
});


const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockSuccessData: IResponse<UnsettledInvoicesDataDetails[]> = {
    Status: true,
    Data: [],
    Message: [],
    RequestUrl: '/SalesRevenue/GetUnsettledInvoicesDetails',
    HttpStatusCode: 200,
};

describe('useUnsettledInvoiceDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch data successfully and return the correct state', async () => {
        // Set up the mock for axiosInstance.get to return the mock data
        (axiosInstance.get as any).mockResolvedValue({ data: mockSuccessData });

        const { result } = renderHook(() => useUnsettledInvoiceDetails(), { wrapper });

        await waitFor(() => {
            expect(result.current.isPending).toBe(false);
        });
        
        expect(result.current.data).toEqual(mockSuccessData);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        expect(toast.error).not.toHaveBeenCalled();
        expect(axiosInstance.get).toHaveBeenCalledWith('SalesRevenue/GetUnsettledInvoicesDetails?daysType=Last7Days');
    });

});