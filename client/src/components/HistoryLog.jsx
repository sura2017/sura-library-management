import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 🛡️ ALL icons imported to prevent crashes
import { 
    CalendarClock, Save, Edit3, XCircle, Clock, 
    CalendarDays, Trash2, DollarSign, CheckCircle2, AlertCircle 
} from "lucide-react"; 

const HistoryLog = ({ refresh, userRole }) => {
    const [history, setHistory] = useState([]);
    const [editingId, setEditingId] = useState(null); 
    const [tempDate, setTempDate] = useState(""); 

    // 🚀 CRITICAL: This is how the component knows you are the boss
    const isAdmin = userRole === 'admin';

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/borrow/history');
            setHistory(res.data);
        } catch (err) {
            console.error("History fetch error");
        }
    };

    useEffect(() => { fetchHistory(); }, [refresh]);

    // 1. Update Deadline logic
    const handleUpdateDeadline = async (recordId) => {
        if (!tempDate) return setEditingId(null);
        try {
            await axios.put('http://localhost:5000/api/borrow/update-deadline', {
                recordId, newDueDate: tempDate
            });
            alert("📅 Deadline Adjusted Successfully.");
            setEditingId(null);
            fetchHistory(); 
        } catch (err) { alert("Error updating deadline."); }
    };

    // 2. Settle Fine logic (Mark as Paid)
    const handleSettleFine = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/borrow/settle-fine/${id}`);
            alert("💰 Balance Cleared: Fine marked as paid.");
            fetchHistory();
        } catch (err) { alert("Error settling fine."); }
    };

    // 3. Delete Record logic (Admin Cleanup)
    const handleDeleteRecord = async (id) => {
        if (window.confirm("⚠️ ADMIN: Permanently remove this transaction from the audit trail?")) {
            try {
                // This calls router.delete('/:id', deleteHistoryRecord) in your backend
                await axios.delete(`http://localhost:5000/api/borrow/${id}`);
                fetchHistory();
                alert("🗑️ Record deleted.");
            } catch (err) { alert("Error deleting record."); }
        }
    };

    return (
        <div className="bg-white p-8 rounded-[3.5rem] shadow-xl border border-gray-100 overflow-hidden mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 italic uppercase tracking-tighter">
                    <div className="bg-rose-500 w-2 h-8 rounded-full"></div>
                    Master Transaction Audit
                </h2>
                <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Security Log Active</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-slate-400 uppercase tracking-[0.15em] font-black">
                            <th className="pb-5 pl-4">Member</th>
                            <th className="pb-5">Book Identification</th>
                            <th className="pb-5">Official Deadline</th>
                            <th className="pb-5">Financial/Status</th>
                            <th className="pb-5 text-right pr-4">Admin Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {history.map((h) => {
                            // Logic to determine if a book is overdue
                            const isLate = new Date() > new Date(h.dueDate) && h.status === 'borrowed' && !h.isFinePaid;

                            return (
                                <tr key={h._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="py-6 pl-4">
                                        <p className="font-bold text-slate-700">{h.userId?.name || 'Unknown User'}</p>
                                        <p className="text-[9px] text-slate-400 font-medium">{h.userId?.email}</p>
                                    </td>
                                    <td className="py-6">
                                        <p className="font-black text-slate-800 uppercase italic tracking-tighter leading-none">{h.bookId?.title || 'Deleted Book'}</p>
                                        <p className="text-[9px] text-blue-500 font-bold mt-1.5 uppercase tracking-widest">
                                            Borrowed: {new Date(h.borrowDate).toLocaleDateString()}
                                        </p>
                                    </td>
                                    
                                    {/* DEADLINE COLUMN with Visible Edit Button */}
                                    <td className="py-6">
                                        {h.status === 'borrowed' ? (
                                            editingId === h._id ? (
                                                <div className="flex items-center gap-1.5 bg-blue-50 p-1.5 rounded-xl border-2 border-blue-400 shadow-sm">
                                                    <input 
                                                        type="date" 
                                                        autoFocus 
                                                        className="bg-transparent border-none text-[10px] font-bold text-blue-700 outline-none p-1" 
                                                        onChange={(e) => setTempDate(e.target.value)} 
                                                    />
                                                    <div className="flex gap-1 pl-1 border-l border-blue-200">
                                                        <button onClick={() => handleUpdateDeadline(h._id)} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
                                                            <Save size={14} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-white text-rose-500 border border-rose-100 rounded-lg">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => { setEditingId(h._id); setTempDate(h.dueDate); }} 
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-100 hover:border-blue-500 hover:shadow-lg transition-all text-slate-600 w-fit group/date"
                                                >
                                                    <span className="font-mono font-black text-xs">{new Date(h.dueDate).toLocaleDateString()}</span>
                                                    <Edit3 size={12} className="text-blue-400" />
                                                </button>
                                            )
                                        ) : (
                                            <div className="px-4 py-2 text-slate-300 italic line-through decoration-slate-200">
                                                <span className="font-mono">{new Date(h.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* STATUS & OVERDUE INDICATORS */}
                                    <td className="py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border
                                                ${h.status === 'returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                {h.status}
                                            </div>
                                            {isLate && (
                                                <span className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-1 animate-pulse">
                                                    <AlertCircle size={10}/> Overdue Balance
                                                </span>
                                            )}
                                            {h.isFinePaid && (
                                                <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                                    <CheckCircle2 size={10}/> Fine Settled
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    {/* 🗑️ ADMIN ACTION COLUMN: This was the problem area */}
                                    <td className="py-6 text-right pr-4">
                                        <div className="flex justify-end gap-3 items-center">
                                            {/* Settle Fine Button: Show if late and NOT paid */}
                                            {isLate && (
                                                <button 
                                                    onClick={() => handleSettleFine(h._id)} 
                                                    className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 active:scale-90" 
                                                    title="Mark Fine as Paid"
                                                >
                                                    <DollarSign size={18} strokeWidth={2.5} />
                                                </button>
                                            )}
                                            
                                            {/* 🗑️ Trash Button: ALWAYS show if user is ADMIN */}
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDeleteRecord(h._id)} 
                                                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 border border-rose-100 shadow-sm" 
                                                    title="Permanently Delete Log"
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </button>
                                            )}

                                            {/* Show return date if book is back */}
                                            {h.status === 'returned' && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged Return</span>
                                                    <span className="text-xs font-mono font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                                                        {new Date(h.returnDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryLog;