import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import "./Patients.css";
import Modal from "../components/common/Modal";

export default function Patients() {

    const [pacientes, setPacientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const [classificacaoFiltro, setClassificacaoFiltro] = useState("Todas");
    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [idade, setIdade] = useState("");
    const [telefone, setTelefone] = useState("");
    const [sintomas, setSintomas] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function carregarPacientes() {

        try {
            const resposta = await api.get("/fila");
            setPacientes(resposta.data);
        }
        catch (erro) {
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

    async function cadastrarPaciente() {
        if (!nome || !idade || !sintomas) {
        alert("Preencha os campos obrigatórios.");
    
        return;

}

    try {
        setCarregando(true);
        await api.post("/triagem", {
            nome,
            cpf,
            idade: Number(idade),
            telefone,
            sintomas
        });

        await carregarPacientes();
        setModalAberto(false);
        setNome("");
        setCpf("");
        setIdade("");
        setTelefone("");
        setSintomas("");
    }

    catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar paciente.");
    }

    finally {
        setCarregando(false);
}

}

    const pacientesFiltrados = pacientes.filter((paciente) => {

        const nomeOk = paciente.nome
            .toLowerCase()
            .includes(busca.toLowerCase());

        const statusOk =
            statusFiltro === "Todos"
                ? true
                : paciente.status === statusFiltro;

        const classificacaoOk =
            classificacaoFiltro === "Todas"
                ? true
                : paciente.classificacao?.toLowerCase() === classificacaoFiltro.toLowerCase();

        return nomeOk && statusOk && classificacaoOk;

    });

    return (
        <Layout>
            <div className="patients-header">
                <div>
                    <h1>Pacientes</h1>
                    <p>
                        Gerenciamento da fila de atendimento.
                    </p>
                </div>
                <button

    className="btn-novo"
    onClick={() => {setModalAberto(true);
    }}
>
    + Nova Triagem
</button>
            </div>

            <div className="patients-filters">
                <input
                    type="text"
                    placeholder="Pesquisar paciente..."
                    value={busca}
                    onChange={(e) =>
                        setBusca(e.target.value)
                    }
                />
                <select
                    value={statusFiltro}
                    onChange={(e) =>
                        setStatusFiltro(e.target.value)
                    }
                >
                    <option>Todos</option>
                    <option>Aguardando</option>
                    <option>Em Atendimento</option>
                </select>
                <select
                    value={classificacaoFiltro}
                    onChange={(e) =>
                        setClassificacaoFiltro(e.target.value)
                    }
                >
                    <option>Todas</option>
                    <option>Vermelho</option>
                    <option>Laranja</option>
                    <option>Amarelo</option>
                    <option>Verde</option>
                    <option>Azul</option>
                </select>
            </div>

            <div className="patients-table">
                <div className="patients-total">
                    {pacientesFiltrados.length} paciente(s)
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Classificação</th>
                            <th>Status</th>
                            <th>Entrada</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>                        {pacientesFiltrados.map((paciente) => (
                            <tr
key={paciente.id}
    className={`linha-${paciente.classificacao?.toLowerCase()}`}
>
                                <td>{paciente.codigo}</td>
                                <td>{paciente.nome}</td>
                                <td>{paciente.idade}</td>
                                <td>
                                    <span
                                        className={`badge ${paciente.classificacao?.toLowerCase()}`}
                                    >
                                        {paciente.classificacao}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`status ${paciente.status
                                            .toLowerCase()
                                            .replace(/\s/g, "-")}`}
                                    >
                                        {paciente.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(
                                        paciente.data_entrada
                                    ).toLocaleTimeString(
                                        "pt-BR",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}
                                </td>
                                <td>
                                    <Link
                                        to={`/paciente/${paciente.id}`}
                                        className="btn-detalhes"
                                    >
                                        Detalhes
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                        </div>
            <Modal
    open={modalAberto}
    onClose={() => setModalAberto(false)}
>

    <div className="modal-triagem">
        <h2>Nova Triagem</h2>
        <div className="form-group">
            <label>Nome</label>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>CPF</label>
                <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Idade</label>
                <input
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                />
            </div>
        </div>

        <div className="form-group">
            <label>Telefone</label>
            <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Sintomas</label>
            <textarea
                rows="5"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
            />
        </div>

        <div className="modal-actions">
            <button
                className="btn-cancelar"
                onClick={() => setModalAberto(false)}
            >
                Cancelar
            </button>
            <button
    className="btn-novo"
    onClick={cadastrarPaciente}
    disabled={carregando}
>
    {carregando ? "Classificando..." : "Classificar"}
</button>
        </div>
    </div>
</Modal>
        </Layout>
    );
}