import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, BookOpen, Layers, Link as LinkIcon, Hash, User } from "lucide-react";

const AddBook = ({ onBookAdded }) => {
    // 🚀 PRODUCTION URL CONFIGURATION
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [formData, setFormData] = useState({ 
        title: '', 
        author: '', 
        isbn: '', 
        category: '', 
        quantity: 1,
        bookUrl: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Updated to use dynamic API_URL
            await axios.post(`${API_URL}/api/books/add`, {
                ...formData,
                availableCopies: formData.quantity 
            });
            
            // Reset form
            setFormData({ title: '', author: '', isbn: '', category: '', quantity: 1, bookUrl: '' });

            if (typeof onBookAdded === 'function') {
                onBookAdded();
            }

            alert("✅ SUCCESS: Book registered in system inventory!");

        } catch (err) {
            console.error("Submission Error:", err);
            alert("❌ Error: Could not save book data.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Title Input */}
                <div className="relative group">
                    <input 
                        className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="Official Book Title" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        required 
                    />
                    <BookOpen className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>

                {/* 2. Author & ISBN Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <input 
                            className="w-full bg-slate-50 border-none p-4 pl-10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            placeholder="Author" 
                            value={formData.author} 
                            onChange={(e) => setFormData({...formData, author: e.target.value})} 
                            required 
                        />
                        <User className="absolute left-3.5 top-4 text-slate-300" size={16} />
                    </div>
                    <div className="relative">
                        <input 
                            className="w-full bg-slate-50 border-none p-4 pl-10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            placeholder="ISBN Code" 
                            value={formData.isbn} 
                            onChange={(e) => setFormData({...formData, isbn: e.target.value})} 
                            required 
                        />
                        <Hash className="absolute left-3.5 top-4 text-slate-300" size={16} />
                    </div>
                </div>

                {/* 3. Category & Quantity Row */}
                <div className="grid grid-cols-2 gap-4">
                    <select 
                        className="bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-500 cursor-pointer"
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                    >
                        <option value="">Select Genre</option>
                        <option value="Science">Science</option>
                        <option value="Maths">Maths</option>
                        <option value="History">History</option>
                        <option value="Literature">Literature</option>
                        <option value="Technology">Technology</option>
                    </select>

                    <div className="relative">
                        <input 
                            type="number"
                            min="1"
                            className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            placeholder="Copies" 
                            value={formData.quantity} 
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                            required 
                        />
                        <Layers className="absolute left-4 top-4 text-slate-300" size={18} />
                    </div>
                </div>

                {/* 4. DIGITAL SOFTWARE COPY */}
                <div className="relative group pt-2">
                    <div className="absolute -top-1 left-4 bg-white px-2 text-[9px] font-black text-blue-600 uppercase tracking-widest z-10">
                        Optional: Software Copy
                    </div>
                    <input 
                        className="w-full bg-blue-50/50 border-2 border-dashed border-blue-100 p-4 pl-12 rounded-2xl text-xs font-bold text-blue-600 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                        placeholder="Paste PDF or E-Book Link (URL) here..." 
                        value={formData.bookUrl} 
                        onChange={(e) => setFormData({...formData, bookUrl: e.target.value})} 
                    />
                    <LinkIcon className="absolute left-4 top-5 text-blue-300" size={18} />
                </div>

                {/* 5. Submit Button */}
                <button type="submit" className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] py-5 rounded-[1.5rem] shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
                    <PlusCircle size={20} strokeWidth={2.5} />
                    Register Book
                </button>
            </form>
        </div>
    );
};

export default AddBook;