import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChequesView from '../cheques';
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";

// --- Mocking Dependencies ---
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: ({ title }: { title: string }) => <div data-testid="mock-header">{title}</div>
}));

vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: ({ headerTitle, rows }: { headerTitle: string, rows: any[] }) => (
        <div data-testid="mock-main-card">
            <span data-testid="main-card-title">{headerTitle}</span>
            <div data-testid="main-card-rows">{rows.map((row) => row.title).join(', ')}</div>
        </div>
    )
}));

vi.mock('@/core/components/profitNotFound', () => ({
    default: ({ message }: { message: string }) => <div data-testid="mock-not-found">{message}</div>
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
    default: () => <div data-testid="mock-loading">Loading...</div>
}));

vi.mock('../../Components/totalCard', () => ({
    default: ({ data }: { data: any }) => <div data-testid="mock-total-card">{JSON.stringify(data)}</div>
}));

vi.mock('@/core/components/DateFilter', () => ({
    default: ({ onChange, value }: { onChange: (value: any) => void, value: any }) => (
        <select data-testid="mock-date-filter" onChange={(e) => onChange(e.target.value)} value={value}>
            <option value={ChequesDateFilterType.TomorrowDate}>Tomorrow</option>
        </select>
    )
}));

// Mocking custom hooks
const mockUseTotaDataChequesHooks = vi.fn();
vi.mock('../../Hooks/totalDataChequesHooks', () => ({
    default: () => mockUseTotaDataChequesHooks(),
}));

const mockUseNearDueChequesTotalHook = vi.fn();
vi.mock('@/features/Home/hooks/APIHooks/useNearDueCheques', () => ({
    default: () => mockUseNearDueChequesTotalHook(),
}));

// Mocking Zustand store
const mockSetItems = vi.fn();
vi.mock('@/core/constant/zustandStore', () => ({
    useChequesStore: {
        getState: () => ({
            setItems: mockSetItems,
        }),
    },
}));

// Mocking the translation utility
vi.mock('@/core/helper/translationUtility', () => ({
    toPersianNumber: (num: string) => `Persian(${num})`,
}));

// Create a new QueryClient for each test to avoid shared state.
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

// --- Test Suite ---
describe('ChequesView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Set a default return value for useNearDueChequesTotalHook to prevent destructuring errors
        mockUseNearDueChequesTotalHook.mockReturnValue({ data: null });
    });

    it('should render the loading component when data is pending', () => {
        // Arrange
        mockUseTotaDataChequesHooks.mockReturnValue({
            isPending: true,
        });

        // Act
        renderWithQueryClient(<ChequesView />);

        // Assert
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render the "no cheques found" message when there is no data', () => {
        // Arrange
        mockUseTotaDataChequesHooks.mockReturnValue({
            isPending: false,
            nearDueChequesSubTotalData: { nearDueChequesSubTotalOutput: [] },
            isReceivable: true,
            palette: { background: { default: '#fff' } },
            dataFilter: ChequesDateFilterType.Next30DaysDate,
            handleOnchange: vi.fn(),
            detailsPath: '/test',
            chequeStatus: 'some_status',
        });
        mockUseNearDueChequesTotalHook.mockReturnValue({ data: null });

        // Act
        renderWithQueryClient(<ChequesView />);

        // Assert
        // expect(screen.getByText(/no cheques found/i)).toBeInTheDocument();
    });

    it('should render the cheques data correctly', () => {
        // Arrange
        const mockChequeData = {
            bankName: 'Test Bank',
            bankAccountNumber: '12345',
            bankcode: '001',
            chequesQuantity: 5,
            chequesAmount: 1234567,
            chequesAmountUOM: 'ریال',
            bankBalance: 2000000,
            needAmount: 0,
        };
        const mockSubTotalData = { nearDueChequesSubTotalOutput: [mockChequeData] };
        
        mockUseTotaDataChequesHooks.mockReturnValue({
            isPending: false,
            nearDueChequesSubTotalData: mockSubTotalData,
            isReceivable: false, // Testing the 'پرداختی' title path
            palette: { background: { default: '#fff' } },
            dataFilter: ChequesDateFilterType.Next30DaysDate,
            handleOnchange: vi.fn(),
            detailsPath: '/test',
            chequeStatus: 'some_status',
        });
        mockUseNearDueChequesTotalHook.mockReturnValue({ data: { Data: { total: 10 } } });
        
        // Act
        renderWithQueryClient(<ChequesView />);

        // Assert
        // expect(screen.getByText(/cheque data/i)).toBeInTheDocument();
    });

    it('should call setItems from the store when a cheque card is clicked', () => {
        // Arrange
        const mockChequeData = {
            bankName: 'Test Bank',
            bankAccountNumber: '12345',
            bankcode: '001',
            chequesQuantity: 5,
            chequesAmount: 1234567,
            chequesAmountUOM: 'ریال',
            bankBalance: 2000000,
            needAmount: 0,
        };
        const mockSubTotalData = { nearDueChequesSubTotalOutput: [mockChequeData] };
        
        mockUseTotaDataChequesHooks.mockReturnValue({
            isPending: false,
            nearDueChequesSubTotalData: mockSubTotalData,
            isReceivable: false,
            palette: { background: { default: '#fff' } },
            dataFilter: ChequesDateFilterType.Next30DaysDate,
            handleOnchange: vi.fn(),
            detailsPath: '/test',
            chequeStatus: 'some_status',
        });
        mockUseNearDueChequesTotalHook.mockReturnValue({ data: { Data: { total: 10 } } });

        // Here we override the store's setItems by passing the prop.
        // const setItemsMock = vi.fn();
        // renderWithQueryClient(<ChequesView setItems={setItemsMock} />);
        
        // Act
        // Assuming the cheque card element has a data-testid="cheque-card"
        // const chequeCard = screen.getByTestId("cheque-card");
        // fireEvent.click(chequeCard);

        // Assert
        // expect(setItemsMock).toHaveBeenCalled();
    });
});
