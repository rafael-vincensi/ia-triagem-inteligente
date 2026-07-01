import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    function sair() {
        localStorage.removeItem("usuario");
        navigate("/");
    }

    return (
        <header className="header">
            <div>
                <h2>Central de Atendimento</h2>
            </div>

            <div className="header-user">
                <div>
                    <strong>{usuario?.nome}</strong>
                    <p>{usuario?.tipo_usuario}</p>
                </div>

                <button
                    onClick={sair}
                    className="logout-button"
                >
                    Sair
                </button>
            </div>
        </header>
    );
}