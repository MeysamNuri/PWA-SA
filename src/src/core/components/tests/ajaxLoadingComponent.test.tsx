import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

// Import the actual component you want to test
import AjaxLoadingComponent from '../ajaxLoadingComponent';

// Mock the @mui/material module since the component uses it
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    // We only need to provide a simple mock for the Box component
    // that just renders its children and passes through the sx prop.
    Box: ({ children, sx, ...props }:{children:any,sx:any}) => (
      <div data-testid="mock-box" style={sx} {...props}>
        {children}
      </div>
    ),
  };
});

// Define the test suite for the AjaxLoadingComponent
describe('AjaxLoadingComponent', () => {
    // Test case: should render the loading spinner
    it('should render the loading spinner', () => {
        // Render the component to the virtual DOM
        render(<AjaxLoadingComponent />);

        // Use the screen object to query for the span element with the class "loader"
        const loaderElement = screen.getByTestId('mock-box').querySelector('.loader');

        // Assert that the element is in the document
        expect(loaderElement).toBeInTheDocument();
    });

    // Test case: should apply the correct styling
    it('should have correct styling for centering content', () => {
      // Render the component
      render(<AjaxLoadingComponent />);

      // Get the mocked Box element
      const boxElement = screen.getByTestId('mock-box');

      // Assert that the styles for centering are applied
      expect(boxElement).toHaveStyle('display: flex');
      expect(boxElement).toHaveStyle('justify-content: center');
      expect(boxElement).toHaveStyle('align-items: center');
      expect(boxElement).toHaveStyle('height: 90vh');
      expect(boxElement).toHaveStyle('align-content: center');
    });
});
