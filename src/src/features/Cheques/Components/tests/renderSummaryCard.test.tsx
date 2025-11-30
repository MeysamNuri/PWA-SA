import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import RenderSummaryCard from '../renderSummaryCard';
import type { IChequesNearDueTotal, INearDueChequesSubTotalOutput } from '../../types';
// 1. Import the component being mocked so we can use vi.mocked() later
import MainCard from '@/core/components/MainCard/MainCard'; 

// 2. Mock the external component dependency. This factory is hoisted.
// We return a simple mock component function here.
vi.mock('@/core/components/MainCard/MainCard', () => {
    // We define the mock implementation here, but we don't assign it to a top-level variable.
    return {
        default: vi.fn(({ headerTitle, headerValue, rows }) => (
            <div data-testid="main-card">
                <span data-testid="card-title">{headerTitle}</span>
                <span data-testid="card-value">{headerValue}</span>
                {rows.map((row: any, index: number) => (
                    <span key={index} data-testid={`row-${index}`}>{row.title}: {row.value} {row.unit}</span>
                ))}
            </div>
        )),
    };
});


// 3. Define mock data structures based on the expected props
// Combined type structure for convenience
type FullMockData = INearDueChequesSubTotalOutput & IChequesNearDueTotal;

// Sample data for a specific bank (where chequesQuantity exists)
const mockBankData: FullMockData = {
    // Properties required by INearDueChequesSubTotalOutput
    bankName: "Bank A",
    chequesQuantity: 5,
    chequesAmount: 1200000,
    formattedChequesAmount: "1,200,000",
    chequesAmountUOM: "Rial",
    bankcode: "123",
    bankAccountNumber: "987654",
    bankBalance: 50000000,
    formattedBankBalance: "50,000,000",
    bankBalanceUOM: "Rial",
    needAmount: 0,

    // Properties required by IChequesNearDueTotal (set to 0 for a specific bank card)
    receivableChequesQuantity: 0,
    receivableChequesAmount: 0,
    formattedReceivableChequesAmount: "0",
    receivableChequesAmountUOM: "Rial",
    payableChequesQuantity: 0,
    payableChequesAmount: 0,
    formattedPayableChequesAmount: "0",
    payableChequesAmountUOM: "Rial",
    allChequesBalanceAmount: 0,
    formattedAllChequesBalanceAmount: "0",
    allChequesBalanceAmountUOM: "Rial",
};

// Sample data for the 'All Cheques' fallback (where chequesQuantity is zero)
const mockTotalData: FullMockData = {
    // Properties required by INearDueChequesSubTotalOutput (using total/default values)
    bankName: "Total",
    chequesQuantity: 0, // Triggers the fallback logic
    chequesAmount: 0,
    formattedChequesAmount: "0",
    chequesAmountUOM: "Rial",
    bankcode: "000",
    bankAccountNumber: "000000",
    bankBalance: 0,
    formattedBankBalance: "0",
    bankBalanceUOM: "Rial",
    needAmount: 0,

    // Properties required by IChequesNearDueTotal (using total values)
    receivableChequesQuantity: 15,
    receivableChequesAmount: 5000000,
    formattedReceivableChequesAmount: "5,000,000",
    receivableChequesAmountUOM: "Rial",
    payableChequesQuantity: 8,
    payableChequesAmount: 3000000,
    formattedPayableChequesAmount: "3,000,000",
    payableChequesAmountUOM: "Rial",
    allChequesBalanceAmount: 8000000,
    formattedAllChequesBalanceAmount: "8,000,000",
    allChequesBalanceAmountUOM: "Rial",
};


describe('RenderSummaryCard', () => {

    // 4. Get the spy reference using vi.mocked() after the module load stage
    // vi.mocked() casts the imported component to its mocked spy implementation.
    const MockMainCard = vi.mocked(MainCard, true);

    // IMPORTANT: Clear the mock reference using the retrieved spy.
    beforeEach(() => {
        MockMainCard.mockClear();
    });

    // --- Scenario 1: No Data ---
    it('should return null when totalData is undefined', () => {
        const { container } = render(
            <RenderSummaryCard totalData={undefined} isReceivable={true} />
        );
        expect(container.firstChild).toBeNull();
        // Use the retrieved spy reference for assertions
        expect(MockMainCard).not.toHaveBeenCalled();
    });

    // --- Scenario 2: Specific Bank Summary (chequesQuantity exists) ---
    describe('When chequesQuantity is greater than 0', () => {
        it('should render MainCard with specific bank details', () => {
            render(<RenderSummaryCard totalData={mockBankData} isReceivable={true} />);

            // Use the retrieved spy reference for assertions
            expect(MockMainCard).toHaveBeenCalledTimes(1);
            const callArgs = MockMainCard.mock.calls[0][0];

            expect(callArgs.headerTitle).toBe('Bank A');
            expect(callArgs.headerValue).toBe(5);
            expect(callArgs.headerUnit).toBe('عدد');
            expect(callArgs.rows[0].title).toBe('جمع مبلغ');
            expect(callArgs.rows[0].value).toBe('1,200,000');
        });
    });

    // --- Scenario 3: All Cheques Summary (Fallback) ---
    describe('When chequesQuantity is zero (Total Summary - Receivable)', () => {
        it('should render MainCard with Receivable totals and correct header', () => {
            render(<RenderSummaryCard totalData={mockTotalData} isReceivable={true} />);

            // Use the retrieved spy reference for assertions
            expect(MockMainCard).toHaveBeenCalledTimes(1);
            const callArgs = MockMainCard.mock.calls[0][0];

            // Check header for Receivable
            expect(callArgs.headerTitle).toBe('همه چک های دریافتی');
            expect(callArgs.headerValue).toBe(15); // receivableChequesQuantity
            
            // Check row details for Receivable
            expect(callArgs.rows[0].value).toBe('5,000,000'); // formattedReceivableChequesAmount
            expect(callArgs.rows[0].unit).toBe('Rial'); // receivableChequesAmountUOM
        });

        it('should render MainCard with Payable totals and correct header', () => {
            render(<RenderSummaryCard totalData={mockTotalData} isReceivable={false} />);

            // Use the retrieved spy reference for assertions
            expect(MockMainCard).toHaveBeenCalledTimes(1);
            const callArgs = MockMainCard.mock.calls[0][0];

            // Check header for Payable
            expect(callArgs.headerTitle).toBe('همه چک های پرداختی');
            expect(callArgs.headerValue).toBe(8); // payableChequesQuantity
            
            // Check row details for Payable
            expect(callArgs.rows[0].value).toBe('3,000,000'); // formattedPayableChequesAmount
            expect(callArgs.rows[0].unit).toBe('Rial'); // payableChequesAmountUOM
        });
    });
});