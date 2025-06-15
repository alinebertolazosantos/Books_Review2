// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // ou a URL da sua API
    withCredentials: true, // necessário para Sanctum
});

export default api;
