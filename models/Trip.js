// models/Trip.js
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    // Link this trip to a User
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Need source/destination name and coordinates (coords) for routing
    source: { 
        name: String, 
        coords: { lat: Number, lon: Number } 
    },
    destination: { 
        name: String, 
        coords: { lat: Number, lon: Number } 
    },
    date: { 
        type: Date, 
        required: true 
    },
    // Used for the Route Optimization filters and Matching preferences
    preferences: [{ 
        type: String, 
        enum: ['cost-sensitive', 'eco-friendly', 'fastest'] 
    }],
    status: { 
        type: String, 
        default: 'active' 
    },
    // Array to store IDs of matched travelers
    matches: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
});

module.exports = mongoose.model('Trip', TripSchema);