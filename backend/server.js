// server.js (FINAL CORRECTED VERSION WITH CORS & SSL FIX)
// --- 1. CORE IMPORTS ---
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); // <-- CRITICAL: CORS IMPORTED

// --- 2. INITIALIZATION ---
const app = express();

// --- 2.1 CRITICAL FIX: CORS Middleware ---
// Allows frontend (port 5173) to talk to backend (port 5000)
app.use(cors({
    origin: 'http://localhost:3000', // <-- This MUST match the frontend port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json()); // Middleware to parse incoming JSON data

// --- 3. DATABASE CONNECTION LOGIC ---
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false); 
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully. Ready for data.');
    } catch (error) {
        console.error('MongoDB connection error (FATAL):', error.message);
        process.exit(1);
    }
};
connectDB(); 

// --- 4. API ROUTERS INTEGRATION ---
app.use('/api/auth', require('./api/auth')); 
app.use('/api/trips', require('./api/trips')); 
app.use('/api/routing', require('./api/routing')); 
app.use('/api/safety', require('./api/safety')); 

// --- 5. SIMPLE TEST ROUTE ---
app.get('/', (req, res) => {
    res.send('Travel Companion Backend API is running...');
});

// --- 6. SERVER LISTENER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
