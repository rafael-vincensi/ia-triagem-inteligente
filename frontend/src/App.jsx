import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Triage from "./pages/Triage";
import Consultations from "./pages/Consultations";
import Settings from "./pages/Settings";


export default function App() {

    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/patients" element={<Patients />} />

            <Route path="/paciente/:id" element={<PatientDetails />} />

            <Route path="/triage/:id" element={<Triage />} />

            <Route path="/consultations" element={<Consultations />} />

            <Route path="/settings" element={<Settings />} />

        </Routes>
    );
}