import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // This points to your Node server
});

export default API;