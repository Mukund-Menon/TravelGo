import React, { useState } from 'react';  
import axios from 'axios';  
  
const API_BASE = 'http://localhost:5000';  
  
function RouteDisplay() {  
  const [source, setSource] = useState({ lat: '', lon: '' });  
  const [destination, setDestination] = useState({ lat: '', lon: '' });  
  const [routes, setRoutes] = useState([]);  
  const [loading, setLoading] = useState(false);  
  
  const optimizeRoutes = async () => {  
    setLoading(true);  
    try {  
      const response = await axios.post(`${API_BASE}/api/routing/optimize`, {  
        source: { coords: { lat: parseFloat(source.lat), lon: parseFloat(source.lon) } },  
        destination: { coords: { lat: parseFloat(destination.lat), lon: parseFloat(destination.lon) } }  
      });  
      setRoutes(response.data);  
    } catch (err) {  
      console.error('Route optimization failed:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div>  
      <h2>Route Optimization</h2>  
      <div>  
        <h3>Source Coordinates</h3>  
        <input placeholder="Latitude" type="number" step="any" value={source.lat}  
          onChange={(e) => setSource({...source, lat: e.target.value})} />  
        <input placeholder="Longitude" type="number" step="any" value={source.lon}  
          onChange={(e) => setSource({...source, lon: e.target.value})} />  
          
        <h3>Destination Coordinates</h3>  
        <input placeholder="Latitude" type="number" step="any" value={destination.lat}  
          onChange={(e) => setDestination({...destination, lat: e.target.value})} />  
        <input placeholder="Longitude" type="number" step="any" value={destination.lon}  
          onChange={(e) => setDestination({...destination, lon: e.target.value})} />  
          
        <button onClick={optimizeRoutes} disabled={loading}>  
          {loading ? 'Calculating...' : 'Optimize Routes'}  
        </button>  
      </div>  
        
      {routes.length > 0 && (  
        <div>  
          <h3>Available Routes (sorted by duration):</h3>  
          {routes.map((route, idx) => (  
            <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>  
              <h4>{route.mode.toUpperCase()}</h4>  
              <p><strong>Distance:</strong> {route.distanceKm.toFixed(2)} km</p>  
              <p><strong>Duration:</strong> {route.durationMinutes} minutes</p>  
              <p><strong>Cost:</strong> ${route.cost.toFixed(2)}</p>  
              <p><strong>CO2 Emissions:</strong> {route.ecoKg.toFixed(1)} kg</p>  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
}  
  
export default RouteDisplay;