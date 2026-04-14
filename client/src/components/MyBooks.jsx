import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const BookList = ({ books, onAction }) => {
    const { user } = useUser();
    const [selectedDates, setSelectedDates] = useState({});

    const handleDateChange = (bookId, date) => {
        setSelectedDates({ ...selectedDates, [bookId]: date });
    };

    const handleBorrow = async (bookId) => {
        const dueDate = selectedDates[bookId];

        if (!dueDate) {
            alert("⚠️ STOP! You must select a 'Return Date' from the calendar before borrowing.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/borrow/borrow', {
                clerkId: user.id,
                bookId: bookId,
                dueDate: dueDate 
            });
            alert("✅ SUCCESS: Book borrowed with your chosen date!");
            if (onAction) onAction();
        } catch (err) {
            alert(err.response?.data?.message || "Error borrowing book");
        }
    };

    if (books.length === 0) return <p className="text-gray-500 italic">No books found in library.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {books.map((book) => (
                <div key={book._id} className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-black text-xl capitalize text-gray-800 leading-tight">{book.title}</h3>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${book.availableCopies > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {book.availableCopies} Left
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs font-medium mb-6 italic">by {book.author}</p>

                        {/* 📅 THIS IS THE CALENDAR SECTION - LOOK FOR THE BLUE BOX */}
                        {book.availableCopies > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                                <label className="text-[10px] font-black text-blue-700 uppercase block mb-2 tracking-widest text-center">
                                    📅 Set Return Date
                                </label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full bg-white border-2 border-blue-100 p-2 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors"
                                    onChange={(e) => handleDateChange(book._id, e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => handleBorrow(book._id)}
                        disabled={book.availableCopies <= 0}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                            book.availableCopies > 0 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {book.availableCopies > 0 ? 'Confirm Borrow' : 'Out of Stock'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookList;