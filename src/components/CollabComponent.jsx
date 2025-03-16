import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";

const CollabComponent = () => {
    const [features, setFeatures] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState({});
    const [user] = useState(Cookies.get("user") || "Anonymous");

    useEffect(() => {
        axios.get("http://localhost:4000/features").then((res) => setFeatures(res.data));
    }, []);

    const addFeature = () => {
        if (!title.trim() || !description.trim()) return;
        axios.post("http://localhost:4000/features", { title, description }).then((res) => {
            setFeatures([...features, res.data]);
            setTitle("");
            setDescription("");
        });
    };

    const upvoteFeature = (id) => {
        axios.post(`http://localhost:4000/features/${id}/vote`).then((res) => {
            setFeatures(features.map((f) => (f._id === id ? res.data : f)));
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
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feature Requests</h1>
            <div className="mb-4">
                <input className="border p-2 w-full mb-2" placeholder="Feature title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="border p-2 w-full mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addFeature}>Submit Feature</button>
            </div>
            <ul>
                {features.map((feature) => (
                    <li key={feature._id} className="border p-4 mb-4 rounded flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                            <p className="font-bold">Votes: {feature.votes}</p>
                            <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => upvoteFeature(feature._id)}>Upvote</button>
                            <ul className="mt-3">
                                {feature.comments.map((c, index) => (
                                    <li key={index} className="text-sm text-gray-700">{c.user}: {c.text}</li>
                                ))}
                            </ul>
                            <input
                                className="border p-2 w-full mt-2"
                                placeholder="Comment"
                                value={comments[feature._id] || ""}
                                onChange={(e) => setComments({ ...comments, [feature._id]: e.target.value })}
                            />
                            <button className="bg-purple-500 text-white px-3 py-1 rounded mt-2" onClick={() => addComment(feature._id)}>Add Comment</button>
                        </div>
                        <button className="text-red-500" onClick={() => deleteFeature(feature._id)}>
                            <Trash2 size={20} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CollabComponent;
