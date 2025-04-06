import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { cloneElement } from "react";

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        return cloneElement(children, { role: userRole });
    } catch (err) {
        console.error("Invalid token:", err);
        return <Navigate to="/login" />;
    }
}