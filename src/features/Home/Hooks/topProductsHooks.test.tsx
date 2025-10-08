import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useTopProductsData from './topProductsHooks';
import useTopMostSoldProduct from '../Hooks/APIHooks/useTopMostSoldProduct';
import useTopMostRevenuableProduct from '../Hooks/APIHooks/useTopMostRevenuableProduct';

// Mock the react-router useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: vi.fn(() => mockNavigate),
}));

// Mock the API hooks to control their return values for testing different states
const mockSoldData = {
    Data: {
        topNMostProductsByPrices: [{ title: 'Product A' }],
        topNMostProductsByQuantity: [{ title: 'Product B' }],
    },
};
const mockRevenuableData = {
    Data: {
        topNMostRevenuableProducts: [{ title: 'Product C' }],
        topNMostRevenuableProductsByRevenuPercentage: [{ title: 'Product D' }],
    },
};

vi.mock('../Hooks/APIHooks/useTopMostSoldProduct', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        data: mockSoldData,
        isPending: false,
        isError: false, // Added isError
        error: null,
    })),
}));

vi.mock('../Hooks/APIHooks/useTopMostRevenuableProduct', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        data: mockRevenuableData,
        isPending: false,
        isError: false, // Added isError
        error: null,
    })),
}));

describe('useTopProductsData', () => {

    // Test Case 1: Verifies that the hook returns the correct initial state and derived values.
    it('should return initial state and derived data correctly', () => {
        const { result } = renderHook(() => useTopProductsData());

        // Assert initial state
        expect(result.current.selectedChip).toBe('Last7Days');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();

        // Assert derived data from mock hooks
        expect(result.current.topSoldByPrice).toEqual({ title: 'Product A' });
        expect(result.current.topSoldByQuantity).toEqual({ title: 'Product B' });
        expect(result.current.topRevenuableByAmount).toEqual({ title: 'Product C' });
        expect(result.current.topRevenuableByPercent).toEqual({ title: 'Product D' });
    });

    // Test Case 2: Verifies that the selectedChip state updates when `handleDaysChange` is called.
    it('should update selectedChip state on handleDaysChange', () => {
        const { result } = renderHook(() => useTopProductsData());

        // Use 'act' to simulate a state update triggered by a user action
        act(() => {
            result.current.handleDaysChange(null, 'Last30Days');
        });

        // Assert that the state has been updated
        expect(result.current.selectedChip).toBe('Last30Days');
    });

    // Test Case 3: Verifies that `handleSoldProductClick` navigates to the correct path.
    it('should navigate to topSellingProducts on handleSoldProductClick', () => {
        const { result } = renderHook(() => useTopProductsData());

        act(() => {
            result.current.handleSoldProductClick();
        });

        // Assert that the mock `navigate` function was called with the correct argument
        expect(mockNavigate).toHaveBeenCalledWith('/topSellingProducts');
    });

    // Test Case 4: Verifies that `handleRevenuableProductClick` navigates to the correct path.
    it('should navigate to topRevenuableProducts on handleRevenuableProductClick', () => {
        const { result } = renderHook(() => useTopProductsData());

        act(() => {
            result.current.handleRevenuableProductClick();
        });

        // Assert that the mock `navigate` function was called with the correct argument
        expect(mockNavigate).toHaveBeenCalledWith('/topRevenuableProducts');
    });

    // Test Case 5: Verifies that the loading state is true if either API hook is pending.
    it('should have loading true when useTopMostSoldProduct is pending', () => {
        // Re-mock the API hook to return a loading state
        vi.mocked(useTopMostSoldProduct).mockReturnValue({
            data: undefined,
            isPending: true,
            isError: false, // Added isError
            error: null,
        });

        const { result } = renderHook(() => useTopProductsData());
        
        // Assert that the loading state is correctly derived
        expect(result.current.loading).toBe(true);
    });

    // Test Case 6: Verifies that an error state is returned if either API hook returns an error.
    it('should have an error when useTopMostRevenuableProduct returns an error', () => {
        // Re-mock the API hook to return an error state
        const mockError = new Error('Revenuable API Error');
        vi.mocked(useTopMostRevenuableProduct).mockReturnValue({
            data: undefined,
            isPending: false,
            isError: true, // Added isError
            error: mockError,
        });

        const { result } = renderHook(() => useTopProductsData());
        
        // Assert that the error state is correctly derived
        expect(result.current.error).toBe(mockError);
    });

});
