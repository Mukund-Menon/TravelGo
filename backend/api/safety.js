// api/safety.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // To retrieve emergency contact info

// --- Mock SMS Sending Function ---
// In a real application, this would use a service like Twilio or SendGrid.
function sendMockEmergencySMS(contactName, contactPhone, userName, locationUrl) {
    console.log('\n==========================================');
    console.log('🚨 MOCK EMERGENCY ALERT TRIGGERED 🚨');
    console.log(`Sending SMS to: ${contactName} (${contactPhone})`);
    console.log(`From User: ${userName}`);
    console.log(`Message Content: SOS! I need help. My current location is: ${locationUrl}`);
    console.log('==========================================\n');
    // For MVP, simply logging to the console is sufficient proof of concept.
    return true; 
}

// @route   POST /api/safety/sos
// @desc    Trigger an SOS alert and notify emergency contact
// @access  Authenticated (requires userId in the body)
router.post('/sos', async (req, res) => {
    // Expects: { userId: "...", location: {lat: 0.0, lon: 0.0} }
    const { userId, location } = req.body; 

    try {
        const user = await User.findById(userId);
        if (!user || !user.emergencyContact || !user.emergencyContact.phone) {
            return res.status(404).json({ 
                msg: 'User or emergency contact information not found.' 
            });
        }
        
        const { name: contactName, phone: contactPhone } = user.emergencyContact;
        const userName = user.name;

        // Create a mock Google Maps link using the coordinates
        const locationUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`;

        // 1. Send the Alert (Mocked)
        sendMockEmergencySMS(contactName, contactPhone, userName, locationUrl);
        
        // 2. Respond to the frontend
        res.json({ 
            msg: `SOS alert triggered and notification sent to ${contactName}.`,
            locationSent: location 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during SOS trigger');
    }
});

module.exports = router;