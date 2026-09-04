export function getToken() {
    return localStorage.getItem('recipe_token');
}

export function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function logout() {
    localStorage.removeItem('recipe_token');
}