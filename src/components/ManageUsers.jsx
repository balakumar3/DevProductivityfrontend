import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/users';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        status: '',
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        avgCompletionTime: 0,
        teamName: '',
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
            status: user.status,
            completedTasks: user.completedTasks || 0,
            pendingTasks: user.pendingTasks || 0,
            overdueTasks: user.overdueTasks || 0,
            avgCompletionTime: user.avgCompletionTime || 0,
            teamName: user.teamName || "",
        });
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditData({
            firstName: '',
            lastName: '',
            role: '',
            status: '',
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
            avgCompletionTime: 0,
            teamName: ''
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: name === 'avgCompletionTime' ? parseFloat(value) : parseInt(value) || value
        }));
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
        <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm sm:text-base bg-white rounded-lg shadow">
                    <thead>
                        <tr className="bg-blue-100 text-blue-900">
                            {[
                                'ID', 'First Name', 'Last Name', 'Email', 'Role', 'Status',
                                'Completed', 'Pending', 'Overdue', 'Team Name', 'Avg Time (hrs)', 'Actions'
                            ].map((header) => (
                                <th key={header} className="py-2 px-2 sm:px-4 whitespace-nowrap text-left">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                                <td className="py-2 px-2 sm:px-4">{user._id}</td>
                                {editingUserId === user._id ? (
                                    <>
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="text" name="firstName" value={editData.firstName}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="text" name="lastName" value={editData.lastName}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        <td className="py-2 px-2 sm:px-4">{user.emailId}</td>
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="text" name="role" value={editData.role}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="text" name="status" value={editData.status}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        {['completedTasks', 'pendingTasks', 'overdueTasks'].map(field => (
                                            <td key={field} className="py-2 px-2 sm:px-4">
                                                <input type="number" name={field} value={editData[field]}
                                                    onChange={handleEditChange}
                                                    className="w-full px-2 py-1 border rounded text-sm" />
                                            </td>
                                        ))}
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="text" name="teamName" value={editData.teamName}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        <td className="py-2 px-2 sm:px-4">
                                            <input type="number" step="0.1" name="avgCompletionTime"
                                                value={editData.avgCompletionTime}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded text-sm" />
                                        </td>
                                        <td className="py-2 px-2 sm:px-4 space-x-1">
                                            <button onClick={() => handleEditSubmit(user._id)}
                                                className="px-2 sm:px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm rounded">Save</button>
                                            <button onClick={cancelEdit}
                                                className="px-2 sm:px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs sm:text-sm rounded">Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-2 sm:px-4">{user.firstName}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.lastName}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.emailId}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.role}</td>
                                        <td className="py-2 px-2 sm:px-4 capitalize">
                                            <span className="px-2 py-1 text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 rounded">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2 sm:px-4">{user.completedTasks}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.pendingTasks}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.overdueTasks}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.teamName}</td>
                                        <td className="py-2 px-2 sm:px-4">{user.avgCompletionTime}</td>
                                        <td className="py-2 px-2 sm:px-4 space-x-1">
                                            <button onClick={() => startEditing(user)}
                                                className="px-2 sm:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded">Edit</button>
                                            <button onClick={() => handleDelete(user._id)}
                                                className="px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded">Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="12" className="text-center py-6 text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
