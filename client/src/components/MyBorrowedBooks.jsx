import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const MyBorrowedBooks = ({ refresh, onReturn }) => {
    const { user } = useUser();
    const [myBooks, setMyBooks] = useState([]);

    // 🚀 PRODUCTION URL CONFIGURATION
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchMyBooks = async () => {
        if (!user) return;
        try {
            // Updated to use dynamic API_URL
            const res = await axios.get(`${API_URL}/api/borrow/user/${user.id}`);
            setMyBooks(res.data);
        } catch (err) {
            console.error("Error fetching user loans");
        }
    };

    useEffect(() => { 
        fetchMyBooks(); 
    }, [user, refresh]);

    const handleReturn = async (recordId) => {
        try {
            // Updated to use dynamic API_URL
            await axios.put(`${API_URL}/api/borrow/return/${recordId}`);
            alert("✅ SUCCESS: Book returned to the library!");
            fetchMyBooks();
            if (onReturn) onReturn();
        } catch (err) {
            alert("Error returning book.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-black mb-6 text-gray-800 italic uppercase tracking-tight leading-none">
                My Active Loans
            </h2>
            
            {myBooks.length === 0 ? (
                <div className="py-4 text-center">
                    <p className="text-gray-400 text-sm italic">You have no active borrows.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myBooks.map((record) => (
                        <div key={record._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{record.bookId?.title}</p>
                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">
                                        Due: {new Date(record.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                {/* Fine Badge */}
                                {record.fine > 0 && (
                                    <span className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg animate-pulse shadow-lg shadow-red-200">
                                        FINE: ${record.fine}
                                    </span>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => handleReturn(record._id)} 
                                className="w-full mt-4 bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] py-2.5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm"
                            >
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBorrowedBooks;