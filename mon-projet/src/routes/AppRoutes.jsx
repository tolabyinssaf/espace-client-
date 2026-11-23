import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Devis from "../pages/Devis";
import Dashboard from "../pages/Dashboard";
import Contrats from "../pages/Contrats";
import Documents from "../pages/Documents";
import Paiements from "../pages/Paiements";
import Profil from "../pages/Profil";

import ClientLayout from "../layouts/ClientLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/dashboard" element={
                    <ClientLayout>
                        <Dashboard />
                    </ClientLayout>
                } />

                <Route path="/devis" element={
                    <ClientLayout>
                        <Devis />
                    </ClientLayout>
                } />

                <Route path="/contrats" element={
                    <ClientLayout>
                        <Contrats />
                    </ClientLayout>
                } />

                <Route path="/documents" element={
                    <ClientLayout>
                        <Documents />
                    </ClientLayout>
                } />

                <Route path="/paiements" element={
                    <ClientLayout>
                        <Paiements />
                    </ClientLayout>
                } />

                <Route path="/profil" element={
                    <ClientLayout>
                        <Profil />
                    </ClientLayout>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;


