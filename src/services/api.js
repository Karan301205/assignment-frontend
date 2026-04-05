import axios from 'axios';

const API = axios.create({
  baseURL: 'https://assignment-backend-byxf.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Must match the key in AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Must have the space after 'Bearer'
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;