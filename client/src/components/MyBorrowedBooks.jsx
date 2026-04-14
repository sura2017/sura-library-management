import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const MyBorrowedBooks = ({ refresh, onReturn }) => {
    const { user } = useUser();
    const [myBooks, setMyBooks] = useState([]);

    const fetchMyBooks = async () => {
        if (!user) return;
        const res = await axios.get(`http://localhost:5000/api/borrow/user/${user.id}`);
        setMyBooks(res.data);
    };

    useEffect(() => { fetchMyBooks(); }, [user, refresh]);

    const handleReturn = async (recordId) => {
        await axios.put(`http://localhost:5000/api/borrow/return/${recordId}`);
        alert("✅ Book Returned!");
        fetchMyBooks();
        if (onReturn) onReturn();
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 italic">My Active Loans</h2>
            {myBooks.length === 0 ? <p className="text-gray-400 text-sm italic">No active borrows.</p> : (
                <div className="space-y-4">
                    {myBooks.map((record) => (
                        <div key={record._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{record.bookId?.title}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Due: {new Date(record.dueDate).toLocaleDateString()}</p>
                                </div>
                                {/* 🆕 Fine Badge */}
                                {record.fine > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse">
                                        FINE: ${record.fine}
                                    </span>
                                )}
                            </div>
                            <button onClick={() => handleReturn(record._id)} className="w-full mt-3 bg-white border border-red-200 text-red-500 text-xs font-bold py-2 rounded-xl hover:bg-red-50 transition">
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