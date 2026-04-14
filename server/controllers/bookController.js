const Book = require('../models/Book');

// 1. GET ALL BOOKS
exports.getBooks = async (req, res) => {
    try {
        // Fetch all books and sort by newest first
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching library inventory" });
    }
};

// 2. ADD A NEW BOOK (Handles Multiple Copies + Digital Software Link)
exports.addBook = async (req, res) => {
    try {
        // 🆕 Destructure 'bookUrl' from the request body
        const { title, author, isbn, category, quantity, bookUrl } = req.body;

        const totalQuantity = Number(quantity) || 1;

        const newBook = new Book({
            title,
            author,
            isbn,
            category,
            quantity: totalQuantity, 
            availableCopies: totalQuantity,
            // 🆕 SAVE THE SOFTWARE COPY LINK HERE
            bookUrl: bookUrl || "" 
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        // Handle duplicate ISBN error
        if (error.code === 11000) {
            return res.status(400).json({ message: "A book with this ISBN already exists in the system." });
        }
        res.status(400).json({ message: error.message });
    }
};

// 3. DELETE A BOOK (Admin Only)
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: "Book removed from system successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book" });
    }
};