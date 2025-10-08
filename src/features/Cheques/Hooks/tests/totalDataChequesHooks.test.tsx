import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useTotaDataChequesHooks from '../totalDataChequesHooks';
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useNearDueChequesSubTotalHook from '../APIHooks/getNearDueChequesSubTotal';
import { useChequeFilterStore } from '@/core/constant/zustandStore';


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

// Mock the Zustand store and get a type-safe reference
vi.mock('@/core/constant/zustandStore');

// Mock the hook module directly by providing a mock function in the factory.
// This resolves the hoisting issue.
vi.mock('../APIHooks/getNearDueChequesSubTotal', () => ({
    default: vi.fn(),
}));

// Now, get a type-safe reference to the mocked function.
const mockUseChequeFilterStore = vi.mocked(useChequeFilterStore);
const mockUseNearDueChequesSubTotalHook = vi.mocked(useNearDueChequesSubTotalHook);

// --- Setup for React Query ---
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
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
describe('useTotaDataChequesHooks', () => {

    // Declare a mock function to be used for setDataFilter
    let mockSetDataFilter: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // Initialize the mock function for setDataFilter inside beforeEach
        mockSetDataFilter = vi.fn();

        // Reset the mock's return value for each test
        mockUseLocation.mockReturnValue({ pathname: '/cheques/receivable-cheques' });
        
        // Corrected mock data to include all properties required by the return type.
        mockUseNearDueChequesSubTotalHook.mockReturnValue({
            nearDueChequesSubTotalData: {
                nearDueChequesSubTotalOutput: [],
            },
            isPending: false,
            isError: false,
            error: null,
        });
        
        // Correctly mock the Zustand store's selector behavior
        // The mock implementation will check the selector function passed to it
        // and return the appropriate mock value.
        mockUseChequeFilterStore.mockImplementation((selector: any) => {
            const mockState = {
                setDataFilter: mockSetDataFilter,
                dataFilter: ChequesDateFilterType.TomorrowDate,
            };
            return selector(mockState);
        });
    });

    it('should return the correct initial values', () => {
        // Arrange & Act
        const { result } = renderHook(() => useTotaDataChequesHooks(), { wrapper });

        // Assert
        expect(result.current.isReceivable).toBe(true);
        expect(result.current.chequeStatus).toBe('Receivable');
        expect(result.current.dataFilter).toBe(ChequesDateFilterType.TomorrowDate);
        expect(result.current.detailsPath).toBe('/cheques/receivable-cheques/details');
        expect(result.current.isPending).toBe(false);
        expect(result.current.nearDueChequesSubTotalData).toEqual({ nearDueChequesSubTotalOutput: [] });
        expect(result.current.palette.background.default).toBe('#f0f0f0');
    });

    it('should call setDataFilter with the correct value when handleOnchange is called', () => {
        // Arrange
        const { result } = renderHook(() => useTotaDataChequesHooks(), { wrapper });
        const newValue = ChequesDateFilterType.Next7DaysDate;

        // Act
        act(() => {
            result.current.handleOnchange(newValue);
        });

        // Assert
        expect(mockSetDataFilter).toHaveBeenCalledWith(newValue);
    });

    it('should correctly derive chequeStatus and isReceivable from pathname for payable cheques', () => {
        // Arrange
        mockUseLocation.mockReturnValue({ pathname: '/cheques/payable-cheques' });
        
        // Act
        const { result } = renderHook(() => useTotaDataChequesHooks(), { wrapper });

        // Assert
        expect(result.current.isReceivable).toBe(false);
        expect(result.current.chequeStatus).toBe('Payable');
        expect(result.current.detailsPath).toBe('/cheques/payable-cheques/details');
    });

    it('should pass correct arguments to useNearDueChequesSubTotalHook', () => {
        // Arrange
        mockUseLocation.mockReturnValue({ pathname: '/cheques/receivable-cheques' });

        // Change the mock implementation for this specific test
        mockUseChequeFilterStore.mockImplementation((selector: any) => {
            const mockState = {
                setDataFilter: mockSetDataFilter,
                dataFilter: ChequesDateFilterType.Next30DaysDate,
            };
            return selector(mockState);
        });
        
        // Act
        renderHook(() => useTotaDataChequesHooks(), { wrapper });

        // Assert
        expect(mockUseNearDueChequesSubTotalHook).toHaveBeenCalledWith('Receivable', ChequesDateFilterType.Next30DaysDate);
    });
});
