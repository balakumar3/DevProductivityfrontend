import { useAuth } from "../utils/AuthContext";

export default function Logout() {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}
