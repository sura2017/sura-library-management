const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. SYNC: Save Clerk user to MongoDB on first login
router.post('/sync', async (req, res) => {
    const { clerkId, email, name } = req.body;
    try {
        let user = await User.findOne({ clerkId });
        
        if (!user) {
            // Create user if they don't exist
            user = new User({ clerkId, email, name, role: 'user' });
            await user.save();
        } else {
            // Optional: Update name/email if they changed in Clerk
            user.name = name;
            user.email = email;
            await user.save();
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET PROFILE: Fetch user details (including ROLE) for the Frontend
// This is what we use in Dashboard.jsx to decide if we show the "Add Book" form
router.get('/profile/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching profile" });
    }
});

// 3. GET ALL USERS: (Optional - for the Admin Panel later)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Change a user's role (Admin only)
router.put('/update-role', async (req, res) => {
    const { userId, newRole } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating role" });
    }
});
module.exports = router;