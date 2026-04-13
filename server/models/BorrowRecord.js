const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    // Link to the User who borrowed the book
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Link to the specific Book
    bookId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    // The date the book was checked out
    borrowDate: { 
        type: Date, 
        default: Date.now 
    },
    // The deadline for return (set by Librarian or default 7 days)
    dueDate: { 
        type: Date, 
        required: true 
    },
    // The date the book was actually returned
    returnDate: { 
        type: Date 
    },
    // Status tracking
    status: { 
        type: String, 
        enum: ['borrowed', 'returned'], 
        default: 'borrowed' 
    },
    // 🆕 FINANCIAL TRACKING
    // If true, the system will stop calculating overdue fines for this record.
    isFinePaid: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowSchema);