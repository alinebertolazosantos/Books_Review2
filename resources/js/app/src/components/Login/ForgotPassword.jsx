import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setMensagem("");

        try {
            await axios.post("http://localhost:8000/api/forgot-password", {
                email,
            });
            setMensagem("Email de recuperação enviado com sucesso!");
        } catch (err) {
            setErro("Erro ao enviar email. Verifique o email informado.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Esqueci minha senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar Link</button>
            </form>
            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
            {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
    );
};

export default ForgotPassword;
