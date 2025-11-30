// BackArrow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackArrow from './backArrow';

describe('BackArrow', () => {
  it('calls handleBack when the arrow is clicked', () => {
    // Create a mock function to act as the handleBack prop.
    const mockHandleBack = vi.fn();

    // Render the BackArrow component, passing the mock function as a prop.
    render(<BackArrow handleBack={mockHandleBack} />);

    // Find the clickable element. We can use getByRole to find the button or generic element that handles the click.
    // The previous test failed because the Box component did not have a role='button' attribute.
    // To fix this we have added role='button' attribute to the Box component in the BackArrow.tsx file
    const backArrowBox = screen.getByRole('button');

    // Simulate a click event on the element.
    fireEvent.click(backArrowBox);

    // Assert that the mock function was called exactly once after the click.
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });
});
