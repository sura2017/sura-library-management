const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // The unique ID from Clerk (starts with user_...)
    clerkId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // User's email (stored in lowercase for easier searching)
    email: { 
        type: String, 
        required: true, 
        lowercase: true,
        trim: true 
    },
    // Full name from Clerk
    name: { 
        type: String, 
        trim: true 
    },
    // The role that defines what the user can see (Day 5 Logic)
    role: { 
        type: String, 
        enum: ['admin', 'librarian', 'user'], 
        default: 'user' // Everyone starts as a Student/User
    },
    // Optional: We can track when the user joined
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);