import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";
import Layout from "./components/Layout";
import Signup from "./components/Signup";
import RequirementGathering from "./components/RequirementGathering";
import KnowledgeTransfer from "./components/KnowledgeTransfer";
import CollabComponent from "./components/CollabComponent";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/requirement-gathering" element={<ProtectedRoute><RequirementGathering /></ProtectedRoute>} />
                        <Route path="/knowledge-transfer" element={<ProtectedRoute><KnowledgeTransfer /></ProtectedRoute>} />
                        <Route path="/collaboration" element={<ProtectedRoute><CollabComponent /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
