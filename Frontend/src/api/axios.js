import axios from 'axios';

const instance = axios.create({
  baseURL: '/', // Relative URL with Vite proxy
  withCredentials: true, // Required for cookies
});

export default instance;