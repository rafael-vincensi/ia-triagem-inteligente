import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Toast from "../components/common/Toast";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import "./PatientDetails.css";
import { FaRegCopy } from "react-icons/fa";

export default function PatientDetails() {
    const { id } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [status, setStatus] = useState("");
    const [observacao, setObservacao] = useState("");
    const [classificacao, setClassificacao] = useState("");
    const [prioridade, setPrioridade] = useState(1);
    const [encaminhamento, setEncaminhamento] = useState("");
    const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
});

    function copiarCodigo() {
    navigator.clipboard.writeText(
        paciente.codigo_ativacao
    );

    mostrarToast(
        "Código de ativação copiado!"
    );

}

    async function carregarPaciente() {
        try {

            const resposta = await api.get(`/paciente/${id}`);

            setPaciente(resposta.data);
            setStatus(resposta.data.status);
            setObservacao(resposta.data.observacoes ?? "");
            setClassificacao(resposta.data.classificacao);
            setPrioridade(resposta.data.prioridade);
            setEncaminhamento(resposta.data.encaminhamento);
        }
        catch (erro) {  
            console.error(erro);
        }
    }

    async function salvarStatus() {
    try {

        await api.put(
            `/paciente/${id}/status?status=${status}`
        );
        carregarPaciente();
    }
    catch (erro) {
        console.error(erro);
    }
}

async function salvarObservacao() {
    try {
        await api.put(
            `/paciente/${id}/observacao`,
            null,
            {
                params: {
                    observacao
                }
            }
        );
    }
    catch (erro) {
        console.error(erro);
    }
}

async function salvarClassificacao() {
    try {

        await api.put(
            `/paciente/${id}/classificacao`,
            {
                classificacao,
                prioridade,
                encaminhamento
            }
        );
        await carregarPaciente();
    }
    catch (erro) {
        console.error(erro);
    }
}

async function salvarAlteracoes() {
    try {
        await api.put(
            `/paciente/${id}/status?status=${status}`
        );
        
        await api.put(
            `/paciente/${id}/classificacao`,
            {
                classificacao,
                prioridade,
                encaminhamento
            }
        );

        await api.put(
            `/paciente/${id}/observacao`,
            null,
            {
                params: {
                    observacao
                }
            }
        );

        await carregarPaciente();

mostrarToast("Alterações salvas com sucesso.");

}

catch (erro) {
    console.error(erro);
    mostrarToast(
        "Erro ao salvar alterações.",
        "error"
    );
}
}

function mostrarToast(message, type = "success") {
    setToast({
        show: true,
        message,
        type
    });

    setTimeout(() => {
        setToast({
            show: false,
            message: "",
            type: "success"
        });
    }, 3000);
}

    useEffect(() => {
        carregarPaciente();
    }, []);

    if (!paciente) {
        return (
            <Layout>
                <h2>Carregando...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="details-header">
                <div>
                    <Link
                        to="/patients"
                        className="btn-voltar"
                    >
                        ← Voltar
                    </Link>
                    <h1>{paciente.nome}</h1>
                    <p>
                        Informações completas da triagem.
                    </p>
                </div>
            </div>

            <div className="details-grid">
                <div className="card-details">
                    <h2>Dados do Paciente</h2>
                    <div className="info">
                        <span>Código</span>
                        <strong>{paciente.codigo}</strong>
                    </div>

                    <div className="info">
                        <span>CPF</span>
                        <strong>{paciente.cpf}</strong>
                    </div>

                    <div className="info">
                        <span>Idade</span>
                        <strong>{paciente.idade} anos</strong>
                    </div>

                    <div className="info">
                        <span>Telefone</span>
                        <strong>{paciente.telefone}</strong>
                    </div>

                   <div className="info">
    <span>Código de Ativação</span>

    <div className="codigo-ativacao">
        <strong>
            {paciente.codigo_ativacao}
        </strong>
        <button
            className="btn-copy"
            onClick={copiarCodigo}
        >
            <FaRegCopy />
        </button>
    </div>
</div>

<div className="info">
    <span>IA</span>
    <strong>
        {paciente.bot_autenticado
            ? "🟢 Vinculada"
            : "🔴 Não vinculada"}
    </strong>
</div>

                    <div className="info">
                        <span>Entrada</span>
                        <strong>
                            {new Date(
                                paciente.data_entrada
                            ).toLocaleString("pt-BR")}
                        </strong>
                    </div>
                </div>

                <div className="card-details">
                    <h2>Triagem</h2>

                    <div className="info">
    <span>Classificação</span>
    <select
        value={classificacao}
        onChange={(e)=>{
            const valor = e.target.value;
            setClassificacao(valor);

            if(valor==="vermelho"){
                setPrioridade(1);
                setEncaminhamento("Emergência");
            }
            else if(valor==="laranja"){
                setPrioridade(2);
                setEncaminhamento("Sala de Urgência");
            }
            else if(valor==="amarelo"){
                setPrioridade(3);
                setEncaminhamento("Consulta Médica");
            }
            else if(valor==="verde"){
                setPrioridade(4);
                setEncaminhamento("Clínica Geral");
            }
            else{
                setPrioridade(5);
                setEncaminhamento("Orientação / Alta");
            }
        }}
    >
        <option value="vermelho">Vermelho</option>
        <option value="laranja">Laranja</option>
        <option value="amarelo">Amarelo</option>
        <option value="verde">Verde</option>
        <option value="azul">Azul</option>
    </select>
</div>

                    <div className="info">
                        <span>Prioridade</span>
                        <strong>
                            {paciente.prioridade}
                        </strong>
                    </div>

                    <div className="info">
                        <span>Encaminhamento</span>
                        <strong>
                            {paciente.encaminhamento}
                        </strong>
                    </div>

                    <div className="info">
    <span>Status</span>
    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
    >
        <option>Aguardando</option>
        <option>Em Atendimento</option>
        <option>Finalizado</option>
    </select>
</div>
                </div>
            </div>

            <div className="card-details">
                <h2>Sintomas</h2>
                <p>
                    {paciente.sintomas}
                </p>
            </div>

            <div className="card-details">
                <h2>Justificativa da IA</h2>
                <p>
                    {paciente.justificativa}
                </p>
            </div>

            <div className="card-details">
    <h2>Observações</h2>
    <textarea
        className="observacoes"
        rows="6"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
    />
</div>

<div className="details-actions">
    <button
        className="btn-salvar"
        onClick={salvarAlteracoes}
    >
        Salvar Alterações
    </button>
</div>
        <Toast
    show={toast.show}
    message={toast.message}
    type={toast.type}
/>
</Layout>
    );
}