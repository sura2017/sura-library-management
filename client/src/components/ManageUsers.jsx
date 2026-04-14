import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = ({ onUserUpdate }) => {
    const [users, setUsers] = useState([]);

    // 🚀 PRODUCTION URL CONFIGURATION
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchUsers = async () => {
        try {
            // Updated to use dynamic API_URL
            const res = await axios.get(`${API_URL}/api/users/all`);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching user database");
        }
    };

    useEffect(() => { 
        fetchUsers(); 
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Updated to use dynamic API_URL
            await axios.put(`${API_URL}/api/users/update-role`, { userId, newRole });
            
            fetchUsers(); // Refresh the table
            
            if (onUserUpdate) onUserUpdate(); // Refresh the main dashboard state
            
            alert(`✅ PERMISSION GRANTED: User is now a ${newRole.toUpperCase()}`);
        } catch (err) {
            alert("❌ Error updating system permissions");
        }
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 mt-10">
            <h2 className="text-xl font-black mb-6 text-slate-800 italic uppercase tracking-tighter">
                Identity & Access Control
            </h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 text-slate-400 uppercase tracking-widest font-black">
                            <th className="pb-4 pl-2 text-[10px]">Member Name</th>
                            <th className="pb-4 text-[10px]">Active Role</th>
                            <th className="pb-4 text-right pr-2 text-[10px]">Modify Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-slate-50 transition-colors group">
                                <td className="py-5 pl-2">
                                    <p className="font-bold text-slate-700">{u.name || 'Anonymous'}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                                </td>
                                <td className="py-5">
                                    <span className={`px-2.5 py-1 rounded-lg font-black uppercase text-[9px] tracking-tighter border shadow-sm
                                        ${u.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                          u.role === 'librarian' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                          'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-5 text-right pr-2">
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-white transition-all shadow-inner"
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