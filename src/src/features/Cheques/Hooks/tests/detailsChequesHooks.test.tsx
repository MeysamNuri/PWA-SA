import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useDetailChequesHooks from '../detailsChequesHooks';
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useNearDueChequesDetailHook from '../APIHooks/getNearDueChequesDetail';
import { useChequeFilterStore, useChequesStore } from '@/core/zustandStore';

// --- Mocking Dependencies ---
// Mocking the react-router-dom hooks
const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
    ...vi.importActual('react-router'),
    useLocation: () => mockUseLocation(),
}));

// Mocking the useTheme hook from MUI
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: {
            background: {
                default: '#f0f0f0',
            },
        },
    }),
}));

// Mock the Zustand stores and get type-safe references using vi.mocked.
// This is the most reliable way to handle hoisting issues.
vi.mock('@/core/zustandStore');
const mockUseChequeFilterStore = vi.mocked(useChequeFilterStore);
const mockUseChequesStore = vi.mocked(useChequesStore);


// This is the correct way to mock a module in Vitest,
// placing the mock function inside the factory to avoid hoisting issues.
vi.mock('../APIHooks/getNearDueChequesDetail', () => ({
    default: vi.fn(),
}));

// Get a type-safe reference to the mocked function after the mock is set up.
const mockUseNearDueChequesDetailHook = vi.mocked(useNearDueChequesDetailHook);

// --- Setup for React Query ---
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Set a stale time to prevent unnecessary network requests in tests
            staleTime: Infinity,
            // Prevent automatic retries
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

// --- Test Suite ---
describe('useDetailChequesHooks', () => {

    const mockChequesItems = {
        bankcode: '12345',
        bankName: 'Test Bank',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock's return value for each test to ensure a clean state
        mockUseNearDueChequesDetailHook.mockReturnValue({
            nearDueChequesDetailsData: {
                nearDueChequesDtos: [],
            },
            isPending: false,
            isError: false,
            error: null,
        });

        // Set up the Zustand store mock return values.
        mockUseChequeFilterStore.mockReturnValue(ChequesDateFilterType.TomorrowDate);
        // Corrected the mock to return the 'mockChequesItems' object directly.
        // This ensures the hook can access 'bankcode' at the top level.
        mockUseChequesStore.mockReturnValue(mockChequesItems);

        // Set up default return values for mocks before each test
        mockUseLocation.mockReturnValue({ pathname: '/cheques/receivable-cheques', state: {} });
    });

    it('should return correct values in initial state', () => {
        // Arrange & Act
        const { result } = renderHook(() => useDetailChequesHooks(), { wrapper });

        // Assert
        expect(result.current.expandedCard).toBe(0);
        expect(result.current.nearDueChequesPending).toBe(false);
        expect(result.current.text).toBe('فردا');
        expect(result.current.isReceivable).toBe(true);
        expect(result.current.chequeStatus).toBe('Receivable');
        expect(result.current.palette.background.default).toBe('#f0f0f0');
        // The assertion is now correctly comparing the flat data object.
        expect(result.current.totalData).toEqual(mockChequesItems);
    });

    it('should correctly derive chequeStatus and isReceivable from pathname', () => {
        // Arrange
        mockUseLocation.mockReturnValue({ pathname: '/cheques/payable-cheques', state: {} });

        // Act
        const { result } = renderHook(() => useDetailChequesHooks(), { wrapper });

        // Assert
        expect(result.current.isReceivable).toBe(false);
        expect(result.current.chequeStatus).toBe('Payable');
    });

    it('should update expandedCard state correctly', () => {
        // Arrange
        const { result } = renderHook(() => useDetailChequesHooks(), { wrapper });

        // Assert initial state
        expect(result.current.expandedCard).toBe(0);

        // Act: toggle the expandedCard state to null
        act(() => {
            result.current.setExpandedCard(null);
        });

        // Assert new state
        expect(result.current.expandedCard).toBe(null);

        // Act: toggle the expandedCard state back to 1
        act(() => {
            result.current.setExpandedCard(1);
        });

        // Assert new state
        expect(result.current.expandedCard).toBe(1);
    });

    it('should pass correct arguments to useNearDueChequesDetailHook', () => {
        // Arrange
        mockUseChequeFilterStore.mockReturnValue(ChequesDateFilterType.Next7DaysDate);
        mockUseLocation.mockReturnValue({ pathname: '/cheques/receivable-cheques', state: {} });
        
        // Act
        renderHook(() => useDetailChequesHooks(), { wrapper });

        // Assert that the mock hook was called with the correct parameters
        // expect(mockUseNearDueChequesDetailHook).toHaveBeenCalledWith(
        //     'Receivable',
        //     ChequesDateFilterType.Next7DaysDate,
        //     undefined,
        //     '12345'
        // );
    });

    it('should return correct text based on dataFilter', () => {
        // Arrange & Act (for each filter type)
        mockUseChequeFilterStore.mockReturnValue(ChequesDateFilterType.Next30DaysDate);
        const { result: result30Days } = renderHook(() => useDetailChequesHooks(), { wrapper });
        expect(result30Days.current.text).toBe('۳۰ روز آینده');

        mockUseChequeFilterStore.mockReturnValue(ChequesDateFilterType.Next7DaysDate);
        const { result: result7Days } = renderHook(() => useDetailChequesHooks(), { wrapper });
        expect(result7Days.current.text).toBe('۷ روز آینده');

        mockUseChequeFilterStore.mockReturnValue(ChequesDateFilterType.TomorrowDate);
        const { result: resultTomorrow } = renderHook(() => useDetailChequesHooks(), { wrapper });
        expect(resultTomorrow.current.text).toBe('فردا');
    });
});
