import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get("token") || null);

    useEffect(() => {
        if (token) {
            const storedUser = Cookies.get("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        }
        const interval = setInterval(() => {
            if (!Cookies.get("token")) {
                logout();
            }
        }, 5000);

        return () => clearInterval(interval);

    }, [token]);



    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        const expiresInMinutes = 40;
        const expiryDate = new Date(new Date().getTime() + expiresInMinutes * 60 * 1000);
        Cookies.set("token", jwtToken, { expires: expiryDate, secure: true });
        Cookies.set("user", JSON.stringify(userData), { expires: expiryDate, secure: true });
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        Cookies.remove("token");
        Cookies.remove("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
