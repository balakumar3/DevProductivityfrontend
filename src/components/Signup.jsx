import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [userData, setUserData] = useState({
        emailId: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        const { emailId, password, firstName, lastName, role } = userData;
        if (!emailId || !password || !firstName || !lastName || !role) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="emailId"
                        placeholder="emailId"
                        value={userData.emailId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={userData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
