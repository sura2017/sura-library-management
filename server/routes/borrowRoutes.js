const express = require('express');
const router = express.Router();
const { 
    borrowBook, 
    getUserBorrowed, 
    returnBook, 
    getAllHistory, 
    notifyOverdue,
    updateDueDate,
    settleFine,
    deleteHistoryRecord // 🆕 Matches the updated controller name
} = require('../controllers/borrowController');

// 1. TRANSACTIONAL ROUTES (Students & Staff)
router.post('/borrow', borrowBook);
router.put('/return/:id', returnBook);
router.get('/user/:clerkId', getUserBorrowed);

// 2. ADMINISTRATIVE & HISTORY ROUTES (Librarian/Admin Only)
router.get('/history', getAllHistory);
router.put('/update-deadline', updateDueDate);
router.put('/settle-fine/:id', settleFine); 

// 3. SYSTEM MAINTENANCE & AUTOMATION (Admin Only)
router.post('/notify-overdue', notifyOverdue);
router.delete('/:id', deleteHistoryRecord); // 🆕 Matches the controller function

module.exports = router;