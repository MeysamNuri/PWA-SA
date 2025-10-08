import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChequesDetailsView from '../chequesDetails';

// --- Mocking Dependencies ---
// Mocking external components to isolate ChequesDetailsView
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: ({ title, path }: { title: string, path: string }) => (
        <div data-testid="mock-inner-page-header">
            <span data-testid="header-title">{title}</span>
            <span data-testid="header-path">{path}</span>
        </div>
    ),
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
    default: () => <div data-testid="mock-loading">Loading...</div>,
}));

vi.mock('../../Components/renderedChequeList', () => ({
    default: ({ nearDueChequesDetailsData }: { nearDueChequesDetailsData: any }) => (
        <div data-testid="mock-cheques-list">{JSON.stringify(nearDueChequesDetailsData)}</div>
    ),
}));

vi.mock('../../Components/renderSummaryCard', () => ({
    default: ({ totalData, isReceivable }: { totalData: any, isReceivable: boolean }) => (
        <div data-testid="mock-summary-card">
            <span data-testid="summary-data">{JSON.stringify(totalData)}</span>
            <span data-testid="summary-is-receivable">{String(isReceivable)}</span>
        </div>
    ),
}));

// Mocking the custom hook used in the component
const mockUseDetailChequesHooks = vi.fn();
vi.mock('../../Hooks/detailsChequesHooks', () => ({
    default: () => mockUseDetailChequesHooks(),
}));

// --- Test Suite ---
describe('ChequesDetailsView', () => {
    // A mock data object that can be reused across tests
    const mockHookReturn = {
        text: 'Test Bank',
        palette: { background: { default: '#fff' } },
        nearDueChequesPending: false,
        totalData: { totalAmount: 5000000, totalCount: 10 },
        isReceivable: true,
        chequeStatus: 'Receivable',
        nearDueChequesDetailsData: [{ id: 1, amount: 1000 }],
        setExpandedCard: vi.fn(),
        expandedCard: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the loading component when data is pending', () => {
        // Arrange: Mock the hook to return a pending state
        mockUseDetailChequesHooks.mockReturnValue({
            ...mockHookReturn,
            nearDueChequesPending: true,
        });

        // Act
        render(<ChequesDetailsView />);

        // Assert: The loading component should be in the document
        expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-inner-page-header')).not.toBeInTheDocument();
    });

    it('should render the details view with "Receivable" title when chequeStatus is Receivable', () => {
        // Arrange: Mock the hook to return data for receivable cheques
        mockUseDetailChequesHooks.mockReturnValue({
            ...mockHookReturn,
            chequeStatus: 'Receivable',
        });

        // Act
        render(<ChequesDetailsView />);

        // Assert: The header title should be correct
        const headerTitle = screen.getByTestId('header-title');
        expect(headerTitle).toBeInTheDocument();
        expect(headerTitle).toHaveTextContent('ریز چک های دریافتی Test Bank');

        // Assert: The other components should also be rendered
        expect(screen.getByTestId('mock-summary-card')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cheques-list')).toBeInTheDocument();
    });

    it('should render the details view with "Payable" title when chequeStatus is not Receivable', () => {
        // Arrange: Mock the hook to return data for payable cheques
        mockUseDetailChequesHooks.mockReturnValue({
            ...mockHookReturn,
            chequeStatus: 'Payable',
            isReceivable: false,
        });

        // Act
        render(<ChequesDetailsView />);

        // Assert: The header title should be correct
        const headerTitle = screen.getByTestId('header-title');
        expect(headerTitle).toBeInTheDocument();
        expect(headerTitle).toHaveTextContent('ریز چک های پرداختی Test Bank');
    });

    it('should pass correct props to RenderSummaryCard and RenderChequesList', () => {
        // Arrange: Mock the hook to return full data
        mockUseDetailChequesHooks.mockReturnValue(mockHookReturn);

        // Act
        render(<ChequesDetailsView />);

        // Assert: Check props passed to RenderSummaryCard
        const summaryCard = screen.getByTestId('mock-summary-card');
        expect(summaryCard).toBeInTheDocument();
        expect(screen.getByTestId('summary-data')).toHaveTextContent(JSON.stringify(mockHookReturn.totalData));
        expect(screen.getByTestId('summary-is-receivable')).toHaveTextContent(String(mockHookReturn.isReceivable));
        
        // Assert: Check props passed to RenderChequesList
        const chequesList = screen.getByTestId('mock-cheques-list');
        expect(chequesList).toBeInTheDocument();
        expect(chequesList).toHaveTextContent(JSON.stringify(mockHookReturn.nearDueChequesDetailsData));
    });
});
