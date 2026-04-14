import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { 
    Trash2, User, Hash, Tag, Calendar, 
    BookOpen, AlertCircle, Zap, ExternalLink 
} from "lucide-react";

const BookList = ({ books, onAction, userRole }) => {
    const { user } = useUser();
    const [selectedDates, setSelectedDates] = useState({});

    // Roles and Permissions
    const isAdmin = userRole === 'admin';
    const isLibrarian = userRole === 'librarian';
    const isStaff = isAdmin || isLibrarian;

    // --- BORROW LOGIC ---
    const handleBorrow = async (bookId) => {
        const librarianDate = selectedDates[bookId];
        
        if (isStaff && !librarianDate) {
            alert("⚠️ Staff Action Required: Please select a return date from the calendar first.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/borrow/borrow', {
                clerkId: user.id,
                bookId: bookId,
                dueDate: isStaff ? librarianDate : null 
            });
            alert("✅ SUCCESS: Borrowing confirmed and logged.");
            if (onAction) onAction();
        } catch (err) {
            alert(err.response?.data?.message || "Borrowing failed.");
        }
    };

    // --- DELETE LOGIC ---
    const handleDelete = async (bookId, title) => {
        if (window.confirm(`⚠️ ADMIN: Permanently remove "${title}" from the library inventory?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/books/${bookId}`);
                alert("🗑️ Book deleted.");
                if (onAction) onAction();
            } catch (err) {
                alert("Error deleting book.");
            }
        }
    };

    if (books.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <AlertCircle className="text-slate-300 mb-2" size={40} />
            <p className="text-slate-400 font-medium italic">No books available in the catalog.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {books.map((book) => (
                <div key={book._id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-2 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full">
                    
                    {/* --- TOP ROW: STATUS & ADMIN DELETE --- */}
                    <div className="flex justify-between items-center px-6 pt-6 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            book.availableCopies > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                        </span>

                        {/* Admin Delete Icon - Highly Visible Rose Red */}
                        {isAdmin && (
                            <button 
                                onClick={() => handleDelete(book._id, book.title)} 
                                className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md"
                                title="Delete from Inventory"
                            >
                                <Trash2 size={20} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    {/* --- MIDDLE: BOOK DETAILS --- */}
                    <div className="px-6 pb-4 flex-1">
                        <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                            {book.title}
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400">
                                <User size={14}/><span className="text-xs font-bold uppercase tracking-wide italic">{book.author}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Hash size={14}/><span className="text-[10px] font-mono font-black tracking-widest uppercase">{book.isbn}</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-600">
                                <Tag size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{book.category}</span>
                            </div>
                        </div>

                        {/* STAFF CALENDAR PICKER */}
                        {isStaff && book.availableCopies > 0 && (
                            <div className="mt-6 p-4 bg-purple-50/50 rounded-3xl border-2 border-dashed border-purple-100">
                                <div className="flex items-center gap-2 mb-2 text-purple-500">
                                    <Calendar size={12} strokeWidth={3}/><span className="text-[9px] font-black uppercase tracking-[0.2em]">Set Official Return</span>
                                </div>
                                <input 
                                    type="date" 
                                    className="w-full bg-white border-none rounded-xl p-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-purple-500 shadow-inner" 
                                    onChange={(e) => setSelectedDates({...selectedDates, [book._id]: e.target.value})} 
                                />
                            </div>
                        )}
                    </div>

                    {/* --- BOTTOM: ACTION AREA --- */}
                    <div className="p-4 pt-0 space-y-3">
                        {/* 1. PHYSICAL BORROW BUTTON */}
                        <button 
                            onClick={() => handleBorrow(book._id)}
                            disabled={book.availableCopies <= 0}
                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
                                book.availableCopies > 0 
                                ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/40' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {book.availableCopies > 0 ? <><BookOpen size={16} /> Borrow Access</> : "Out of Stock"}
                        </button>

                        {/* 2. DIGITAL SOFTWARE BUTTON (The fix for your missing link) */}
                        {book.bookUrl && (
                            <a 
                                href={book.bookUrl.startsWith('http') ? book.bookUrl : `https://${book.bookUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-blue-400 bg-blue-50/30 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Zap size={14} fill="currentColor" />
                                Read Software Copy
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookList;