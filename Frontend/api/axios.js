import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-backend-4rsm.onrender.com/api", 
});

export default api;