import axios from 'axios';

// 🚀 DYNAMIC URL CONFIGURATION
// In Production: It will use the VITE_API_URL from Vercel settings.
// In Development: It will default to your localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default API;