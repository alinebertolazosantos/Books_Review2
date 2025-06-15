import React, { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/livros"); // redireciona após o login
        } catch (err) {
            setErro(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
