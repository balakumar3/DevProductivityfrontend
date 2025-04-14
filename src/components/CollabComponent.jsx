import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const CollabComponent = () => {
    const [features, setFeatures] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState({});
    const [chatMessages, setChatMessages] = useState({});
    const [chatInput, setChatInput] = useState({});
    const [user] = useState(Cookies.get("user") || "Anonymous");

    const socketRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:4000/features").then((res) => setFeatures(res.data));
        socketRef.current = io("http://localhost:4000");

        socketRef.current.on("newMessage", ({ featureId, message }) => {
            setChatMessages((prev) => ({
                ...prev,
                [featureId]: [...(prev[featureId] || []), message]
            }));
        });

        socketRef.current.on("chatHistory", ({ featureId, messages }) => {
            setChatMessages((prev) => ({
                ...prev,
                [featureId]: messages
            }));
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const joinChatRoom = (featureId) => {
        socketRef.current.emit("joinFeatureChat", featureId);
    };

    const sendMessage = (featureId) => {
        const text = chatInput[featureId]?.trim();
        if (!text) return;
        socketRef.current.emit("sendMessage", { featureId, user, text });
        setChatInput({ ...chatInput, [featureId]: "" });
    };

    const addFeature = () => {
        if (!title.trim() || !description.trim()) return;
        axios.post("http://localhost:4000/features", { title, description }).then((res) => {
            setFeatures([...features, res.data]);
            setTitle("");
            setDescription("");
        });
    };

    const upvoteFeature = (id) => {
        axios.post(`http://localhost:4000/features/${id}/vote`, { user })
            .then((res) => {
                setFeatures(features.map((f) => (f._id === id ? res.data : f)));
            })
            .catch((err) => {
                if (err.response?.data?.message === "User has already voted") {
                    alert("You've already voted for this feature!");
                } else {
                    console.error("Error voting:", err);
                }
            });
    };

    const addComment = (id) => {
        if (!comments[id]) return;
        axios.post(`http://localhost:4000/features/${id}/comment`, { user, text: comments[id] }).then((res) => {
            setFeatures(features.map((f) => (f._id === id ? res.data : f)));
            setComments({ ...comments, [id]: "" });
        });
    };

    const deleteFeature = (id) => {
        axios.delete(`http://localhost:4000/features/${id}`).then(() => {
            setFeatures(features.filter((f) => f._id !== id));
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feature Requests</h1>

            <div className="mb-6 space-y-2">
                <input
                    className="border p-2 w-full rounded"
                    placeholder="Feature title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className="border p-2 w-full rounded"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={addFeature}>
                    Submit Feature
                </button>
            </div>

            <ul className="space-y-6">
                {features.map((feature) => (
                    <li key={feature._id} className="border p-4 rounded shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                            <div className="w-full">
                                <h3 className="text-xl font-semibold break-words">{feature.title}</h3>
                                <p className="text-gray-600 break-words">{feature.description}</p>
                                <p className="font-bold mt-1">Votes: {feature.votes}</p>

                                {!feature.votedUsers?.includes(user) && (
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                                        onClick={() => upvoteFeature(feature._id)}
                                    >
                                        Upvote
                                    </button>
                                )}

                                <ul className="mt-3 space-y-1">
                                    {feature.comments.map((c, index) => (
                                        <li key={index} className="text-sm text-gray-700 break-words">
                                            <span className="font-medium">{c.user}:</span> {c.text}
                                        </li>
                                    ))}
                                </ul>

                                <input
                                    className="border p-2 w-full mt-2 rounded"
                                    placeholder="Comment"
                                    value={comments[feature._id] || ""}
                                    onChange={(e) =>
                                        setComments({ ...comments, [feature._id]: e.target.value })
                                    }
                                />
                                <button
                                    className="bg-purple-500 text-white px-3 py-1 rounded mt-2"
                                    onClick={() => addComment(feature._id)}
                                >
                                    Add Comment
                                </button>

                                {/* Team Chat Section */}
                                <div className="mt-4 border-t pt-3">
                                    <h4 className="font-semibold">Team Chat</h4>
                                    <button
                                        className="text-blue-500 text-sm underline mb-1"
                                        onClick={() => joinChatRoom(feature._id)}
                                    >
                                        Join Chat
                                    </button>

                                    <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto text-sm">
                                        {(chatMessages[feature._id] || []).map((msg, idx) => (
                                            <div key={idx} className="mb-1 break-words">
                                                <span className="font-bold">{msg.user}:</span> {msg.text}
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        className="border p-2 w-full mt-2 rounded"
                                        placeholder="Send a message..."
                                        value={chatInput[feature._id] || ""}
                                        onChange={(e) =>
                                            setChatInput({ ...chatInput, [feature._id]: e.target.value })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") sendMessage(feature._id);
                                        }}
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                                        onClick={() => sendMessage(feature._id)}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <div className="sm:ml-4">
                                <button className="text-red-500" onClick={() => deleteFeature(feature._id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CollabComponent;
