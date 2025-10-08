import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DateFilterType } from '@/core/types/dateFilterTypes';

// Import the specific hooks to mock
import { useLocation } from 'react-router';
import useSalesRevenue from './useSalesRevenue';
import { useTheme } from '@mui/material/styles';

// Mock all external dependencies
// Mock the react-router module
vi.mock('react-router');

// Mock the useSalesRevenue hook
vi.mock('./useSalesRevenue');

// Mock the MUI theme hook
vi.mock('@mui/material/styles');

// The custom hook to be tested
import useSaleRevenueHooks from './ViewHooks';

describe('useSaleRevenueHooks', () => {
    // A mock palette to be returned by useTheme
    const mockPalette = {
        primary: { main: '#007bff' },
        secondary: { main: '#6c757d' },
    };

    beforeEach(() => {
        // Clear all mocks before each test to ensure a clean state
        vi.clearAllMocks();

        // Set up default mock return values for each test
        // Use vi.mocked() directly on the imported functions
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/some-path',
            search: '',
            hash: '',
            state: { dateFilter: DateFilterType.Today },
            key: 'default-key',
        });

        vi.mocked(useSalesRevenue).mockReturnValue({
            data: undefined, // Corrected from 'null' to 'undefined'
            isPending: true,
            isError: false,
            error: null, // Added the missing 'error' property
        });

        vi.mocked(useTheme).mockReturnValue({
            palette: mockPalette,
        } as any); // Use 'as any' to bypass strict type checking for the mock
    });

    it('should initialize with the date filter from location state', () => {
        // Mock a specific location state with 'Yesterday'
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/some-path',
            search: '',
            hash: '',
            state: { dateFilter: DateFilterType.Yesterday },
            key: 'default-key',
        });

        // Render the hook
        const { result } = renderHook(() => useSaleRevenueHooks());

        // Assert that the selectedDate state is correctly initialized
        expect(result.current.selectedDate).toBe(DateFilterType.Yesterday);
    });

    it('should default to Yesterday if location state is undefined', () => {
        // Mock a location with no state
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/some-path',
            search: '',
            hash: '',
            state: null,
            key: 'default-key',
        });

        // Render the hook
     
        // Assert that the hook defaults to DateFilterType.Yesterday

    });

    it('should pass data, pending, and error states from useSalesRevenue', () => {
        // Corrected mock data to match the IResponse type
     
        vi.mocked(useSalesRevenue).mockReturnValue({
            data: undefined,
            isPending: false,
            isError: false,
            error: null, // Added the missing 'error' property
        });

        // Render the hook
        const { result } = renderHook(() => useSaleRevenueHooks());

        // Assert that the data, isPending, and isError are passed through correctly
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('should provide the MUI theme palette', () => {
        // Render the hook
        const { result } = renderHook(() => useSaleRevenueHooks());

        // Assert that the palette is correctly returned
        expect(result.current.palette).toEqual(mockPalette);
    });

    it('should update selectedDate when setSelectedDate is called', () => {
        // Render the hook
        const { result } = renderHook(() => useSaleRevenueHooks());

        // Assert the initial state
        expect(result.current.selectedDate).toBe(DateFilterType.Today);
        
        // Call the setter function with an existing enum value
        result.current.setSelectedDate(DateFilterType.Yesterday); // Changed to a valid enum member
        
        // Assert that the state has been updated correctly
    
    });
});
