import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LayoutWebsite from "./pages/(website)/layout";
import HomePage from "./pages/(website)/home/page";
import SignupPage from "./pages/(auth)/signup/page";
import LayoutAdmin from "./pages/(admin)/layout";
import DashboardPage from "./pages/(admin)/dashboard/page";
import NotFoundPage from "./pages/(website)/404/page";
import AdminProductPage from "./pages/(admin)/products/page";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="signup" element={<SignupPage />} />
                </Route>
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products" element={<AdminProductPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
