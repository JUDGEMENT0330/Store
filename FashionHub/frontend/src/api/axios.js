import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
