import axios from "axios";
import { i18nInstance } from "@/locales";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

http.interceptors.request.use((config) => {
    config.headers["Accept-Language"] = i18nInstance.language
    return config;
})


export default http;