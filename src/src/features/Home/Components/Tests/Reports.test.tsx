import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Reports from '../Reports'; // Adjust the import path as necessary
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- GLOBAL FIX: MOCK REACT ROUTER DOM ---
// This ensures that the useNavigate() call inside the useTopProductsData hook 
// does not crash the test environment, even if the hook is executed early.
vi.mock('react-router-dom', () => ({
    // Provide a mock function for useNavigate
    useNavigate: vi.fn(), 
    // If the hook uses other router exports, mock them too:
    // useParams: vi.fn(),
    // useLocation: vi.fn(),
}));

// --- MOCK DEPENDENCIES ---

// 1. Mock MUI Theme and Context
// Create a basic theme wrapper for testing MUI components
const mockTheme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        text: { primary: '#000', secondary: '#555' },
        background: { paper: '#fff' },
        divider: '#ccc',
        action: { hover: '#f0f0f0' },
    },
});

vi.mock('@mui/material/styles', async (importOriginal) => {
    const original = await importOriginal<typeof import('@mui/material/styles')>();
    return {
        ...original,
        useTheme: vi.fn(() => mockTheme),
    };
});

vi.mock('@/core/context/useThemeContext', () => ({
    useThemeContext: vi.fn(() => ({ isDarkMode: false })),
}));

// 2. Mock Customization Hook
const mockIsComponentEnabled = vi.fn(() => true);
vi.mock('@/features/HomeCustomization/Hooks/useHomeCustomizationSettings', () => ({
    useHomeCustomizationSettings: () => ({
        isComponentEnabled: mockIsComponentEnabled,
    }),
}));

// 3. Mock Data Fetching Hook
const mockHandleDaysChange = vi.fn();
const mockHandleClickOpen = vi.fn();

const mockData = {
    selectedChip: '7d',
    handleDaysChange: mockHandleDaysChange,
    handleSoldProductClick: vi.fn(),
    handleRevenuableProductClick: vi.fn(),
    handleClickOpen: mockHandleClickOpen,
    handleClose: vi.fn(),
    open: false,
    loading: false,
    topSoldByQuantity: { id: 1, name: 'T-Shirt', value: 50, unit: 'عدد' },
    topSoldByPrice: { id: 2, name: 'Laptop', value: 10000, unit: 'ریال' },
    topRevenuableByPercent: { id: 3, name: 'Software', value: 40, unit: '%' },
    topRevenuableByAmount: { id: 4, name: 'Consulting', value: 5000, unit: 'ریال' },
    options: [{ value: '7d', label: '7 Days' }, { value: '30d', label: '30 Days' }],
};

let mockLoadingState = false;

vi.mock('../../Hooks/topProductsHooks', () => ({
    default: vi.fn(() => ({
        ...mockData,
        loading: mockLoadingState,
    })),
}));

// 4. Mock Child Components to simplify snapshot testing and focus on Report logic
vi.mock('@/core/components/infoDialog', () => ({ default: () => <div data-testid="mock-info-dialog" /> }));
vi.mock('@/core/components/icons', () => ({ Icon: ({ name }: { name: string }) => <svg data-testid={`icon-${name}`} /> }));
vi.mock('./ProductsCard', () => ({ default: ({ subtitle }: { subtitle: string }) => <div data-testid="mock-product-card">{subtitle}</div> }));
vi.mock('@/core/components/dateFilterToggleTab', () => ({ default: (props: any) => <button data-testid="date-filter" onClick={() => props.onChange('30d')}>{props.value}</button> }));


// --- TEST SUITE ---

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    // Only wrap with ThemeProvider now that react-router-dom is globally mocked
    <ThemeProvider theme={mockTheme}>
        {children}
    </ThemeProvider>
);

describe('Reports', () => {
    // Reset mock state before each test
    beforeEach(() => {
        vi.clearAllMocks();
        mockLoadingState = false;
        mockIsComponentEnabled.mockImplementation(() => true);
    });

    it('renders the "Top Sold" view correctly when id is "topNMostsoldproducts"', () => {
        render(<Reports id="topNMostsoldproducts" />, { wrapper: Wrapper });

        // 1. Check for the main title specific to the sold view
        expect(screen.getByText('پرفروش ترین کالاها')).toBeInTheDocument();
        
        // 2. Check for the product cards for sold products (by quantity and price)
        expect(screen.getByText('بر اساس تعداد')).toBeInTheDocument();
        expect(screen.getByText('بر اساس مبلغ')).toBeInTheDocument();
    });

    it('renders the "Top Revenuable" view correctly when id is "topNMostrevenuableproducts"', () => {
        render(<Reports id="topNMostrevenuableproducts" />, { wrapper: Wrapper });

        // 1. Check for the main title specific to the revenuable view
        expect(screen.getByText('پرسودترین کالاها')).toBeInTheDocument();

        // 2. Check for the product cards for revenuable products (by percent and amount)
        expect(screen.getByText('بر اساس درصد')).toBeInTheDocument();
        // FIX 1: Changed expected count from 2 to 1, as only one card in the revenuable section uses this subtitle.
        expect(screen.getAllByText('بر اساس مبلغ')).toHaveLength(1); 
    });



    it('handles date filter change interaction', () => {
        render(<Reports id="topNMostsoldproducts" />, { wrapper: Wrapper });

        const dateFilterButton = screen.getByTestId('date-filter');
        fireEvent.click(dateFilterButton);

        // Verify that the handler from useTopProductsData was called with the new value
        expect(mockHandleDaysChange).toHaveBeenCalledWith('30d');
    });

    it('calls handleClickOpen when InfoButton is clicked', () => {
        render(<Reports id="topNMostsoldproducts" />, { wrapper: Wrapper });

        // FIX 2: Find the button by locating the known data-testid of the icon inside it, 
        // then finding the closest button element. This bypasses the missing accessible name issue.
        const iconElement = screen.getByTestId('icon-infodialoghome');
        const infoButton = iconElement.closest('button');

        expect(infoButton).not.toBeNull();
        if (infoButton) {
            fireEvent.click(infoButton);
        }

        // Verify that the handler was called with the expected command name and title
        expect(mockHandleClickOpen).toHaveBeenCalledWith({ 
            path: 'TopNMostSoldProductsCommand', 
            title: 'پرفروش ترین کالاها' 
        });
    });

    it('renders generic title when both top sold and top revenuable are enabled (for combined view)', () => {
        // This test simulates the case where the component is rendered with either ID, 
        // but both are globally enabled, resulting in the "گزارش کالاها" title.
        render(<Reports id="topNMostsoldproducts" />, { wrapper: Wrapper });
        
        // Check for the "combined" title text
        expect(screen.getByText('گزارش کالاها')).toBeInTheDocument();
    });
});
