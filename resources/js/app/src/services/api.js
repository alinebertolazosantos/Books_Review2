import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // URL da sua API Laravel
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default api;
