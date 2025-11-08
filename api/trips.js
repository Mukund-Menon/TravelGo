// api/trips.js
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const User = require('../models/User'); // Needed to populate match names

// --- Helper function for basic distance calculation (MVP: Simple Proximity Check) ---
// This is a placeholder; for production, use a dedicated Geo library like Turf.js
const isClose = (coord1, coord2, toleranceKm = 100) => {
    // Highly simplified check: just compares latitude/longitude values
    const latDiff = Math.abs(coord1.lat - coord2.lat);
    const lonDiff = Math.abs(coord1.lon - coord2.lon);
    
    // In a real app, calculate actual distance (Haversine formula)
    return latDiff < 1.0 && lonDiff < 1.0; // Assume 1 degree is roughly 111km
};

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Authenticated (requires userId in the body for MVP)
router.post('/', async (req, res) => {
    // userId is assumed to be passed from the frontend after login
    const { userId, source, destination, date, preferences } = req.body; 
    
    try {
        const newTrip = new Trip({ userId, source, destination, date, preferences });
        await newTrip.save();
        res.status(201).json(newTrip);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Could not create trip');
    }
});

// @route   GET /api/trips/match
// @desc    Find travelers heading to the same or similar destination/date
// @access  Authenticated
router.get('/match', async (req, res) => {
    // In a real application, you'd get the criteria from user session/query params.
    // For MVP test, we'll hardcode one trip's criteria for demonstration:
    const { tripId } = req.query; 

    try {
        const currentTrip = await Trip.findById(tripId);
        if (!currentTrip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // --- MVP Matching Logic ---
        const matchedTrips = await Trip.find({
            // 1. Exclude the current user's trip
            _id: { $ne: currentTrip._id }, 
            // 2. Destination name similarity (case-insensitive search)
            'destination.name': { $regex: currentTrip.destination.name, $options: 'i' }, 
            // 3. Date proximity (look for trips within 2 days of each other)
            date: {
                $gte: new Date(currentTrip.date.getTime() - (2 * 24 * 60 * 60 * 1000)), // 2 days before
                $lte: new Date(currentTrip.date.getTime() + (2 * 24 * 60 * 60 * 1000))  // 2 days after
            },
            status: 'active'
        }).populate('userId', 'name'); // Populate only the name field from the User model

        // Filter and structure results for the frontend
        const results = matchedTrips
            .filter(trip => isClose(currentTrip.destination.coords, trip.destination.coords))
            .map(trip => ({
                tripId: trip._id,
                travelerName: trip.userId.name,
                destination: trip.destination.name,
                date: trip.date,
                commonPreferences: trip.preferences.filter(p => currentTrip.preferences.includes(p))
            }));

        res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during matching');
    }
});

module.exports = router;