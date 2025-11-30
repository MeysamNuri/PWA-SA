interface JwtPayload {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata": string;
    iat: number;
    iss: string;
    aud: string;
}

export const decodeJwtToken = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const decoded = decodeJwtToken(token);
    return decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"] || null;
};
