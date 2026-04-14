const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// 1. BORROW A BOOK (Physical & Digital logic)
exports.borrowBook = async (req, res) => {
    const { clerkId, bookId, dueDate } = req.body; 

    try {
        const user = await User.findOne({ clerkId });
        const book = await Book.findById(bookId);

        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ message: "Out of Stock!" });
        }
        
        // Smart Date Logic: Use Librarian's choice or default to 7 days
        let finalDueDate = dueDate ? new Date(dueDate) : new Date();
        if (!dueDate) finalDueDate.setDate(finalDueDate.getDate() + 7);

        const record = new BorrowRecord({
            userId: user._id,
            bookId: book._id,
            dueDate: finalDueDate,
            borrowDate: new Date()
        });

        await record.save();

        // Reduce inventory by 1
        book.availableCopies -= 1;
        await book.save();

        // 📧 EMAIL: Borrowing Confirmation
        const friendlyDate = finalDueDate.toLocaleDateString();
        sendEmail(
            user.email, 
            `📚 Borrowed: ${book.title}`, 
            `Hello ${user.name},\n\nYou have successfully borrowed "${book.title}".\nDue Date: ${friendlyDate}\n\nPlease return it on time to avoid fines. Thank you for using Sura Library!`
        );

        res.status(201).json({ message: "Borrowed successfully", record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. GET USER'S ACTIVE LOANS (Calculates Fines only if unpaid)
exports.getUserBorrowed = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const records = await BorrowRecord.find({ userId: user._id, status: 'borrowed' }).populate('bookId');
        
        const recordsWithFines = records.map(record => {
            const today = new Date();
            const dueDate = new Date(record.dueDate);
            let fine = 0;

            // 💰 FINE LOGIC: Only calculate if late AND fine hasn't been paid
            if (today > dueDate && !record.isFinePaid) {
                const diffTime = Math.abs(today - dueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                fine = diffDays * 5; 
            }
            return { ...record._doc, fine };
        });

        res.status(200).json(recordsWithFines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. RETURN A BOOK (Restores inventory + Confirmation Email)
exports.returnBook = async (req, res) => {
    try {
        const record = await BorrowRecord.findById(req.params.id).populate('userId bookId');
        if (!record) return res.status(404).json({ message: "Record not found" });

        record.status = 'returned';
        record.returnDate = new Date();
        await record.save();

        const book = await Book.findById(record.bookId._id);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        // 📧 EMAIL: Return Confirmation
        sendEmail(
            record.userId.email, 
            `✅ Return Confirmed: ${record.bookId.title}`, 
            `Hello ${record.userId.name},\n\nWe have received your return of "${record.bookId.title}".\n\nThank you for using Sura Library!`
        );

        res.status(200).json({ message: "Book returned successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error returning book" });
    }
};

// 4. NOTIFY OVERDUE USERS (Safe Automated Scanner)
exports.notifyOverdue = async (req, res) => {
    try {
        const today = new Date();
        const overdueRecords = await BorrowRecord.find({ 
            status: 'borrowed', 
            dueDate: { $lt: today },
            isFinePaid: false 
        }).populate('userId bookId');

        overdueRecords.forEach(record => {
            // 🛡️ Safety check for deleted data
            if (record.userId && record.bookId) {
                sendEmail(
                    record.userId.email, 
                    `🚨 OVERDUE ALERT: ${record.bookId.title}`, 
                    `Hello ${record.userId.name},\n\nURGENT: The book "${record.bookId.title}" is past its due date. Please return it immediately.`
                );
            }
        });

        if (res) res.status(200).json({ message: `Success: Scanned and notified late students.` });
    } catch (err) {
        if (res) res.status(500).json({ message: "Error" });
    }
};

// 5. UPDATE DUE DATE (Librarian Tool)
exports.updateDueDate = async (req, res) => {
    const { recordId, newDueDate } = req.body;
    try {
        const record = await BorrowRecord.findByIdAndUpdate(
            recordId, 
            { dueDate: new Date(newDueDate) },
            { returnDocument: 'after' }
        );
        res.status(200).json({ message: "Deadline updated!", record });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// 6. MASTER HISTORY LOG (Admin Audit Trail)
exports.getAllHistory = async (req, res) => {
    try {
        const history = await BorrowRecord.find()
            .populate('userId', 'name email')
            .populate('bookId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// 7. SETTLE FINE (Mark as Paid)
exports.settleFine = async (req, res) => {
    try {
        await BorrowRecord.findByIdAndUpdate(req.params.id, { isFinePaid: true });
        res.status(200).json({ message: "Fine paid!" });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};
// Handles return logic
// 8. DELETE RECORD (🆕 Admin Trash Cleanup)
exports.deleteHistoryRecord = async (req, res) => {
    try {
        await BorrowRecord.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Record deleted from audit trail." });
    } catch (err) {
        res.status(500).json({ message: "Error deleting history record" });
    }
};