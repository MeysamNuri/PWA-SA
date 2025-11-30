import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserIdFromToken, decodeJwtToken } from './jwtUtility';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('jwtUtility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('decodeJwtToken', () => {
    it('should decode valid JWT token', () => {
      const mockPayload = {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber": "12345",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata": "user-123",
        iat: 1234567890,
        iss: "test-issuer",
        aud: "test-audience"
      };
      
      // Create a mock JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = 'mock-signature';
      const mockToken = `${header}.${payload}.${signature}`;

      const result = decodeJwtToken(mockToken);
      
      expect(result).toEqual(mockPayload);
    });

    it('should return null for invalid JWT token', () => {
      const invalidToken = 'invalid.token';

      const result = decodeJwtToken(invalidToken);
      
      expect(result).toBeNull();
    });

    it('should return null for malformed JWT token', () => {
      const malformedToken = 'not.a.valid.jwt.token.with.too.many.parts';

      const result = decodeJwtToken(malformedToken);
      
      expect(result).toBeNull();
    });

    it('should return null for empty token', () => {
      const result = decodeJwtToken('');
      
      expect(result).toBeNull();
    });
  });

  describe('getUserIdFromToken', () => {
    it('should return userId when token exists and is valid', () => {
      const mockPayload = {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber": "12345",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata": "user-123",
        iat: 1234567890,
        iss: "test-issuer",
        aud: "test-audience"
      };
      
      // Create a mock JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = 'mock-signature';
      const mockToken = `${header}.${payload}.${signature}`;
      
      localStorageMock.getItem.mockReturnValue(mockToken);

      const result = getUserIdFromToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
      expect(result).toBe('user-123');
    });

    it('should return null when token does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getUserIdFromToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
      expect(result).toBeNull();
    });

    it('should return null when token is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = getUserIdFromToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
      expect(result).toBeNull();
    });

    it('should return null when decoded token has no userdata claim', () => {
      const mockPayload = {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber": "12345",
        iat: 1234567890,
        iss: "test-issuer",
        aud: "test-audience"
      };
      
      // Create a mock JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = 'mock-signature';
      const mockToken = `${header}.${payload}.${signature}`;
      
      localStorageMock.getItem.mockReturnValue(mockToken);

      const result = getUserIdFromToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
      expect(result).toBeNull();
    });

    it('should return null when token is invalid', () => {
      const invalidToken = 'invalid.token';
      
      localStorageMock.getItem.mockReturnValue(invalidToken);

      const result = getUserIdFromToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
      expect(result).toBeNull();
    });
  });
});
