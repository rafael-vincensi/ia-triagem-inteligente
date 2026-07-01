import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/layout/Layout";

import "./Consultations.css";

export default function Consultations() {
    const [pacientes, setPacientes] = useState([]);

    async function carregarPacientes() {
        try {
            const resposta = await api.get("/historico");
            setPacientes(resposta.data);
        } catch (erro) {
            console.error(erro);
        }
    }

    useEffect(() => {
        carregarPacientes();
    }, []);

    const historico = pacientes.filter(
        (paciente) => paciente.status === "Finalizado"
    );

    return (
        <Layout>
            <div className="consultations-header">
                <h1>Histórico de Atendimentos</h1>

                <p>Pacientes com atendimento finalizado.</p>
            </div>

            <div className="consultations-table">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Classificação</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {historico.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.codigo}</td>
                                <td>{paciente.nome}</td>

                                <td>
                                    <span
                                        className={`badge ${paciente.classificacao.toLowerCase()}`}
                                    >
                                        {paciente.classificacao}
                                    </span>
                                </td>

                                <td>
                                    {new Date(paciente.data_entrada).toLocaleString("pt-BR")}
                                </td>

                                <td>
                                    <Link
                                        to={`/paciente/${paciente.id}`}
                                        className="btn-detalhes"
                                    >
                                        Visualizar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}