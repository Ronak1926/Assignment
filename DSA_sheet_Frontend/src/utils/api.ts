import axios from "axios";

// Use env var if provided, otherwise default to deployed backend URL.
// For local dev, set VITE_API_URL=http://localhost:5000
const baseURL = "https://dsa-sheet-backend-9v6d.onrender.com";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
