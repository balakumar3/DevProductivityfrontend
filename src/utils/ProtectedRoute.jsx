import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    console.log("token is ", token)
    return token ? children : <Navigate to="/login" />;
}