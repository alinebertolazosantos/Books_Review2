// src/services/auth.js
import api from "./api";

export const login = async (email, password) => {
    try {
        // 1. Pegar o cookie CSRF necessário para o Sanctum
        await api.get("/sanctum/csrf-cookie");

        // 2. Fazer o login
        const response = await api.post("/login", {
            email,
            password,
        });

        // 3. Armazenar o token no navegador
        localStorage.setItem("token", response.data.token);

        return response.data.user; // dados do usuário logado
    } catch (error) {
        throw new Error("Login falhou. Verifique email e senha.");
    }
};
