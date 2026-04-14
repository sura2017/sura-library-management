import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = ({ onUserUpdate }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/all');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // 🆕 New function to handle the dropdown selection
    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put('http://localhost:5000/api/users/update-role', { userId, newRole });
            fetchUsers(); // Refresh the table
            if (onUserUpdate) onUserUpdate(); // Refresh the dashboard state
            alert(`✅ User is now a ${newRole.toUpperCase()}`);
        } catch (err) {
            alert("❌ Error updating role");
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-800">User Management Panel</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b text-gray-400 uppercase tracking-wider">
                            <th className="pb-3 text-[10px]">Name</th>
                            <th className="pb-3 text-[10px]">Current Role</th>
                            <th className="pb-3 text-[10px] text-right">Assign Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50 transition">
                                <td className="py-4 font-semibold text-gray-700">{u.name || u.email}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-md font-bold uppercase text-[9px] 
                                        ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                          u.role === 'librarian' ? 'bg-purple-100 text-purple-600' : 
                                          'bg-green-100 text-green-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    {/* 🆕 Dropdown to change to ANY role */}
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-bold py-1 px-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">Student</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;