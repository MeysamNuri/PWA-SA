import { describe, it, expect } from 'vitest';
import { SupportsViewRoutes } from './routes'; // Update the import path to your file
import ChatBot from './View/chatBot';
import Supports from './View';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

// This test suite focuses on validating the structure of the route configuration array.
describe('SupportsViewRoutes', () => {
  // Test case to check if the route array is correctly defined.
  it('should define the correct route structure', () => {
    // Assert that the SupportsViewRoutes is an array with a single top-level route object.
    expect(Array.isArray(SupportsViewRoutes)).toBe(true);
    expect(SupportsViewRoutes).toHaveLength(1);

    const mainRoute = SupportsViewRoutes[0];

    // Assert that the top-level route object has the expected properties.
    expect(mainRoute).toHaveProperty('path', '/supports');
    expect(mainRoute).toHaveProperty('Component', ProtectedLayout);
    expect(mainRoute).toHaveProperty('children');

    // Assert that the children property is an array with two nested routes.
    const childRoutes:any = mainRoute.children;
    expect(Array.isArray(childRoutes)).toBe(true);
    expect(childRoutes).toHaveLength(2);

    // Get the first child route object.
    const supportsChildRoute = childRoutes[0];

    // Assert the properties of the first child route.
    expect(supportsChildRoute).toHaveProperty('path', '');
    expect(supportsChildRoute).toHaveProperty('Component', Supports);

    // Get the second child route object.
    const chatBotChildRoute = childRoutes[1];

    // Assert the properties of the second child route.
    expect(chatBotChildRoute).toHaveProperty('path', '/supports/chatbot');
    expect(chatBotChildRoute).toHaveProperty('Component', ChatBot);
  });
});