import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserProfileView from './index'; // Adjust the import path as needed

// Mock the child components to simplify the test.
// This allows us to test UserProfileView in isolation without worrying about
// the internal implementation of InnerPageHeader and PaperCard.
// We'll give them simple, testable content that includes the props they receive.
vi.mock('@/core/components/innerPagesHeader', () => ({
  default: ({ title, path }: { title: string; path: string }) => (
    // We render a simple div with a test ID and the title prop.
    <div data-testid="inner-page-header">{title} - {path}</div>
  ),
}));

vi.mock('../Components/paperCard', () => ({
  default: ({ title, path }: { title: string; path: string }) => (
    // We render a div with a test ID and the title prop to check for it later.
    <div data-testid="paper-card">{title} - {path}</div>
  ),
}));

describe('UserProfileView', () => {
  // This test verifies that the component renders the header and the correct number of cards.
  it('should render the header and a list of support cards', () => {
    // 1. Render the component.
    render(<UserProfileView />);

    // 2. Assert that the header is present with the correct title.
    // We can use a combination of `getByTestId` and `toHaveTextContent` for a precise check.
    const headerElement = screen.getByTestId('inner-page-header');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent('پشتیبانی - /home');

    // 3. Assert that the correct number of PaperCard components are rendered.
    // The `getAllByTestId` method is useful for finding multiple elements with the same ID.
    const paperCards = screen.getAllByTestId('paper-card');
    expect(paperCards).toHaveLength(2);

    // 4. Assert that each card is rendered with the correct title.
    // We can check for the specific text content of each card.
    expect(screen.getByText('گفتگوی آنلاین - chatBot')).toBeInTheDocument();
    expect(screen.getByText('گفتگوی تلفنی - call')).toBeInTheDocument();
  });
});