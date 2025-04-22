// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', // Fallback for local
  withCredentials: false, // set to true only if you use cookies/sessions
});

export default API;
