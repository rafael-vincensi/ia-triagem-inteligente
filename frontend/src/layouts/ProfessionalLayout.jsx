import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

export default function ProfessionalLayout({ children }) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#F5F7FA",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Header />

                <main
                    style={{
                        padding: "30px",
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}