import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    BodyCard,
    HeaderCard,
    HeaderCardd,
    StyledCardContent,
    BodyStyledCardContent,
    InfoRow,
    HeaderInfoRow,
    Label,
    Value
} from '../MainCard.styles';

// Create a test theme
const theme = createTheme();

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

describe('MainCard Styles', () => {
    describe('BodyCard', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <BodyCard>
                        <div>Test Content</div>
                    </BodyCard>
                </TestWrapper>
            );

            const bodyCard = container.firstChild as HTMLElement;
            expect(bodyCard).toBeInTheDocument();
            expect(bodyCard).toHaveClass('MuiCard-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <BodyCard>
                        <div>Test Content</div>
                    </BodyCard>
                </TestWrapper>
            );

            expect(getByText('Test Content')).toBeInTheDocument();
        });
    });

    describe('HeaderCard', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <HeaderCard>
                        <div>Header Content</div>
                    </HeaderCard>
                </TestWrapper>
            );

            const headerCard = container.firstChild as HTMLElement;
            expect(headerCard).toBeInTheDocument();
            expect(headerCard).toHaveClass('MuiCard-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <HeaderCard>
                        <div>Header Content</div>
                    </HeaderCard>
                </TestWrapper>
            );

            expect(getByText('Header Content')).toBeInTheDocument();
        });
    });

    describe('HeaderCardd', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <HeaderCardd>
                        <div>Header Content</div>
                    </HeaderCardd>
                </TestWrapper>
            );

            const headerCard = container.firstChild as HTMLElement;
            expect(headerCard).toBeInTheDocument();
            expect(headerCard).toHaveClass('MuiCard-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <HeaderCardd>
                        <div>Header Content</div>
                    </HeaderCardd>
                </TestWrapper>
            );

            expect(getByText('Header Content')).toBeInTheDocument();
        });
    });

    describe('StyledCardContent', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <StyledCardContent>
                        <div>Card Content</div>
                    </StyledCardContent>
                </TestWrapper>
            );

            const cardContent = container.firstChild as HTMLElement;
            expect(cardContent).toBeInTheDocument();
            expect(cardContent).toHaveClass('MuiCardContent-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <StyledCardContent>
                        <div>Card Content</div>
                    </StyledCardContent>
                </TestWrapper>
            );

            expect(getByText('Card Content')).toBeInTheDocument();
        });
    });

    describe('BodyStyledCardContent', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <BodyStyledCardContent>
                        <div>Body Card Content</div>
                    </BodyStyledCardContent>
                </TestWrapper>
            );

            const cardContent = container.firstChild as HTMLElement;
            expect(cardContent).toBeInTheDocument();
            expect(cardContent).toHaveClass('MuiCardContent-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <BodyStyledCardContent>
                        <div>Body Card Content</div>
                    </BodyStyledCardContent>
                </TestWrapper>
            );

            expect(getByText('Body Card Content')).toBeInTheDocument();
        });
    });

    describe('InfoRow', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <InfoRow>
                        <div>Info Row Content</div>
                    </InfoRow>
                </TestWrapper>
            );

            const infoRow = container.firstChild as HTMLElement;
            expect(infoRow).toBeInTheDocument();
            expect(infoRow).toHaveClass('MuiBox-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <InfoRow>
                        <div>Info Row Content</div>
                    </InfoRow>
                </TestWrapper>
            );

            expect(getByText('Info Row Content')).toBeInTheDocument();
        });
    });

    describe('HeaderInfoRow', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <HeaderInfoRow>
                        <div>Header Info Row Content</div>
                    </HeaderInfoRow>
                </TestWrapper>
            );

            const headerInfoRow = container.firstChild as HTMLElement;
            expect(headerInfoRow).toBeInTheDocument();
            expect(headerInfoRow).toHaveClass('MuiBox-root');
        });

        it('should render children correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <HeaderInfoRow>
                        <div>Header Info Row Content</div>
                    </HeaderInfoRow>
                </TestWrapper>
            );

            expect(getByText('Header Info Row Content')).toBeInTheDocument();
        });
    });

    describe('Label', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <Label>Label Text</Label>
                </TestWrapper>
            );

            const label = container.firstChild as HTMLElement;
            expect(label).toBeInTheDocument();
            expect(label).toHaveClass('MuiTypography-root');
        });

        it('should render text correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <Label>Label Text</Label>
                </TestWrapper>
            );

            expect(getByText('Label Text')).toBeInTheDocument();
        });
    });

    describe('Value', () => {
        it('should render with correct default styles', () => {
            const { container } = render(
                <TestWrapper>
                    <Value>Value Text</Value>
                </TestWrapper>
            );

            const value = container.firstChild as HTMLElement;
            expect(value).toBeInTheDocument();
            expect(value).toHaveClass('MuiTypography-root');
        });

        it('should render text correctly', () => {
            const { getByText } = render(
                <TestWrapper>
                    <Value>Value Text</Value>
                </TestWrapper>
            );

            expect(getByText('Value Text')).toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        it('should render all components together correctly', () => {
            const { container, getByText } = render(
                <TestWrapper>
                    <HeaderCard>
                        <StyledCardContent>
                            <HeaderInfoRow>
                                <Label>Header Label</Label>
                                <Value>Header Value</Value>
                            </HeaderInfoRow>
                        </StyledCardContent>
                    </HeaderCard>
                    <BodyCard>
                        <BodyStyledCardContent>
                            <InfoRow>
                                <Label>Body Label</Label>
                                <Value>Body Value</Value>
                            </InfoRow>
                        </BodyStyledCardContent>
                    </BodyCard>
                </TestWrapper>
            );

            // Check that all components are rendered
            expect(getByText('Header Label')).toBeInTheDocument();
            expect(getByText('Header Value')).toBeInTheDocument();
            expect(getByText('Body Label')).toBeInTheDocument();
            expect(getByText('Body Value')).toBeInTheDocument();

            // Check that we have the expected number of styled components
            const cards = container.querySelectorAll('.MuiCard-root');
            expect(cards).toHaveLength(2);

            const cardContents = container.querySelectorAll('.MuiCardContent-root');
            expect(cardContents).toHaveLength(2);

            const boxes = container.querySelectorAll('.MuiBox-root');
            expect(boxes).toHaveLength(2);

            const typographies = container.querySelectorAll('.MuiTypography-root');
            expect(typographies).toHaveLength(4);
        });
    });
});
