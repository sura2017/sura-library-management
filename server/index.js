const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
require('dotenv').config();

// Import Models for Analytics
const Book = require('./models/Book');
const User = require('./models/User');
const BorrowRecord = require('./models/BorrowRecord');

// Import Controller for Automation
const { notifyOverdue } = require('./controllers/borrowController');

const app = express();

// 1. DATABASE CONNECTION
connectDB();

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🤖 THE AUTOMATION ENGINE (Cron Job)
// This runs every day at Midnight to find late students and email them.
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Starting Automated Overdue Scan...');
    try {
        await notifyOverdue(); 
        console.log('✅ Automated emails sent to late students.');
    } catch (err) {
        console.error('❌ Automation Error:', err);
    }
});

// 3. HEALTH CHECK
app.get('/', (req, res) => {
    res.send('🚀 Sura Library API is Online and Autonomous!');
});

// 4. API ROUTES
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));

// 5. 📊 ANALYTICS ENDPOINT (Now respects Fine Payments)
app.get('/api/stats', async (req, res) => {
    try {
        const [totalBooks, activeLoans, totalUsers, allBorrowed] = await Promise.all([
            Book.countDocuments(),
            BorrowRecord.countDocuments({ status: 'borrowed' }),
            User.countDocuments(),
            BorrowRecord.find({ status: 'borrowed' })
        ]);
        
        let totalFines = 0;
        const today = new Date();
        
        allBorrowed.forEach(rec => {
            const dueDate = new Date(rec.dueDate);
            
            // 💰 UPDATED LOGIC: Only count fines if NOT ALREADY PAID
            if (today > dueDate && !rec.isFinePaid) {
                const diffTime = Math.abs(today - dueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                totalFines += (diffDays * 5); // $5 per day
            }
        });

        res.json({ totalBooks, activeLoans, totalUsers, totalFines });
    } catch (err) {
        console.error("Stats Fetch Error:", err);
        res.status(500).json({ message: "Error" });
    }
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ System Active on Port ${PORT}`);
    console.log(`🤖 Auto-Email Scheduler: Active`);
});