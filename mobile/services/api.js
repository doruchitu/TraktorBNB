import axios from "axios";

const API_URL = "http://192.168.1.235:8000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;