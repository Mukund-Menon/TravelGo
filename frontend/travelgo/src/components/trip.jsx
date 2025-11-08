import React, { useState } from 'react';  
import axios from 'axios';  
  
const API_BASE = 'http://localhost:5000';  
  
function CreateTrip() {  
  const [formData, setFormData] = useState({  
    sourceName: '',  
    sourceLat: '',  
    sourceLon: '',  
    destName: '',  
    destLat: '',  
    destLon: '',  
    date: '',  
    preferences: []  
  });  
  const [message, setMessage] = useState('');  
  
  const handlePreferenceChange = (pref) => {  
    setFormData(prev => ({  
      ...prev,  
      preferences: prev.preferences.includes(pref)  
        ? prev.preferences.filter(p => p !== pref)  
        : [...prev.preferences, pref]  
    }));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    const userId = localStorage.getItem('userId');  
      
    try {  
      const response = await axios.post(`${API_BASE}/api/trips`, {  
        userId,  
        source: {  
          name: formData.sourceName,  
          coords: {  
            lat: parseFloat(formData.sourceLat),  
            lon: parseFloat(formData.sourceLon)  
          }  
        },  
        destination: {  
          name: formData.destName,  
          coords: {  
            lat: parseFloat(formData.destLat),  
            lon: parseFloat(formData.destLon)  
          }  
        },  
        date: formData.date,  
        preferences: formData.preferences  
      });  
        
      setMessage(`Trip created successfully! ID: ${response.data._id}`);  
    } catch (err) {  
      setMessage(err.response?.data || 'Failed to create trip');  
    }  
  };  
  
  return (  
    <div>  
      <h2>Create Trip</h2>  
      <form onSubmit={handleSubmit}>  
        <h3>Source</h3>  
        <input placeholder="Source Name" value={formData.sourceName}   
          onChange={(e) => setFormData({...formData, sourceName: e.target.value})} required />  
        <input placeholder="Latitude" type="number" step="any" value={formData.sourceLat}  
          onChange={(e) => setFormData({...formData, sourceLat: e.target.value})} required />  
        <input placeholder="Longitude" type="number" step="any" value={formData.sourceLon}  
          onChange={(e) => setFormData({...formData, sourceLon: e.target.value})} required />  
          
        <h3>Destination</h3>  
        <input placeholder="Destination Name" value={formData.destName}  
          onChange={(e) => setFormData({...formData, destName: e.target.value})} required />  
        <input placeholder="Latitude" type="number" step="any" value={formData.destLat}  
          onChange={(e) => setFormData({...formData, destLat: e.target.value})} required />  
        <input placeholder="Longitude" type="number" step="any" value={formData.destLon}  
          onChange={(e) => setFormData({...formData, destLon: e.target.value})} required />  
          
        <h3>Date & Preferences</h3>  
        <input type="datetime-local" value={formData.date}  
          onChange={(e) => setFormData({...formData, date: e.target.value})} required />  
          
        <div>  
          <label>  
            <input type="checkbox" onChange={() => handlePreferenceChange('cost-sensitive')} />  
            Cost-Sensitive  
          </label>  
          <label>  
            <input type="checkbox" onChange={() => handlePreferenceChange('eco-friendly')} />  
            Eco-Friendly  
          </label>  
          <label>  
            <input type="checkbox" onChange={() => handlePreferenceChange('fastest')} />  
            Fastest  
          </label>  
        </div>  
          
        <button type="submit">Create Trip</button>  
      </form>  
      {message && <p>{message}</p>}  
    </div>  
  );  
}  
  
export default CreateTrip;