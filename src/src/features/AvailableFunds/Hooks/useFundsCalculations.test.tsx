import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFundsCalculations } from '../Hooks/useFundsCalculations';
import type { IAvailableFundsResponse, IBankBalanceResponse, IGetFundBalanceDetailsResponse } from '../types';

// Mock the translation utility with a more realistic implementation
// that converts Latin digits to Persian digits.
vi.mock('@/core/helper/translationUtility', () => ({
    toPersianNumber: vi.fn((value: any) => {
        if (value === undefined || value === null) return '';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const formattedValue = String(value).replace(/\d/g, (d) => persianDigits[Number(d)]);
        return `persian-${formattedValue}`;
    }),
}));

describe('useFundsCalculations', () => {
    // Define mock data for the 'toman' currency scenario
    const mockTomanAvailableFunds: IAvailableFundsResponse = {
        formattedTotalBalance: '1,000,000',
        totalBalance: 1000000,
        totalBalanceInDollar: 20, // Not used in toman mode, but included for type completeness
        totalBalanceUOM: 'IRR',
        availableFundsReportResponseDtos: [
            {
                formattedBankBalance: '600,000',
                bankBalance: 600000,
                bankBalanceInDollar: 12,
                formattedFundBalance: '400,000',
                fundBalance: 400000,
                fundBalanceInDollar: 8,
                bankBalanceUOM: 'IRR',
                fundBalanceUOM: 'IRR',
                balancePercentage: 60,
            },
        ],
    };

    const mockTomanBankBalance: IBankBalanceResponse = {
        totalBalance: 600000,
        totalBalanceUOM: 'IRR',
        formattedTotalBalance: '600,000',
        totalBalanceInDollar: 12,
        bankAccountsBalanceOutputs: [
            {
                serial: '101',
                accountingCode: 'B-1',
                accountingName: 'Bank A',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'IRR',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'IRR',
                balance: 400000,
                balanceInDollar: 8,
                formattedBalance: '400,000',
                balanceUOM: 'IRR',
                balancePercentage: 66.67,
                bankCode: '10',
                bankName: 'Bank A',
                branchCode: 'A01',
                branchName: 'Main Branch A',
            },
            {
                serial: '102',
                accountingCode: 'B-2',
                accountingName: 'Bank B',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'IRR',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'IRR',
                balance: 200000,
                balanceInDollar: 4,
                formattedBalance: '200,000',
                balanceUOM: 'IRR',
                balancePercentage: 33.33,
                bankCode: '20',
                bankName: 'Bank B',
                branchCode: 'B01',
                branchName: 'Main Branch B',
            },
        ],
    };

    const mockTomanFundBalance: IGetFundBalanceDetailsResponse = {
        totalBalance: 400000,
        totalBalanceUOM: 'IRR',
        formattedTotalBalance: '400,000',
        totalBalanceInDollar: 8,
        fundAccountsBalanceOutputs: [
            { 
                serial: '123',
                accountingCode: 'A-1',
                accountingName: 'Fund A',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'IRR',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'IRR',
                balance: 300000,
                balanceInDollar: 6,
                balanceUOM: 'IRR',
                formattedBalance: '300,000', 
                balancePercentage: 75.0,
            },
            {
                serial: '456',
                accountingCode: 'A-2',
                accountingName: 'Fund B',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'IRR',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'IRR',
                balance: 100000,
                balanceInDollar: 2,
                balanceUOM: 'IRR',
                formattedBalance: '100,000', 
                balancePercentage: 25.0,
            },
        ],
    };

    // Define mock data for the 'dollar' currency scenario
    const mockDollarAvailableFunds: IAvailableFundsResponse = {
        formattedTotalBalance: '1,000,000',
        totalBalance: 1000000,
        totalBalanceInDollar: 200,
        totalBalanceUOM: 'USD',
        availableFundsReportResponseDtos: [
            {
                formattedBankBalance: '600,000',
                bankBalance: 600000,
                bankBalanceInDollar: 120,
                formattedFundBalance: '400,000',
                fundBalance: 400000,
                fundBalanceInDollar: 80,
                bankBalanceUOM: 'USD',
                fundBalanceUOM: 'USD',
                balancePercentage: 60,
            },
        ],
    };

    const mockDollarBankBalance: IBankBalanceResponse = {
        totalBalance: 600000,
        totalBalanceUOM: 'IRR',
        formattedTotalBalance: '600,000',
        totalBalanceInDollar: 120,
        bankAccountsBalanceOutputs: [
            { 
                serial: '103',
                accountingCode: 'C-1',
                accountingName: 'Bank C',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'USD',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'USD',
                balance: 600000,
                balanceInDollar: 120,
                formattedBalance: '600,000',
                balanceUOM: 'USD',
                balancePercentage: 60,
                bankCode: '30',
                bankName: 'Bank C',
                branchCode: 'C01',
                branchName: 'Main Branch C',
            },
            {
                serial: '104',
                accountingCode: 'C-2',
                accountingName: 'Bank D',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'USD',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'USD',
                balance: 400000,
                balanceInDollar: 80,
                formattedBalance: '400,000',
                balanceUOM: 'USD',
                balancePercentage: 40,
                bankCode: '40',
                bankName: 'Bank D',
                branchCode: 'D01',
                branchName: 'Main Branch D',
            },
        ],
    };

    const mockDollarFundBalance: IGetFundBalanceDetailsResponse = {
        totalBalance: 400000,
        totalBalanceUOM: 'IRR',
        formattedTotalBalance: '400,000',
        totalBalanceInDollar: 80,
        fundAccountsBalanceOutputs: [
            { 
                serial: '789',
                accountingCode: 'B-1',
                accountingName: 'Fund C',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'USD',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'USD',
                balance: 120000,
                balanceInDollar: 2.4,
                balanceUOM: 'USD',
                formattedBalance: '120,000', 
                balancePercentage: 30,
            },
            {
                serial: '101',
                accountingCode: 'B-2',
                accountingName: 'Fund D',
                creditAmount: 0,
                creditAmountInDollar: 0,
                formattedCreditAmount: '0',
                creditAmountUOM: 'USD',
                debitAmount: 0,
                debitAmountInDollar: 0,
                formattedDebitAmount: '0',
                debitAmountUOM: 'USD',
                balance: 280000,
                balanceInDollar: 5.6,
                balanceUOM: 'USD',
                formattedBalance: '280,000', 
                balancePercentage: 70,
            },
        ],
    };

    // Test Case 1: Validate calculations and formatting for the 'toman' tab
    it('should calculate and format values correctly for toman tab', () => {
        const { result } = renderHook(() =>
            useFundsCalculations(
                mockTomanAvailableFunds,
                mockTomanBankBalance,
                mockTomanFundBalance,
                'toman'
            )
        );

        // Assert that the translation utility was used correctly
        expect(result.current.totalAssetValue).toBe('persian-۱,۰۰۰,۰۰۰');
        expect(result.current.formatedBankDisplay).toBe('persian-۶۰۰,۰۰۰');
        expect(result.current.formatedFundDisplay).toBe('persian-۴۰۰,۰۰۰');

        // Assert bank and fund percentages
        expect(result.current.bankPercentage).toBe(60);
        expect(result.current.fundPercentage).toBe(40);

        // Assert transformed account data
        expect(result.current.bankAccountsData[0].formattedBalance).toBe('persian-۴۰۰,۰۰۰');
        expect(result.current.fundAccountsData[0].formattedBalance).toBe('persian-۳۰۰,۰۰۰');

        // Assert raw bank and fund balances
        expect(result.current.bankBalance).toBe(600000);
        expect(result.current.fundBalance).toBe(400000);
    });

    // Test Case 2: Validate calculations and formatting for the 'dollar' tab
    it('should calculate and format values correctly for dollar tab', () => {
        const { result } = renderHook(() =>
            useFundsCalculations(
                mockDollarAvailableFunds,
                mockDollarBankBalance,
                mockDollarFundBalance,
                'dollar'
            )
        );

        // Assert that the translation utility was used correctly
        expect(result.current.totalAssetValue).toBe('persian-۲۰۰');
        expect(result.current.formatedBankDisplay).toBe('persian-۱۲۰');
        expect(result.current.formatedFundDisplay).toBe('persian-۸۰');

        // Assert bank and fund percentages
        expect(result.current.bankPercentage).toBe(60);
        expect(result.current.fundPercentage).toBe(40);

        // Assert transformed account data
        expect(result.current.bankAccountsData[0].formattedBalance).toBe('persian-۱۲۰');
        // expect(result.current.fundAccountsData[0].formattedBalance).toBe('persian-۲.۴');

        // Assert raw bank and fund balances in dollar
        expect(result.current.bankBalance).toBe(120);
        expect(result.current.fundBalance).toBe(80);
    });

    // Test Case 3: Handle undefined/missing data
    it('should return default values when input data is undefined', () => {
        const { result } = renderHook(() =>
            useFundsCalculations(
                undefined,
                undefined,
                undefined,
                'toman'
            )
        );

        // Assert default values are returned for all calculated properties
   
        expect(result.current.bankAccountsData).toEqual([]);
        expect(result.current.fundAccountsData).toEqual([]);
        expect(result.current.bankPercentage).toBe(0);
        expect(result.current.fundPercentage).toBe(0);
        expect(result.current.bankBalance).toBe(undefined);
        expect(result.current.fundBalance).toBe(undefined);
    });
});
