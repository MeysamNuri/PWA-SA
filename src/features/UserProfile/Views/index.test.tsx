import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserProfileView from './index';
// import useUserProfileHooks from '../Hooks/userProfileHooks';
// import { Box, Typography, Button, Paper } from "@mui/material";

// --- Mocking Dependencies ---

// Mocking the custom hook useUserProfileHooks to control its return values
const mockUseUserProfileHooks = vi.fn();
vi.mock('../Hooks/userProfileHooks', () => ({
    default: () => mockUseUserProfileHooks(),
}));

// Mocking child components to isolate the test to UserProfileView
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: vi.fn(({ title }) => <h1 data-testid="inner-page-header">{title}</h1>),
}));
vi.mock('../Components/userInfo', () => ({
    default: vi.fn(({  serial }: { serial: string }) => (
        <div data-testid="user-info-component">
            <span data-testid="user-info-serial">{serial}</span>
        </div>
    )),
}));

// Mocking the theme hook
vi.mock('@mui/material/styles', async () => {
    const actual = await vi.importActual('@mui/material/styles');
    return {
        ...actual,
        useTheme: () => ({
            palette: {
                background: {
                    default: '#f0f0f0',
                },
            },
        }),
    };
});

// Mock the image import for the password icon
vi.mock('/images/sidebar/password.png', () => 'password.png');
vi.stubGlobal('import.meta.env', {
    BASE_URL: '/',
});

// --- Test Suite ---
describe('UserProfileView', () => {
    // Mock data for a user profile
    const mockUserProfileData = {
        name: 'Test User',
        email: 'test@example.com',
    };
    const mockHandlePassword = vi.fn();

    beforeEach(() => {
        // Reset mocks and set up a default return value before each test
        vi.clearAllMocks();
        mockUseUserProfileHooks.mockReturnValue({
            handlePassword: mockHandlePassword,
            serial: '1234567890',
            palette: {
                background: { default: '#f0f0f0' },
            },
            userProfileData: mockUserProfileData,
        });
    });

    it('should render the header and user info correctly', () => {
        // Arrange
        render(<UserProfileView />);

        // Assert
        // Check if the header is present with the correct title
        const header = screen.getByTestId('inner-page-header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent('حساب کاربری');

        // Check if the UserInfo component is rendered with the correct props
        const userInfo = screen.getByTestId('user-info-component');
        expect(userInfo).toBeInTheDocument();
        expect(screen.getByTestId('user-info-serial')).toHaveTextContent('1234567890');

        // Check for the password section's static text
        expect(screen.getByText('کلمه عبور')).toBeInTheDocument();
        expect(screen.getByText('تغییر کلمه عبور')).toBeInTheDocument();
    });

    it('should call handlePassword when the change password button is clicked', () => {
        // Arrange
        render(<UserProfileView />);
        const changePasswordButton = screen.getByRole('button', { name: 'تغییر کلمه عبور' });

        // Act
        fireEvent.click(changePasswordButton);

        // Assert
        expect(mockHandlePassword).toHaveBeenCalledTimes(1);
    });

    it('should render with an empty serial number if the serial prop is null or undefined', () => {
        // Arrange
        mockUseUserProfileHooks.mockReturnValue({
            ...mockUseUserProfileHooks(), // Keep other mocks
            serial: undefined, // Simulate a missing serial
        });
        render(<UserProfileView />);

        // Assert
        // The UserInfo component should receive an empty string
        const userInfoSerial = screen.getByTestId('user-info-serial');
        expect(userInfoSerial).toHaveTextContent('');
    });
});
