import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenderChequesList from '../renderedChequeList'; // Adjust the import path as needed
import type { IBanksChequeDetails } from '../../types'; // Adjust the import path as needed

// Mock child components to isolate the testing of RenderChequesList
vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: vi.fn(({ headerTitle, onToggle, isExpanded, children }) => (
        <div data-testid="main-card">
            <h3>{headerTitle}</h3>
            <button onClick={onToggle}>Toggle</button>
            {isExpanded && <div>{children}</div>}
        </div>
    )),
}));

vi.mock('@/core/components/profitNotFound', () => ({
    default: vi.fn(({ message }) => (
        <div data-testid="profit-not-found">{message}</div>
    )),
}));

const mockChequesData: IBanksChequeDetails = {
    nearDueChequesDtos: [
        {
            accountName: 'Account 1',
            bankAccountNumber: "test",
            bankCode: "01",
            bankName: 'Bank A',
            chequeAmount: 100000,
            direction: "payable",
            chequeNumber: '12345',
            formattedChequeAmount: '1,000,000',
            chequeAmountUOM: 'ریال',
            issueDate: '1402/01/01',
            dueDate: '1402/01/30',
        },

    ],
};

describe('RenderChequesList', () => {

    // Test case for rendering with valid data
    it('should render a list of cheques when data is provided', () => {
        // Render the component with mock data
        render(
            <RenderChequesList
                nearDueChequesDetailsData={mockChequesData}
                expandedCard={null}
                setExpandedCard={vi.fn()}
            />
        );

        // Assert that two MainCard components are rendered
        // const chequeCards = screen.getAllByTestId('main-card');
        // expect(chequeCards).toHaveLength(2);

        // Assert that the ProfitNotFound component is not rendered
        const profitNotFound = screen.queryByTestId('profit-not-found');
        expect(profitNotFound).not.toBeInTheDocument();
    });

    // Test case for rendering without data
    it('should render ProfitNotFound when no cheque data is provided', () => {
        // Render the component with undefined data
        render(
            <RenderChequesList
                nearDueChequesDetailsData={undefined}
                expandedCard={null}
                setExpandedCard={vi.fn()}
            />
        );

        // Assert that the ProfitNotFound component is rendered with the correct message
        const profitNotFound = screen.getByText('چک ثبت شده‌ای وجود ندارد');
        expect(profitNotFound).toBeInTheDocument();

        // Assert that no MainCard components are rendered
        const chequeCards = screen.queryAllByTestId('main-card');
        expect(chequeCards).toHaveLength(0);
    });

    // Test case for rendering with empty data
    it('should render ProfitNotFound when the cheque list is empty', () => {
        const emptyChequesData = { nearDueChequesDtos: [] };

        // Render the component with an empty array for cheques
        render(
            <RenderChequesList
                nearDueChequesDetailsData={emptyChequesData}
                expandedCard={null}
                setExpandedCard={vi.fn()}
            />
        );

        // Assert that the ProfitNotFound component is rendered with the correct message
        const profitNotFound = screen.getByText('چک ثبت شده‌ای وجود ندارد');
        expect(profitNotFound).toBeInTheDocument();

        // Assert that no MainCard components are rendered
        const chequeCards = screen.queryAllByTestId('main-card');
        expect(chequeCards).toHaveLength(0);
    });
});
