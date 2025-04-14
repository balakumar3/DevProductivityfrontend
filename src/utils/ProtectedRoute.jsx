import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { cloneElement } from "react";

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode(token);
        console.log("decoded is ", decoded);
        const userRole = decoded.role;
        const userEmail = decoded.emailId;
        return cloneElement(children, { role: userRole, emailId: userEmail });
    } catch (err) {
        console.error("Invalid token:", err);
        return <Navigate to="/login" />;
    }
}