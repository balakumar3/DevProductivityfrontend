import { useAuth } from "../utils/AuthContext";

export default function Header() {
    const { token, logout } = useAuth();

    return (
        <div className="p-4 sm:p-6">
            <header className="relative py-4 sm:py-6 shadow-md rounded-lg bg-violet-200 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:justify-center px-4 sm:px-6">
                <h1 className="text-xl sm:text-3xl font-bold text-violet-700 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                    Dev Productivity Web App
                </h1>
                {token && (
                    <button
                        onClick={logout}
                        className="mt-2 sm:mt-0 sm:absolute sm:right-6 bg-red-500 text-white text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                )}
            </header>
        </div>
    );
}
