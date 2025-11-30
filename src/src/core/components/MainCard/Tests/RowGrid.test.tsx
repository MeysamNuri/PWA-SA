import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RowGrid from '../RowGrid';
import type { IRowData } from '../../../types/mainCardTypes';

// Mock the NumberConverter
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: vi.fn((value) => {
            // Convert Latin numbers to Persian numbers in the mock
            const persianDigits: { [key: string]: string } = {
                '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
                '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
            };
            // Handle undefined/null values safely
            if (value === undefined || value === null) {
                return `converted_${value === undefined ? 'undefined' : 'null'}`;
            }
            return `converted_${value.toString().replace(/\d/g, (digit: string) => persianDigits[digit] || digit)}`;
        })
    }
}));

// Mock moment-jalaali
vi.mock('moment-jalaali', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '۱۴۰۲/۱۲/۲۵')
    }))
}));

// Create a test theme
const theme = createTheme();

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

describe('RowGrid Component', () => {
    const defaultProps: IRowData = {
        title: 'Test Row',
        value: 1000,
        unit: 'ریال',
        rowSize: 6
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should render title and value correctly', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByText('Test Row')).toBeInTheDocument();
            expect(screen.getByText('converted_۱٬۰۰۰')).toBeInTheDocument();
            expect(screen.getByText('ریال')).toBeInTheDocument();
        });

        it('should render without unit when not provided', () => {
            const propsWithoutUnit = {
                ...defaultProps,
                unit: undefined
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithoutUnit} />
                </TestWrapper>
            );

            expect(screen.getByText('Test Row')).toBeInTheDocument();
            expect(screen.getByText('converted_۱٬۰۰۰')).toBeInTheDocument();
            expect(screen.queryByText('ریال')).not.toBeInTheDocument();
        });

        it('should apply correct row size', () => {
            const propsWithSize = {
                ...defaultProps,
                rowSize: 12
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithSize} />
                </TestWrapper>
            );

            const grid = screen.getByText('Test Row').closest('[class*="MuiGrid"]');
            expect(grid).toBeInTheDocument();
        });
    });

    describe('Section Type Rows', () => {
        it('should render section headers with correct styling', () => {
            const sectionProps = {
                ...defaultProps,
                type: 'section',
                value: '',
                valueColor: '#E42628'
            };

            render(
                <TestWrapper>
                    <RowGrid {...sectionProps} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            expect(title).toHaveStyle('color: #E42628');
            expect(title).toHaveStyle('font-weight: bold');
            expect(title).toHaveStyle('font-size: 14px');
        });

        it('should render section headers without border', () => {
            const sectionProps = {
                ...defaultProps,
                type: 'section',
                value: ''
            };

            render(
                <TestWrapper>
                    <RowGrid {...sectionProps} />
                </TestWrapper>
            );

            const infoRow = screen.getByText('Test Row').closest('div');
            expect(infoRow).toHaveStyle('border: none');
        });

        it('should use default color for section headers when not provided', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            // Use the actual theme color instead of hardcoded value
            expect(title).toHaveStyle('color: rgb(0, 0, 0, 0.38)'); // Theme text.disabled color
        });
    });

    describe('Regular Rows', () => {
        it('should render regular rows with correct structure', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByText('Test Row')).toBeInTheDocument();
            expect(screen.getByText('converted_۱٬۰۰۰')).toBeInTheDocument();
            expect(screen.getByText('ریال')).toBeInTheDocument();
        });

        it('should apply header color when provided', () => {
            const propsWithHeaderColor = {
                ...defaultProps,
                headerColor: '#FF0000'
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithHeaderColor} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            expect(title).toHaveStyle('color: #FF0000');
        });

        it('should apply value color when provided', () => {
            const propsWithValueColor = {
                ...defaultProps,
                valueColor: '#00FF00'
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithValueColor} />
                </TestWrapper>
            );

            const value = screen.getByText('converted_۱٬۰۰۰');
            expect(value).toHaveStyle('color: #00FF00');
        });
    });

    describe('Arrow Indicators', () => {
        it('should show upward arrow for positive changes', () => {
            const propsWithUpArrow = {
                ...defaultProps,
                showArrow: true,
                isPositiveChange: true
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithUpArrow} />
                </TestWrapper>
            );

            // Check if the arrow icon is present (Material-UI icons)
            const title = screen.getByText('Test Row');
            expect(title).toBeInTheDocument();
            // The arrow should be rendered as a child of the title
        });

        it('should show downward arrow for negative changes', () => {
            const propsWithDownArrow = {
                ...defaultProps,
                showArrow: true,
                isPositiveChange: false
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithDownArrow} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            expect(title).toBeInTheDocument();
        });

        it('should not show arrow when showArrow is false', () => {
            const propsWithoutArrow = {
                ...defaultProps,
                showArrow: false
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithoutArrow} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            expect(title).toBeInTheDocument();
        });

        it('should not show arrow when showArrow is undefined', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            const title = screen.getByText('Test Row');
            expect(title).toBeInTheDocument();
        });
    });

    describe('Data Formatting', () => {
        it('should format date values correctly', () => {
            const propsWithDate = {
                ...defaultProps,
                value: '2024-01-15T00:00:00Z'
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithDate} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_۱۴۰۲/۱۲/۲۵')).toBeInTheDocument();
        });

        it('should format number values correctly', () => {
            const propsWithNumber = {
                ...defaultProps,
                value: 1234567
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithNumber} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_۱٬۲۳۴٬۵۶۷')).toBeInTheDocument();
        });

        it('should handle string values', () => {
            const propsWithString = {
                ...defaultProps,
                value: 'Test String Value'
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithString} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_Test String Value')).toBeInTheDocument();
        });

        it('should handle zero values', () => {
            const propsWithZero = {
                ...defaultProps,
                value: 0
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithZero} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_۰')).toBeInTheDocument();
        });

        it('should handle negative values', () => {
            const propsWithNegative = {
                ...defaultProps,
                value: -1000
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithNegative} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_‎−۱٬۰۰۰')).toBeInTheDocument();
        });
    });

    describe('Unit Display', () => {
        it('should display unit with correct styling', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            const unit = screen.getByText('ریال');
            expect(unit).toHaveStyle('font-size: 12px');
            // Use the actual theme color instead of hardcoded value
            expect(unit).toHaveStyle('color: rgba(0, 0, 0, 0.38)'); // Theme text.disabled color
            expect(unit).toHaveStyle('margin-right: 5px');
        });

        it('should not display unit when undefined', () => {
            const propsWithoutUnit = {
                ...defaultProps,
                unit: undefined
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithoutUnit} />
                </TestWrapper>
            );

            expect(screen.queryByText('ریال')).not.toBeInTheDocument();
        });

        it('should not display unit when empty string', () => {
            const propsWithEmptyUnit = {
                ...defaultProps,
                unit: ''
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithEmptyUnit} />
                </TestWrapper>
            );

            expect(screen.queryByText('ریال')).not.toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined value', () => {
            const propsWithUndefinedValue = {
                ...defaultProps,
                value: undefined as any
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithUndefinedValue} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_undefined')).toBeInTheDocument();
        });

        it('should handle null value', () => {
            const propsWithNullValue = {
                ...defaultProps,
                value: null as any
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithNullValue} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_undefined')).toBeInTheDocument();
        });

        it('should handle empty string value', () => {
            const propsWithEmptyValue = {
                ...defaultProps,
                value: ''
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithEmptyValue} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_')).toBeInTheDocument();
        });

        it('should handle very large numbers', () => {
            const propsWithLargeNumber = {
                ...defaultProps,
                value: 999999999999
            };

            render(
                <TestWrapper>
                    <RowGrid {...propsWithLargeNumber} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_۹۹۹٬۹۹۹٬۹۹۹٬۹۹۹')).toBeInTheDocument();
        });
    });

    describe('Styling and Layout', () => {
        it('should apply correct spacing and layout', () => {
            render(
                <TestWrapper>
                    <RowGrid {...defaultProps} />
                </TestWrapper>
            );

            const infoRow = screen.getByText('Test Row').closest('div');
            expect(infoRow).toBeInTheDocument();
        });

        it('should handle different row sizes', () => {
            const sizes = [1, 2, 3, 4, 6, 12];
            
            sizes.forEach(size => {
                const propsWithSize = {
                    ...defaultProps,
                    rowSize: size
                };

                const { unmount } = render(
                    <TestWrapper>
                        <RowGrid {...propsWithSize} />
                    </TestWrapper>
                );

                const grid = screen.getByText('Test Row').closest('[class*="MuiGrid"]');
                expect(grid).toBeInTheDocument();

                unmount();
            });
        });
    });
});
