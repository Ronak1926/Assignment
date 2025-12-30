import axios from "axios";

const api = axios.create({
  baseURL: "http://ec2-54-226-139-94.compute-1.amazonaws.com:5000",
  withCredentials: true,
});

export default api;
