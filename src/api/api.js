// src/api/api.js (Frontend)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth/login', // Make sure this matches your backend URL
  withCredentials: true,
});

export default api;