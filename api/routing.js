// api/routing.js
const express = require('express');
const router = express.Router();
const axios = require('axios'); // For making HTTP requests to external API

const ORS_API_KEY = process.env.ROUTE_API_KEY;
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions/';

// --- Simplified Estimation Factors (P4's Internal Logic) ---
const FACTORS = {
    // Emissions: g CO2 per kilometer (Example estimated values)
    car: 120, // Average medium car
    foot: 0, 
    bike: 0,
    bus: 50, // More efficient than individual car
    train: 30, // Highly efficient (assumes electric/modern train)

    // Cost: $ per kilometer (Example fixed rates)
    car_rate: 0.20,
    bus_rate: 0.05,
    train_rate: 0.08
};

// --- Core function to get route data from ORS API ---
async function getRouteData(startCoords, endCoords, mode) {
    // Mode mapping for ORS API
    const orsMode = mode === 'carpool' ? 'driving-car' : mode; 

    const url = `${ORS_BASE_URL}${orsMode}/geojson`;
    
    try {
        const response = await axios.post(url, {
            coordinates: [
                [startCoords.lon, startCoords.lat],
                [endCoords.lon, endCoords.lat]
            ]
        }, {
            headers: {
                'Authorization': ORS_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        // Extract distance (meters) and duration (seconds)
        const summary = response.data.features[0].properties.summary;
        
        return {
            mode,
            distanceKm: summary.distance / 1000,
            durationMinutes: Math.round(summary.duration / 60),
            routeGeometry: response.data.features[0].geometry.coordinates // Used to draw the route on the map
        };

    } catch (error) {
        console.error(`Error fetching route for ${mode}:`, error.response ? error.response.data : error.message);
        return { mode, distanceKm: 0, durationMinutes: 0, error: `Routing failed for ${mode}` };
    }
}

// --- Logic to estimate Cost and Eco Footprint ---
function estimateMetrics(data) {
    const { mode, distanceKm, durationMinutes } = data;

    // 1. Cost Estimation
    let cost = 0;
    if (mode === 'carpool') {
        cost = distanceKm * FACTORS.car_rate;
    } else if (mode === 'bus') {
        cost = distanceKm * FACTORS.bus_rate;
    } else if (mode === 'train') {
        cost = distanceKm * FACTORS.train_rate;
    }
    cost = Math.round(cost * 100) / 100; // Round to 2 decimal places

    // 2. Eco Footprint (CO2) Estimation (convert grams to kg)
    let ecoKg = (distanceKm * FACTORS[mode === 'carpool' ? 'car' : mode]) / 1000;
    ecoKg = Math.round(ecoKg * 10) / 10; // Round to 1 decimal place

    return {
        cost: cost > 0 ? cost : 5, // Set a minimum $5 flat fee for short trips
        ecoKg,
        durationMinutes
    };
}

// @route   POST /api/routing/optimize
// @desc    Calculate and optimize routes for multiple transport modes
// @access  Public
router.post('/optimize', async (req, res) => {
    // Expects: { source: {lat, lon}, destination: {lat, lon} }
    const { source, destination } = req.body; 

    // Define modes to check (MVP focuses on car, bus, train for comparison)
    const modes = ['carpool', 'bus', 'train'];
    
    // Create promises to fetch all route data in parallel
    const routePromises = modes.map(mode => 
        getRouteData(source.coords, destination.coords, mode)
    );

    const rawRoutes = await Promise.all(routePromises);

    // Final processing to add cost and eco metrics
    const finalRoutes = rawRoutes
        .filter(route => !route.error && route.distanceKm > 0)
        .map(route => ({
            ...route,
            ...estimateMetrics(route) // Merge with cost/eco estimates
        }))
        .sort((a, b) => {
            // Default sort: prioritize shortest time
            return a.durationMinutes - b.durationMinutes; 
        });

    res.json(finalRoutes);
});

module.exports = router;