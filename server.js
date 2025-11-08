// server.js (FINAL CORRECTED VERSION WITH SSL FIX)
// --- 1. CORE IMPORTS ---
require('dotenv').config(); // MUST be at the very top to load .env variables
const express = require('express');
const mongoose = require('mongoose'); // Mongoose is needed for database connection

// --- 2. INITIALIZATION ---
const app = express();
app.use(express.json()); // Middleware to parse incoming JSON data

// --- 3. DATABASE CONNECTION LOGIC (FINAL SSL FIX APPLIED) ---
const connectDB = async () => {
    try {
        // [1] Mongoose configuration to suppress depreciation warnings
        mongoose.set('strictQuery', false); 
        
        // [2] CRITICAL FIX: Passing options to resolve the SSL/TLS Handshake Error (The root cause)
        await mongoose.connect(process.env.MONGO_URI, {
            // These options often resolve the specific SSL Handshake error 
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB connected successfully. Ready for data.');
    } catch (error) {
        console.error('MongoDB connection error (FIX FAILED):', error.message);
        process.exit(1); // Exit process if connection fails
    }
};
connectDB(); // Call the connection function immediately

// --- 4. API ROUTERS INTEGRATION ---
// Import and use all your defined routers for API endpoints
app.use('/api/auth', require('./api/auth')); 
app.use('/api/trips', require('./api/trips')); 
app.use('/api/routing', require('./api/routing')); 
app.use('/api/safety', require('./api/safety')); 

// --- 5. SIMPLE TEST ROUTE ---
// Confirms the server is running on the base URL
app.get('/', (req, res) => {
    res.send('Travel Companion Backend API is running...');
});

// --- 6. SERVER LISTENER ---
// Use the PORT from the .env file (or default to 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});