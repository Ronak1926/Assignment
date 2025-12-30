import axios from "axios";

const api = axios.create({
  baseURL: "https://assigment.duckdns.org",
  withCredentials: true,
});

export default api;
