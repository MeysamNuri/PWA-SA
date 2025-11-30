import { describe, it, expect } from 'vitest';
import { NumberConverter } from './numberConverter';

describe('NumberConverter', () => {
    describe('latinToArabic', () => {
        it('converts Latin numerals to Arabic numerals correctly', () => {
            expect(NumberConverter.latinToArabic('1234567890')).toBe('١٢٣٤٥٦٧٨٩٠');
        });

        it('handles mixed text with numbers', () => {
            expect(NumberConverter.latinToArabic('Price: 1500 تومان')).toBe('Price: ١٥٠٠ تومان');
        });

        it('handles empty string', () => {
            expect(NumberConverter.latinToArabic('')).toBe('');
        });

        it('handles string without numbers', () => {
            expect(NumberConverter.latinToArabic('Hello World')).toBe('Hello World');
        });

        it('handles single digits', () => {
            expect(NumberConverter.latinToArabic('0')).toBe('٠');
            expect(NumberConverter.latinToArabic('5')).toBe('٥');
            expect(NumberConverter.latinToArabic('9')).toBe('٩');
        });

        it('handles large numbers', () => {
            expect(NumberConverter.latinToArabic('999999999')).toBe('٩٩٩٩٩٩٩٩٩');
        });

        it('handles numbers with commas', () => {
            expect(NumberConverter.latinToArabic('1,000,000')).toBe('١,٠٠٠,٠٠٠');
        });

        it('handles decimal numbers', () => {
            expect(NumberConverter.latinToArabic('123.45')).toBe('١٢٣.٤٥');
        });

        it('handles negative numbers', () => {
            expect(NumberConverter.latinToArabic('-123')).toBe('-١٢٣');
        });

        it('handles Persian text with numbers', () => {
            // NumberConverter.latinToArabic only converts Latin numerals to Arabic numerals
            // It doesn't change Persian numerals, so the input and output should be the same
            expect(NumberConverter.latinToArabic('قیمت: ۵۰۰۰۰ تومان')).toBe('قیمت: ۵۰۰۰۰ تومان');
        });
    });

    describe('formatTime', () => {
        it('formats time correctly with single digits', () => {
            expect(NumberConverter.formatTime(9, 5)).toBe('٠٩:٠٥');
        });

        it('formats time correctly with double digits', () => {
            expect(NumberConverter.formatTime(23, 59)).toBe('٢٣:٥٩');
        });

        it('formats time with zero values', () => {
            expect(NumberConverter.formatTime(0, 0)).toBe('٠٠:٠٠');
        });

        it('handles edge cases', () => {
            expect(NumberConverter.formatTime(12, 30)).toBe('١٢:٣٠');
            expect(NumberConverter.formatTime(1, 1)).toBe('٠١:٠١');
        });
    });

    describe('formatNumberWithCommas', () => {
        it('formats numbers with commas correctly', () => {
            expect(NumberConverter.formatNumberWithCommas(1000)).toBe('1,000');
            expect(NumberConverter.formatNumberWithCommas(1000000)).toBe('1,000,000');
        });

        it('handles single digits', () => {
            expect(NumberConverter.formatNumberWithCommas(5)).toBe('5');
            expect(NumberConverter.formatNumberWithCommas(0)).toBe('0');
        });

        it('handles numbers less than 1000', () => {
            expect(NumberConverter.formatNumberWithCommas(999)).toBe('999');
            expect(NumberConverter.formatNumberWithCommas(100)).toBe('100');
        });

        it('handles large numbers', () => {
            expect(NumberConverter.formatNumberWithCommas(1234567890)).toBe('1,234,567,890');
        });

        it('handles zero', () => {
            expect(NumberConverter.formatNumberWithCommas(0)).toBe('0');
        });

        it('handles negative numbers', () => {
            expect(NumberConverter.formatNumberWithCommas(-1000)).toBe('-1,000');
        });
    });

    describe('formatCurrency', () => {
        it('formats currency with Arabic numerals', () => {
            expect(NumberConverter.formatCurrency(1000)).toBe('١,٠٠٠');
            expect(NumberConverter.formatCurrency(1000000)).toBe('١,٠٠٠,٠٠٠');
        });

        it('handles single digits', () => {
            expect(NumberConverter.formatCurrency(5)).toBe('٥');
            expect(NumberConverter.formatCurrency(0)).toBe('٠');
        });

        it('handles numbers less than 1000', () => {
            expect(NumberConverter.formatCurrency(999)).toBe('٩٩٩');
            expect(NumberConverter.formatCurrency(100)).toBe('١٠٠');
        });

        it('handles large numbers', () => {
            expect(NumberConverter.formatCurrency(1234567890)).toBe('١,٢٣٤,٥٦٧,٨٩٠');
        });

        it('handles zero', () => {
            expect(NumberConverter.formatCurrency(0)).toBe('٠');
        });

        it('handles negative numbers', () => {
            expect(NumberConverter.formatCurrency(-1000)).toBe('-١,٠٠٠');
        });
    });

    describe('error handling', () => {
        it('handles non-string input in latinToArabic', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(NumberConverter.latinToArabic(123 as any)).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith('Input is not a valid string');
            
            consoleSpy.mockRestore();
        });

        it('handles null input in latinToArabic', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(NumberConverter.latinToArabic(null as any)).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith('Input is not a valid string');
            
            consoleSpy.mockRestore();
        });

        it('handles undefined input in latinToArabic', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(NumberConverter.latinToArabic(undefined as any)).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith('Input is not a valid string');
            
            consoleSpy.mockRestore();
        });
    });
});
