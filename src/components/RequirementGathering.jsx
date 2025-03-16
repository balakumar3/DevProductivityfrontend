import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RequirementGathering() {
    const [formData, setFormData] = useState({ inputData: "" });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ inputData: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        try {
            const response = await fetch("http://localhost:4000/api/getDetailedRequirements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 relative">

            <div className="flex gap-6 mt-12">
                <form onSubmit={handleSubmit} className="w-1/2 bg-gray-100 p-5 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-3">Input Data</h2>
                    <div className="space-y-3">
                        <textarea
                            name="inputData"
                            onChange={handleChange}
                            placeholder="Enter your data here..."
                            className="w-full p-3 border rounded h-56"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Loading..." : "Submit"}
                        </button>
                    </div>
                </form>

                <div className="w-1/2 p-5 bg-gray-200 rounded-lg shadow-md overflow-auto max-h-[38rem]">
                    <h2 className="text-xl font-bold mb-3">Results</h2>
                    {loading && <p>Loading...</p>}
                    {results && (
                        <div className="bg-white p-3 rounded border text-sm overflow-auto max-h-[34rem] whitespace-pre-wrap break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
                                {typeof results === "object"
                                    ? "```json\n" + JSON.stringify(results, null, 2) + "\n```"
                                    : results}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
