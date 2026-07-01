import { useEffect, useState } from "react";

import api from "../services/api";
import Layout from "../components/layout/Layout";

import "./Dashboard.css";

export default function Dashboard() {

    const [pacientes, setPacientes] = useState([]);
    const usuario = JSON.parse(localStorage.getItem("usuario"));

const nomeUsuario = usuario?.nome;
    async function carregarPacientes() {

        try {
            const resposta = await api.get("/fila");
            setPacientes(resposta.data);
        } catch (erro) {
            console.error(erro);
        }
    }

    useEffect(() => {
        carregarPacientes();
        const intervalo = setInterval(() => {
            carregarPacientes();
        }, 10000);
        return () => clearInterval(intervalo);
    }, []);

    const vermelhos = pacientes.filter(
        p => p.classificacao?.toLowerCase() === "vermelho"
    ).length;

    const laranjas = pacientes.filter(
        p => p.classificacao?.toLowerCase() === "laranja"
    ).length;

    const amarelos = pacientes.filter(
        p => p.classificacao?.toLowerCase() === "amarelo"
    ).length;

    const verdes = pacientes.filter(
        p => p.classificacao?.toLowerCase() === "verde"
    ).length;

    const azuis = pacientes.filter(
        p => p.classificacao?.toLowerCase() === "azul"
    ).length;

    const aguardando = pacientes.filter(
        p => p.status === "Aguardando"
    ).length;

    const atendimento = pacientes.filter(
        p => p.status === "Em Atendimento"
    ).length;

    const finalizados = pacientes.filter(
        p => p.status === "Finalizado"
    ).length;

    const casosCriticos = vermelhos + laranjas;

    const maiorPrioridade =
        vermelhos > 0 ? "Vermelho"
        : laranjas > 0 ? "Laranja"
        : amarelos > 0 ? "Amarelo"
        : verdes > 0 ? "Verde"
        : "Azul";

    const tempoMedio = "36 min";
    const hora = new Date().getHours();

    let saudacao = "Olá";

if (hora < 12) {
    saudacao = "Bom dia";
} else if (hora < 18) {
    saudacao = "Boa tarde";
} else {
    saudacao = "Boa noite";
}

    return (
        <Layout>
            <div className="dashboard-header">
    <div>
        <h1>
    {saudacao}, {nomeUsuario || "Usuário"} 👋
</h1>
        <p>
            Visão geral da triagem hospitalar.
        </p>
    </div>
</div>

            <div className="cards">
                <div className="card-dashboard">
                    <span>Total de Pacientes</span>
                    <h2>{pacientes.length}</h2>
                </div>

                <div className="card-dashboard">
                    <span>Aguardando</span>
                    <h2>{aguardando}</h2>
                </div>

                <div className="card-dashboard">
                    <span>Em Atendimento</span>
                    <h2>{atendimento}</h2>
                </div>

                <div className="card-dashboard">
                    <span>Finalizados</span>
                    <h2>{finalizados}</h2>
                </div>
            </div>

            <div className="dashboard-middle">
                <div className="dashboard-manchester">
                    <h2>Classificação Manchester</h2>
                        <div className="linha">
                        <span>Vermelho</span>
                        <div className="barra">
                            <div
                                className="preenchimento vermelho"
                                style={{
                                    width: `${pacientes.length ? (vermelhos / pacientes.length) * 100 : 0}%`
                                }}
                            />
                        </div>
                        <strong>{vermelhos}</strong>
                    </div>

                    <div className="linha">
                        <span>Laranja</span>
                        <div className="barra">
                            <div
                                className="preenchimento laranja"
                                style={{
                                    width: `${pacientes.length ? (laranjas / pacientes.length) * 100 : 0}%`
                                }}
                            />=
                        </div>
                        <strong>{laranjas}</strong>
                    </div>

                    <div className="linha">
                        <span>Amarelo</span>
                        <div className="barra">
                            <div
                                className="preenchimento amarelo"
                                style={{
                                    width: `${pacientes.length ? (amarelos / pacientes.length) * 100 : 0}%`
                                }}
                            />
                        </div>
                        <strong>{amarelos}</strong>
                    </div>

                    <div className="linha">
                        <span>Verde</span>
                        <div className="barra">
                            <div
                                className="preenchimento verde"
                                style={{
                                    width: `${pacientes.length ? (verdes / pacientes.length) * 100 : 0}%`
                                }}
                            />
                        </div>
                        <strong>{verdes}</strong>
                    </div>

                    <div className="linha">
                        <span>Azul</span>
                        <div className="barra">
                            <div className="preenchimento azul" style={{
                                    width: `${pacientes.length ? (azuis / pacientes.length) * 100 : 0}%`
                                }}
                            />
                        </div>
                        <strong>{azuis}</strong>
                    </div>
                </div>
                
                <div className="dashboard-info">
                    <h2>Situação da Fila</h2>
                    <div className="info-item">
                        <span>Maior prioridade</span>
                        <strong className={maiorPrioridade.toLowerCase()}>{maiorPrioridade}</strong>
                    </div>
                    <div className="info-item">
                        <span>Casos críticos</span>
                        <strong>
                            {casosCriticos}
                        </strong>
                    </div>
                    <div className="info-item">
                        <span>Tempo médio de espera</span>
                        <strong>{tempoMedio}</strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-table">
                <h2>Últimos pacientes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Classificação</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes
                            .slice()
                            .reverse()
                            .slice(0, 10)
                            .map((paciente) => (
                                <tr key={paciente.id}>
                                    <td>{paciente.codigo}</td>
                                    <td>{paciente.nome}</td>
                                    <td>
                                        <span
                                            className={`badge ${paciente.classificacao?.toLowerCase()}`}
                                        >
                                            {paciente.classificacao}
                                        </span>
                                    </td>
                                    <td>{paciente.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}