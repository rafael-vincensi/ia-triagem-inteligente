import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {

    const navigate = useNavigate();
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");

    function formatarCPF(valor) {

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
    }

    async function handleLogin(e) {

        e.preventDefault();
        setErro("");

        if (cpf.length !== 14) {
            setErro("Informe um CPF válido.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve possuir pelo menos 6 caracteres.");
            return;
        }
        try {

            const resposta = await api.post("/login", {
                cpf,
                senha
            });

            localStorage.setItem(
                "usuario",
                JSON.stringify(resposta.data)
            );

            navigate("/dashboard");

        }

        catch (err) {

            if (err.response) {
                setErro(err.response.data.detail);
            } else {
                setErro("Não foi possível conectar ao servidor.");
            }
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Portal Hospitalar</h1>
                <p>Faça login para acessar o sistema.</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>CPF</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={cpf}
                            onChange={(e) =>
                                setCpf(formatarCPF(e.target.value))
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <div className="password-input">
                            <input
                                type={
                                    mostrarSenha
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                    setMostrarSenha(!mostrarSenha)
                                }
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                    
                    {
                        erro &&
                        <span className="erro">
                            {erro}
                        </span>
                    }

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}