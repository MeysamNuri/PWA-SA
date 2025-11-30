// LogoSection.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LogoSection from './logoSection';

describe('LogoSection', () => {
  it('renders the logo image and the title text', () => {
    // Render the component to be tested.
    render(<LogoSection />);

    // Assert that the logo image is present using its alt text.
    const logoImage = screen.getByAltText('Login');
    expect(logoImage).toBeInTheDocument();

    // Assert that the main title text is present on the screen.
    const titleText = screen.getByText('دستیار هوشمند هلو');
    expect(titleText).toBeInTheDocument();
  });
});
