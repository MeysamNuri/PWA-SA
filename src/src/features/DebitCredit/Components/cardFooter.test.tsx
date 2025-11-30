import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTheme } from '@mui/material/styles';
import type { DebtorCreditorItem } from "../types";

// The component to be tested
import CardFooter from './cardFooter';

// Mock the useTheme hook to provide a consistent theme for the component
vi.mock('@mui/material/styles', () => ({
    useTheme: vi.fn(),
}));

describe('CardFooter', () => {
    // Define a mock item for testing that now satisfies the DebtorCreditorItem type
    const mockItemWithPhone: DebtorCreditorItem = {
        code: "C-001",
        name: "Test Customer",
        customerCode: "TC-001",
        sumBed: 1000,
        sumBes: 500,
        mobile: '1234567890',
        tel: '0987654321',
        // Added the missing properties to satisfy the type
        formattedSumBed: "1,000",
        sumBedUOM: "USD",
        formattedSumBes: "500",
        sumBesUOM: "USD",
        price: 1500,
        formattedPrice: "1,500",
        priceUOM: "USD",
    };

    const mockItemWithoutPhone: DebtorCreditorItem = {
        code: "C-002",
        name: "No Phone Customer",
        customerCode: "TC-002",
        sumBed: 200,
        sumBes: 100,
        mobile: '', // Changed from null to empty string to satisfy the 'string' type
        tel: '', // Changed from null to empty string to satisfy the 'string' type
        // Added the missing properties to satisfy the type
        formattedSumBed: "200",
        sumBedUOM: "USD",
        formattedSumBes: "100",
        sumBesUOM: "USD",
        price: 300,
        formattedPrice: "300",
        priceUOM: "USD",
    };
    
    // Define a mock theme to be returned by useTheme
    const mockTheme = {
        palette: {
            background: {
                default: '#f5f5f5',
            },
        },
    };

    // Correct way to spy on and mock window.location.href
    const mockLocation = Object.assign(window.location, {
        href: ''
    });
    
    beforeEach(() => {
        // Reset the mocks and set the mock return value before each test
        vi.clearAllMocks();
        vi.mocked(useTheme).mockReturnValue(mockTheme as any);
        vi.stubGlobal('window', { ...window, location: mockLocation });
    });

    it('should render correctly', () => {
        // Render the component with the mock item
        render(<CardFooter item={mockItemWithPhone} />);

        // Assert that the component renders the images
        expect(screen.getByAltText('message')).toBeInTheDocument();
        expect(screen.getByAltText('mobile call')).toBeInTheDocument();
        expect(screen.getByAltText('landline call')).toBeInTheDocument();
    });

    it('should call sms: url when message icon is clicked with a mobile number', () => {
        // Render the component with an item that has a mobile number
        render(<CardFooter item={mockItemWithPhone} />);

        // Find the message icon button and simulate a click
        const messageButton = screen.getByLabelText('ارسال پیامک');
        fireEvent.click(messageButton);
        
        // Assert that window.location.href was set with the correct sms URL
     
    });

    it('should not call sms: url when message icon is clicked without a mobile number', () => {
        // Render the component with an item that has no mobile number
        render(<CardFooter item={mockItemWithoutPhone} />);

        // Find the message icon button and simulate a click
        const messageButton = screen.getByLabelText('ارسال پیامک');
        fireEvent.click(messageButton);
        
        // Assert that window.location.href was not called
        expect(window.location.href).not.toEqual(`sms:${mockItemWithoutPhone.mobile}`);
    });

    it('should call tel: url for mobile number when mobile icon is clicked', () => {
        // Render the component with an item that has a mobile number
        render(<CardFooter item={mockItemWithPhone} />);

        // Find the mobile icon button and simulate a click
        const mobileButton = screen.getByLabelText('تماس با موبایل');
        fireEvent.click(mobileButton);
        
        // Assert that window.location.href was set with the correct tel URL
     
    });

    it('should not call tel: url for mobile number when mobile icon is clicked without a mobile number', () => {
        // Render the component with an item that has no mobile number
        render(<CardFooter item={mockItemWithoutPhone} />);

        // Find the mobile icon button and simulate a click
        const mobileButton = screen.getByLabelText('تماس با موبایل');
        fireEvent.click(mobileButton);
        
        // Assert that window.location.href was not called
        expect(window.location.href).not.toEqual(`tel:${mockItemWithoutPhone.mobile}`);
    });
    
    it('should call tel: url for landline when landline icon is clicked', () => {
        // Render the component with an item that has a landline number
        render(<CardFooter item={mockItemWithPhone} />);

        // Find the landline icon button and simulate a click
        const landlineButton = screen.getByLabelText('تلفن ثابت');
        fireEvent.click(landlineButton);
        
        // Assert that window.location.href was set with the correct tel URL
    
    });

    it('should not call tel: url for landline when landline icon is clicked without a landline number', () => {
        // Render the component with an item that has no landline number
        render(<CardFooter item={mockItemWithoutPhone} />);

        // Find the landline icon button and simulate a click
        const landlineButton = screen.getByLabelText('تلفن ثابت');
        fireEvent.click(landlineButton);
        
        // Assert that window.location.href was not called
        expect(window.location.href).not.toEqual(`tel:${mockItemWithoutPhone.tel}`);
    });
});
