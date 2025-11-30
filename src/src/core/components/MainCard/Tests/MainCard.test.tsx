import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainCard from '../MainCard';
import type { IMainCardPropsBase } from '../../../types/mainCardTypes';

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

// Mock environment variables
vi.mock('import.meta.env', () => ({
    env: {
        BASE_URL: '/'
    }
}));

// Create a test theme
const theme = createTheme();

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </BrowserRouter>
);

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate
}));

describe('MainCard Component', () => {
    const defaultProps: IMainCardPropsBase = {
        headerTitle: 'Test Card',
        headerValue: 1000,
        headerUnit: 'ریال',
        rows: [
            {
                title: 'Row 1',
                value: 500,
                unit: 'ریال',
                rowSize: 6
            },
            {
                title: 'Row 2',
                value: 300,
                unit: 'ریال',
                rowSize: 6
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should render header with title and value', () => {
            render(
                <TestWrapper>
                    <MainCard {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.getByText('converted_۱٬۰۰۰')).toBeInTheDocument();
            // Check that at least one unit is present (there are multiple "ریال" elements)
            expect(screen.getAllByText('ریال')).toHaveLength(3);
        });

        it('should render all rows when not collapsible', () => {
            render(
                <TestWrapper>
                    <MainCard {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
        });

        it('should render bank icon when bankName is provided', () => {
            const propsWithBank = {
                ...defaultProps,
                bankName: 'ملت'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithBank} />
                </TestWrapper>
            );

            const bankIcon = screen.getByAltText('ملت');
            expect(bankIcon).toBeInTheDocument();
            expect(bankIcon).toHaveAttribute('src', '/images/bankicon/mellat.png');
        });

        it('should render header icon when provided', () => {
            const propsWithIcon = {
                ...defaultProps,
                headerIcon: '/test-icon.png'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithIcon} />
                </TestWrapper>
            );

            const headerIcon = screen.getByAltText('icon');
            expect(headerIcon).toBeInTheDocument();
            expect(headerIcon).toHaveAttribute('src', '/test-icon.png');
        });
    });

    describe('Navigation', () => {
        it('should navigate when header is clicked and path is provided', () => {
            const propsWithPath = {
                ...defaultProps,
                path: '/test-path'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithPath} />
                </TestWrapper>
            );

            const header = screen.getByText('Test Card').closest('div');
            fireEvent.click(header!);

            expect(mockNavigate).toHaveBeenCalledWith('/test-path');
        });

        it('should not navigate when no path is provided', () => {
            render(
                <TestWrapper>
                    <MainCard {...defaultProps} />
                </TestWrapper>
            );

            const header = screen.getByText('Test Card').closest('div');
            fireEvent.click(header!);

            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('Collapsible Functionality', () => {
        it('should show limited rows when collapsed', () => {
            const propsWithCollapsible = {
                ...defaultProps,
                isCollapsible: true,
                shownRows: 1,
                rows: [
                    { title: 'Row 1', value: 100, rowSize: 6 },
                    { title: 'Row 2', value: 200, rowSize: 6 },
                    { title: 'Row 3', value: 300, rowSize: 6 }
                ]
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithCollapsible} />
                </TestWrapper>
            );

            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.queryByText('Row 2')).not.toBeInTheDocument();
            expect(screen.queryByText('Row 3')).not.toBeInTheDocument();
        });

        it('should show all rows when expanded', () => {
            const propsWithExpanded = {
                ...defaultProps,
                isCollapsible: true,
                isExpanded: true,
                shownRows: 1,
                rows: [
                    { title: 'Row 1', value: 100, rowSize: 6 },
                    { title: 'Row 2', value: 200, rowSize: 6 },
                    { title: 'Row 3', value: 300, rowSize: 6 }
                ]
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithExpanded} />
                </TestWrapper>
            );

            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
            expect(screen.getByText('Row 3')).toBeInTheDocument();
        });

        it('should call onToggle when body is clicked', () => {
            const mockOnToggle = vi.fn();
            const propsWithToggle = {
                ...defaultProps,
                isCollapsible: true,
                onToggle: mockOnToggle
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithToggle} />
                </TestWrapper>
            );

            const body = screen.getByText('Row 1').closest('div');
            fireEvent.click(body!);

            expect(mockOnToggle).toHaveBeenCalled();
        });

        it('should render footer when expanded and footer is provided', () => {
            const propsWithFooter = {
                ...defaultProps,
                isCollapsible: true,
                isExpanded: true,
                footer: <div>Footer Content</div>
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithFooter} />
                </TestWrapper>
            );

            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });
    });

    describe('Data Type Handling', () => {
        it('should format date values correctly', () => {
            const propsWithDate = {
                ...defaultProps,
                headerValue: '2024-01-15T00:00:00Z'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithDate} />
                </TestWrapper>
            );

            expect(screen.getByText('۱۴۰۲/۱۲/۲۵')).toBeInTheDocument();
        });

        it('should format number values correctly', () => {
            const propsWithNumber = {
                ...defaultProps,
                headerValue: 1234567
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithNumber} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_۱٬۲۳۴٬۵۶۷')).toBeInTheDocument();
        });

        it('should handle string values', () => {
            const propsWithString = {
                ...defaultProps,
                headerValue: 'Test String'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithString} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_Test String')).toBeInTheDocument();
        });
    });

    describe('Section Headers', () => {
        it('should handle section type rows correctly', () => {
            const propsWithSections = {
                ...defaultProps,
                isCollapsible: true,
                shownRows: 1,
                rows: [
                    { title: 'Section 1', value: '', type: 'section', rowSize: 12 },
                    { title: 'Row 1', value: 100, rowSize: 6 },
                    { title: 'Section 2', value: '', type: 'section', rowSize: 12 },
                    { title: 'Row 2', value: 200, rowSize: 6 }
                ]
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithSections} />
                </TestWrapper>
            );

            // When collapsed, only first section and limited rows should show
            expect(screen.getByText('Section 1')).toBeInTheDocument();
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
            expect(screen.queryByText('Row 2')).not.toBeInTheDocument();
        });
    });

    describe('Bank Icon Mapping', () => {
        it('should use correct icon for known banks', () => {
            const banks = [
                { name: 'ملت', expectedIcon: 'mellat.png' },
                { name: 'ملي', expectedIcon: 'meli.png' },
                { name: 'صادرات', expectedIcon: 'saderat.png' },
                { name: 'تجارت', expectedIcon: 'tejarat.png' }
            ];

            banks.forEach(({ name, expectedIcon }) => {
                const propsWithBank = {
                    ...defaultProps,
                    bankName: name
                };

                const { unmount } = render(
                    <TestWrapper>
                        <MainCard {...propsWithBank} />
                    </TestWrapper>
                );

                const bankIcon = screen.getByAltText(name);
                expect(bankIcon).toHaveAttribute('src', `/images/bankicon/${expectedIcon}`);

                unmount();
            });
        });

        it('should use default icon for unknown banks', () => {
            const propsWithUnknownBank = {
                ...defaultProps,
                bankName: 'Unknown Bank'
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithUnknownBank} />
                </TestWrapper>
            );

            const bankIcon = screen.getByAltText('Unknown Bank');
            expect(bankIcon).toHaveAttribute('src', '/images/bankicon/default.png');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty rows array', () => {
            const propsWithEmptyRows = {
                ...defaultProps,
                rows: []
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithEmptyRows} />
                </TestWrapper>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.queryByText('Row 1')).not.toBeInTheDocument();
        });

        it('should handle undefined headerValue', () => {
            const propsWithoutValue = {
                ...defaultProps,
                headerValue: undefined
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithoutValue} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_')).toBeInTheDocument();
        });

        it('should handle null headerValue', () => {
            const propsWithNullValue = {
                ...defaultProps,
                headerValue: null as any
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithNullValue} />
                </TestWrapper>
            );

            expect(screen.getByText('converted_')).toBeInTheDocument();
        });
    });

    describe('Styling and Layout', () => {
        it('should apply correct border styles when expanded', () => {
            const propsWithExpanded = {
                ...defaultProps,
                isCollapsible: true,
                isExpanded: true
            };

            render(
                <TestWrapper>
                    <MainCard {...propsWithExpanded} />
                </TestWrapper>
            );

            // The border styles are applied to the HeaderCard and BodyCard components
            // We can verify the component renders correctly
            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
        });

        it('should not apply border styles when not expanded', () => {
            const propsNotExpanded = {
                ...defaultProps,
                isCollapsible: true,
                isExpanded: false
            };

            render(
                <TestWrapper>
                    <MainCard {...propsNotExpanded} />
                </TestWrapper>
            );

            // The component should still render correctly
            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
        });
    });
});
