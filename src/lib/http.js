import axios from "axios";
import { i18nInstance } from "@/locales";
import { loadToken } from "@/shared/state/storage";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

http.interceptors.request.use((config) => {
    config.headers["Accept-Language"] = i18nInstance.language;
    
    // Add Authorization header if token exists
    const token = loadToken();
    if (token) {
        config.headers["Authorization"] = `${token.prefix} ${token.token}`;
    }
    
    return config;
})


export default http;