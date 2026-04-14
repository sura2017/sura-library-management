const express = require('express');
const router = express.Router();

// 🆕 Ensure "deleteBook" is added to this list inside the { }
const { addBook, getBooks, deleteBook } = require('../controllers/bookController');

router.get('/all', getBooks);
router.post('/add', addBook);

// 🆕 This is the line that was causing the crash:
router.delete('/:id', deleteBook); 

module.exports = router;