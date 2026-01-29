export function storeAuthState(auth){
    localStorage.setItem('auth', JSON.stringify(auth));
}

export function loadAuthState(){
    const defaultState = { id: 0 };
    const authStateInStorage = localStorage.getItem('auth');
    if(!authStateInStorage) return defaultState;
    try {
        return JSON.parse(authStateInStorage)
    } catch {
        return defaultState;
    }
}

export function storeToken(token){
    if(token) {
        localStorage.setItem('token', JSON.stringify(token));
    }
}

export function loadToken(){
    const tokenInStorage = localStorage.getItem('token');
    if(!tokenInStorage) return null;
    try {
        return JSON.parse(tokenInStorage);
    } catch {
        return null;
    }
}

export function clearToken(){
    localStorage.removeItem('token');
}