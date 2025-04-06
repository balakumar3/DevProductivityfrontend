import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/users'; // Adjust if needed

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        status: ''
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get(API_URL);
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const startEditing = (user) => {
        setEditingUserId(user._id);
        setEditData({
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status
        });
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditData({
            firstName: '',
            lastName: '',
            role: '',
            status: ''
        });
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (id) => {
        try {
            await axios.put(`${API_URL}/${id}`, editData);
            fetchUsers();
            cancelEdit();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="bg-blue-100 text-blue-900">
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">First Name</th>
                            <th className="py-3 px-4 text-left">Last Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                                <td className="py-3 px-4">{user._id}</td>

                                {editingUserId === user._id ? (
                                    <>
                                        <td className="py-3 px-4">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editData.firstName}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editData.lastName}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-3 px-4">{user.emailId}</td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="text"
                                                name="role"
                                                value={editData.role}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="text"
                                                name="status"
                                                value={editData.status}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-3 px-4 space-x-2">
                                            <button
                                                onClick={() => handleEditSubmit(user._id)}
                                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-3 px-4">{user.firstName}</td>
                                        <td className="py-3 px-4">{user.lastName}</td>
                                        <td className="py-3 px-4">{user.emailId}</td>
                                        <td className="py-3 px-4">{user.role}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 text-sm rounded-full font-semibold bg-gray-100 text-gray-800 capitalize">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 space-x-2">
                                            <button
                                                onClick={() => startEditing(user)}
                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
