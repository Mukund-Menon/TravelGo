// api/auth.js (FINAL CORRECTED VERSION)

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    // Destructure ALL data sent from the frontend form
    const { 
        email, 
        password, 
        name, 
        emergencyContact = {}, // Default to empty object if missing
        gender,    
        age,    
        preferences
    } = req.body;
    
    // Convert 'age' to a number here, as Mongoose will fail if it's passed as a string
    const ageValue = parseInt(age, 10);
    
    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create a new User instance with corrected data types
        user = new User({ 
            email, 
            password, 
            name,
            gender: gender || null,    // Use null for Mongoose if the value is empty
            age: isNaN(ageValue) ? null : ageValue, // Use the converted number (or null if NaN)
            preferences: preferences || [], // Ensure this is an array
            emergencyContact: {
                name: emergencyContact.name || 'Default Contact',
                phone: emergencyContact.phone || null,
            }
        });

        // 3. Save user to the database
        await user.save();
        
        // 4. Respond with success
        res.status(201).json({ 
            msg: 'Registration successful! Proceed to login.', 
            userId: user._id 
        });

    } catch (err) {
        // Log the full error object for definitive debugging
        console.error("REGISTRATION FAILED (Mongoose/Server):", err); 
        
        // Check for specific Mongoose Validation Errors
        if (err.name === 'ValidationError') {
            // This happens if a required field (like email/name) is missing, or the data type is wrong.
             return res.status(400).json({ msg: 'Validation Failed: Check your input data types (e.g., Age must be a number).' });
        }
        
        res.status(500).send('Server Error during registration');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token/user details
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Check password (In production, COMPARE HASHES here)
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        // 3. Respond with basic user data
        res.json({ 
            msg: 'Login successful', 
            userId: user._id,
            name: user.name
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
});

module.exports = router;