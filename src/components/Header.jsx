import { useAuth } from "../utils/AuthContext";

export default function Header() {
    const { token, logout } = useAuth();

    return (
        <div className="flex flex-col gap-6 p-6 relative">
            <header className="relative py-6 min-h-[80px] shadow-md rounded-lg bg-violet-200 w-full max-w-4xl mx-auto flex items-center justify-center">
                <h1 className="text-3xl font-bold text-violet-700 absolute left-1/2 transform -translate-x-1/2">
                    Dev Productivity Web App
                </h1>
                {token && (
                    <button
                        onClick={logout}
                        className="absolute right-6 bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                )}
            </header>
        </div>
    );
}
