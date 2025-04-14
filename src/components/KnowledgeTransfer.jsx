import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

function KnowledgeTransfer() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [formData, setFormData] = useState({ problem: "", solution: "", tags: "", category: "" });
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const fetchKnowledge = async () => {
        const res = await axios.get(`${API_URL}/knowledge`);
        setResults(res.data);
    };

    const search = async () => {
        const res = await axios.get(`${API_URL}/search?query=${query}`);
        setResults(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedEntry) {
            await axios.put(`${API_URL}/knowledge/${selectedEntry._id}`, {
                ...formData,
                tags: formData.tags.split(","),
            });
            setSelectedEntry(null);
        } else {
            await axios.post(`${API_URL}/knowledge`, {
                ...formData,
                tags: formData.tags.split(","),
            });
        }
        setFormData({ problem: "", solution: "", tags: "", category: "" });
        fetchKnowledge();
        setShowForm(false);
    };

    const handleEdit = (entry) => {
        setSelectedEntry(entry);
        setFormData({
            problem: entry.problem,
            solution: entry.solution,
            tags: entry.tags.join(", "),
            category: entry.category,
        });
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-4 sm:mb-6">Knowledge Repository</h1>

                <div className="flex flex-col sm:flex-row mb-4 gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={search}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>

                <button
                    onClick={() => {
                        setShowForm(true);
                        setSelectedEntry(null);
                        setFormData({ problem: "", solution: "", tags: "", category: "" });
                    }}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto"
                >
                    + Create New Problem
                </button>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg text-sm sm:text-base">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-3 py-2 text-left">Problem</th>
                                <th className="px-3 py-2 text-left">Category</th>
                                <th className="px-3 py-2 text-left">Tags</th>
                                <th className="px-3 py-2 text-left">Solution</th>
                                <th className="px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item) => (
                                <tr key={item._id} className="border-t">
                                    <td className="px-3 py-2">{item.problem}</td>
                                    <td className="px-3 py-2">{item.category}</td>
                                    <td className="px-3 py-2">{item.tags.join(", ")}</td>
                                    <td className="px-3 py-2" title={item.solution}>
                                        {item.solution.length > 20 ? item.solution.substring(0, 20) + "..." : item.solution}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            onClick={() => handleEdit(item)}
                                        >
                                            View/Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                {selectedEntry ? "Edit Problem" : "Create New Problem"}
                            </h2>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Problem"
                                    value={formData.problem}
                                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <textarea
                                    placeholder="Solution"
                                    value={formData.solution}
                                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                    required
                                    className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                >
                                    {selectedEntry ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default KnowledgeTransfer;
