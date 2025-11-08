// models/User.js (FINAL DEFINITIVE FIX)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    
    // Fields from the frontend form (now correctly defined)
    gender: { type: String, enum: ['male', 'female', 'other'] },
    age: { type: Number, min: 18 },
    preferences: [{ type: String }],

    // CRITICAL FIX: Ensure the phone field is defined correctly within the sub-object
    emergencyContact: {
        name: { type: String, default: 'Emergency Contact' },
        phone: { type: String } // Ensured the type is explicitly String
    },
}, { strict: false }); // Added {strict: false} as a temporary measure to ignore unexpected data

module.exports = mongoose.model('User', UserSchema);