import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OverDueReceivableChequeDetailsView from '../overDueReceivableChequeDetails';

// --- Mocking Dependencies ---
// Mock the useTheme hook to avoid needing a ThemeProvider
// const mockUseTheme = vi.fn();i have err
vi.mock('@mui/material/styles', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as any),
        useTheme: () => ({
            palette: {
                background: {
                    default: '#f0f2f5',
                },
            },
        }),
    };
});

// Mock the custom hook that fetches data
const mockUseOverDueReceivableChequesDetails = vi.fn();
vi.mock('../../Hooks/APIHooks/overDueReceivableChequesDetails', () => ({
    default: () => mockUseOverDueReceivableChequesDetails(),
}));

// Mock child components
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: ({ title }: { title: string }) => <div data-testid="mock-header">{title}</div>,
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
    default: () => <div data-testid="mock-loading">Loading...</div>,
}));

vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: ({ headerTitle, headerValue, headerUnit, rows, onToggle, isExpanded }: any) => (
        <div
            data-testid="mock-main-card"
            onClick={onToggle}
            data-expanded={isExpanded}
        >
            <span data-testid="card-header-title">{headerTitle}</span>
            <span data-testid="card-header-value">{headerValue}</span>
            <span data-testid="card-header-unit">{headerUnit}</span>
            {rows && rows.map((row: any) => (
                <div key={row.title} data-testid="card-row">
                    <span>{row.title}: </span>
                    <span>{row.value}</span>
                </div>
            ))}
        </div>
    ),
}));

vi.mock('@/core/components/profitNotFound', () => ({
    default: ({ message }: { message: string }) => <div data-testid="mock-not-found">{message}</div>,
}));

// --- Test Suite ---
describe('OverDueReceivableChequeDetailsView', () => {
    // Mock data for a successful response from the hook
    const mockChequesData = {
        chequesAmountUOM: 'تومان',
        formattedChequesAmount: '1,234,567',
        chequesQuantity: 3,
        overDueReceivableChequesDetailsDtos: [
            {
                accountName: 'John Doe',
                chequeNumber: '12345',
                issueDate: '2023/01/01',
                dueDate: '2023/02/01',
                bankName: 'Test Bank 1',
                formattedChequesAmount: '500,000',
                chequesAmountUOM: 'تومان',
            },
            {
                accountName: 'Jane Smith',
                chequeNumber: '67890',
                issueDate: '2023/01/05',
                dueDate: '2023/02/05',
                bankName: 'Test Bank 2',
                formattedChequesAmount: '734,567',
                chequesAmountUOM: 'تومان',
            },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Set a default return value for the hook to prevent destructuring errors
        mockUseOverDueReceivableChequesDetails.mockReturnValue({
            overDueReceivableChequesData: null,
            isPending: false,
        });
    });

    it('should render the loading component when data is pending', () => {
        // Arrange
        mockUseOverDueReceivableChequesDetails.mockReturnValue({
            isPending: true,
            overDueReceivableChequesData: null,
        });

        // Act
        render(<OverDueReceivableChequeDetailsView />);

        // Assert
        expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
    });

    it('should render the not found component when there is no data', () => {
        // Arrange
        mockUseOverDueReceivableChequesDetails.mockReturnValue({
            isPending: false,
            overDueReceivableChequesData: {
                ...mockChequesData,
                overDueReceivableChequesDetailsDtos: [],
            },
        });

        // Act
        render(<OverDueReceivableChequeDetailsView />);

        // Assert
        expect(screen.getByTestId('mock-not-found')).toBeInTheDocument();
        expect(screen.getByText('چک ثبت شده‌ای وجود ندارد')).toBeInTheDocument();
    });

    it('should render the cheques list and summary card with data', () => {
        // Arrange
        mockUseOverDueReceivableChequesDetails.mockReturnValue({
            isPending: false,
            overDueReceivableChequesData: mockChequesData,
        });

        // Act
        render(<OverDueReceivableChequeDetailsView />);

        // Assert: Check header and summary card
        expect(screen.getByTestId('mock-header')).toHaveTextContent('چک های تاریخ گذشته وصول نشده');
        const mainCards = screen.getAllByTestId('mock-main-card');
        expect(mainCards).toHaveLength(mockChequesData.overDueReceivableChequesDetailsDtos.length + 1); // 1 summary card + 2 detail cards

        // Check summary card props
        expect(mainCards[0]).toHaveTextContent('جمع کل مبالغ');
        expect(mainCards[0]).toHaveTextContent('1,234,567');
        expect(mainCards[0]).toHaveTextContent('تعداد: 3');

        // Check first detail card props
        expect(mainCards[1]).toHaveTextContent('Test Bank 1');
        expect(mainCards[1]).toHaveTextContent('500,000');
        expect(mainCards[1]).toHaveTextContent('نام صاحب حساب: John Doe');
    });

    it('should toggle the expanded card state on click', () => {
        // Arrange
        mockUseOverDueReceivableChequesDetails.mockReturnValue({
            isPending: false,
            overDueReceivableChequesData: mockChequesData,
        });

        render(<OverDueReceivableChequeDetailsView />);
        const detailCards = screen.getAllByTestId('mock-main-card').slice(1);

        // Assert initial state: The first card should be expanded
        expect(detailCards[0]).toHaveAttribute('data-expanded', 'true');
        expect(detailCards[1]).toHaveAttribute('data-expanded', 'false');

        // Act: Click the second card
        fireEvent.click(detailCards[1]);

        // Assert new state: The second card should now be expanded and the first collapsed
        expect(detailCards[0]).toHaveAttribute('data-expanded', 'false');
        expect(detailCards[1]).toHaveAttribute('data-expanded', 'true');

        // Act: Click the second card again to collapse it
        fireEvent.click(detailCards[1]);

        // Assert final state: Both cards should be collapsed
        expect(detailCards[0]).toHaveAttribute('data-expanded', 'false');
        expect(detailCards[1]).toHaveAttribute('data-expanded', 'false');
    });
});
