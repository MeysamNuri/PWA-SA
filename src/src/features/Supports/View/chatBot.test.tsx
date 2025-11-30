import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ChatBot from './chatBot';

// Mock the child components to isolate the testing of the ChatBot component itself.
// This prevents the test from failing due to issues in the child components.
vi.mock('@/core/components/innerPagesHeader', () => ({
  default: vi.fn(({ title, path }) => (
    <div data-testid="inner-page-header">
      <span data-testid="header-title">{title}</span>
      <span data-testid="header-path">{path}</span>
    </div>
  )),
}));

vi.mock('../Components/containerChatBot', () => ({
  default: vi.fn(() => <div data-testid="chatbot-container" />),
}));

describe('ChatBot', () => {
  it('should render the InnerPageHeader and ChatBotContainer components', () => {
    // Render the ChatBot component
    render(<ChatBot />);

    // Assert that the mocked InnerPageHeader is in the document
    const headerComponent = screen.getByTestId('inner-page-header');
    expect(headerComponent).toBeInTheDocument();

    // Assert that the mocked ChatBotContainer is in the document
    const containerComponent = screen.getByTestId('chatbot-container');
    expect(containerComponent).toBeInTheDocument();

    // Optionally, you can also check if the correct props were passed to the mocked component
    const headerTitle = screen.getByTestId('header-title');
    expect(headerTitle).toHaveTextContent('چت آنلاین');

    const headerPath = screen.getByTestId('header-path');
    expect(headerPath).toHaveTextContent('/supports');
  });
});
