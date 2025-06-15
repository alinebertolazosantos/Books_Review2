import React, { useState } from "react";
import axios from "axios";

const UpdatePassword = () => {
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setMensagem("");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8000/api/update-password",
                {
                    current_password: form.current_password,
                    new_password: form.new_password,
                    new_password_confirmation: form.new_password_confirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMensagem("Senha alterada com sucesso!");
            setForm({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
        } catch (err) {
            setErro("Erro ao alterar senha. Verifique os dados.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Alterar Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="current_password"
                    placeholder="Senha atual"
                    value={form.current_password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="new_password"
                    placeholder="Nova senha"
                    value={form.new_password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="new_password_confirmation"
                    placeholder="Confirmar nova senha"
                    value={form.new_password_confirmation}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Atualizar</button>
            </form>
            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
            {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
    );
};

export default UpdatePassword;
