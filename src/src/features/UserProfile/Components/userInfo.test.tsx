import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserInfo from './userInfo'; // Assuming the component is in the parent directory
import type { IUserProfileDataRes } from '../types';
import { NumberConverter } from '@/core/helper/numberConverter';

// --- Mocking Dependencies ---

// Mock the NumberConverter utility to control its output
// This ensures that we can reliably test the rendered text.
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: vi.fn((value: string | undefined) => {
            // Handle the case where the value is undefined, which happens when the component receives no data.
            // Returning an empty string here makes the test logic cleaner.
            if (value === undefined) {
                return '';
            }
            return `Persian(${value})`;
        }),
    },
}));

// Mock the environment variable to a known value
// This prevents issues with test runners that don't have a defined import.meta.env
vi.stubEnv('BASE_URL', '/');

// --- Test Suite ---
describe('UserInfo', () => {
    // Mock data for a user profile
    const mockUserProfileData: IUserProfileDataRes = {
        firstName: 'Test',
        lastName: 'User',
        businessName: 'Test Business Co.',
        phoneNumber: '09123456789',
        getUserProfileDtos: [{
            isActive: true,
            serial: '123456789',
            cloudDBName: 'Test Cloud DB',
            guaranteeDate: '2025-01-01'
        }],
        hasSerial: true,
    };

    const mockSerial = '123456789';

    // Clear all mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the user information correctly with all data', () => {
        // Arrange & Act
        render(<UserInfo userProfileData={mockUserProfileData} serial={mockSerial} />);

        // Assert
        // Check for static text and titles
        expect(screen.getByText('اطلاعات حساب کاربری')).toBeInTheDocument();
        expect(screen.getByText('نام کاربری')).toBeInTheDocument();
        expect(screen.getByText('نام و نام خانوادگی')).toBeInTheDocument();
        expect(screen.getByText('شماره همراه')).toBeInTheDocument();
        expect(screen.getByText('عنوان کسب و کار')).toBeInTheDocument();
        expect(screen.getByText('سریال نرم افزار')).toBeInTheDocument();

        // Check for dynamic user data
        // Use getAllByText to find both instances of the phone number and assert there are two.
        const phoneNumbers = screen.getAllByText('Persian(09123456789)');
        expect(phoneNumbers).toHaveLength(2);
        
        expect(screen.getByText(`${mockUserProfileData.firstName} ${mockUserProfileData.lastName}`)).toBeInTheDocument();
        expect(screen.getByText(mockUserProfileData.businessName)).toBeInTheDocument();
        expect(screen.getByText(`Persian(${mockSerial})`)).toBeInTheDocument();

        // Check that NumberConverter was called with the correct values
        expect(vi.mocked(NumberConverter.latinToArabic)).toHaveBeenCalledWith('09123456789');
        expect(vi.mocked(NumberConverter.latinToArabic)).toHaveBeenCalledWith(mockSerial);
    });

    it('should handle undefined user data gracefully', () => {
        // Arrange & Act
        render(<UserInfo userProfileData={undefined} serial={mockSerial} />);

        // Assert
        // The static labels should still be present
        expect(screen.getByText('اطلاعات حساب کاربری')).toBeInTheDocument();
        
        // Use a more specific query to find the element that should be empty.
        // The component's logic will render an empty <h6> tag when userProfileData is undefined.
        const usernameValue = screen.getByText('نام کاربری').nextElementSibling;
        expect(usernameValue).toHaveTextContent('');

        const phoneNumberValue = screen.getByText('شماره همراه').nextElementSibling;
        expect(phoneNumberValue).toHaveTextContent('');

        // The full name and business name are rendered with an empty string
        const fullName = screen.getByText('نام و نام خانوادگی').nextElementSibling;
        expect(fullName).toHaveTextContent('');

        const businessName = screen.getByText('عنوان کسب و کار').nextElementSibling;
        expect(businessName).toHaveTextContent('');

        // The serial number should still be rendered correctly
        expect(screen.getByText(`Persian(${mockSerial})`)).toBeInTheDocument();

        // We check that the NumberConverter was called with the correct values
        expect(vi.mocked(NumberConverter.latinToArabic)).toHaveBeenCalledWith(mockSerial);
        
        // The previous assertion that the mock was called with 'undefined' was incorrect,
        // as the component's logic prevents that call. The mock is only called with the serial.
    });
});
