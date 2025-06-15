import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [erro, setErro] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/register",
                form
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Erro ao registrar.";
            setErro(msg);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Registrar</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmar Senha"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                />
                {erro && <p style={{ color: "red" }}>{erro}</p>}
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Signup;
