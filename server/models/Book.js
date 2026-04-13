const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    availableCopies: { type: Number, required: true, default: 1 },
    coverImage: { type: String, default: "https://via.placeholder.com/150" },
    // 🆕 The field for the Software Copy / PDF URL
    bookUrl: { type: String, default: "" } 
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);