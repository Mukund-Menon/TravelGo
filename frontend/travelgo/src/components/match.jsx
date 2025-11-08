import React, { useState } from 'react';  
import axios from 'axios';  
  
const API_BASE = 'http://localhost:5000';  

function CompanionMatching() {  
  const [tripId, setTripId] = useState('');  
  const [matches, setMatches] = useState([]);  
  const [error, setError] = useState('');  
  
  const findMatches = async () => {  
    try {  
      const response = await axios.get(`${API_BASE}/api/trips/match`, {  
        params: { tripId }  
      });  
      setMatches(response.data);  
      setError('');  
    } catch (err) {  
      setError(err.response?.data?.msg || 'Failed to find matches');  
      setMatches([]);  
    }  
  };  
  
  return (  
    <div>  
      <h2>Find Travel Companions</h2>  
      <div>  
        <input  
          placeholder="Enter your Trip ID"  
          value={tripId}  
          onChange={(e) => setTripId(e.target.value)}  
        />  
        <button onClick={findMatches}>Find Matches</button>  
      </div>  
        
      {error && <p style={{ color: 'red' }}>{error}</p>}  
        
      {matches.length > 0 ? (  
        <div>  
          <h3>Found {matches.length} potential companion(s):</h3>  
          {matches.map((match, idx) => (  
            <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>  
              <p><strong>Traveler:</strong> {match.travelerName}</p>  
              <p><strong>Destination:</strong> {match.destination}</p>  
              <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>  
              <p><strong>Common Preferences:</strong> {match.commonPreferences.join(', ') || 'None'}</p>  
            </div>  
          ))}  
        </div>  
      ) : (  
        <p>No matches found yet.</p>  
      )}  
    </div>  
  );  
}  
  
export default CompanionMatching;