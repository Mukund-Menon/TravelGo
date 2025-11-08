import React, { useState } from 'react';  
import axios from 'axios';  
  
const API_BASE = 'http://localhost:5000';  
  
function Register({ onRegisterSuccess }) {  
  const [formData, setFormData] = useState({  
    email: '',  
    password: '',  
    name: '',  
    gender: '',  
    age: '',  
    preferences: [],  
    emergencyContactName: '',  
    emergencyContactPhone: ''  
  });  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  
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
    try {  
      const response = await axios.post(`${API_BASE}/api/auth/register`, {  
        email: formData.email,  
        password: formData.password,  
        name: formData.name,  
        gender: formData.gender || undefined,  
        age: formData.age || undefined,  
        preferences: formData.preferences,  
        emergencyContact: {  
          name: formData.emergencyContactName,  
          phone: formData.emergencyContactPhone  
        }  
      });  
        
      setSuccess(response.data.msg);  
      setError('');  
        
      // Optionally auto-login or redirect to login  
      if (onRegisterSuccess) {  
        onRegisterSuccess(response.data);  
      }  
    } catch (err) {  
      setError(err.response?.data?.msg || 'Registration failed');  
      setSuccess('');  
    }  
  };  
  
  return (  
    <div>  
      <h2>Sign Up</h2>  
      <form onSubmit={handleSubmit}>  
        <h3>Account Information</h3>  
        <input  
          type="email"  
          placeholder="Email"  
          value={formData.email}  
          onChange={(e) => setFormData({...formData, email: e.target.value})}  
          required  
        />  
        <input  
          type="password"  
          placeholder="Password"  
          value={formData.password}  
          onChange={(e) => setFormData({...formData, password: e.target.value})}  
          required  
        />  
        <input  
          type="text"  
          placeholder="Full Name"  
          value={formData.name}  
          onChange={(e) => setFormData({...formData, name: e.target.value})}  
          required  
        />  
          
        <h3>Profile Information (Optional)</h3>  
        <select  
          value={formData.gender}  
          onChange={(e) => setFormData({...formData, gender: e.target.value})}  
        >  
          <option value="">Select Gender</option>  
          <option value="male">Male</option>  
          <option value="female">Female</option>  
          <option value="other">Other</option>  
        </select>  
          
        <input  
          type="number"  
          placeholder="Age (18+)"  
          value={formData.age}  
          onChange={(e) => setFormData({...formData, age: e.target.value})}  
          min="18"  
        />  
          
        <div>  
          <p>Travel Preferences:</p>  
          <label>  
            <input   
              type="checkbox"   
              checked={formData.preferences.includes('cost-sensitive')}  
              onChange={() => handlePreferenceChange('cost-sensitive')}   
            />  
            Cost-Sensitive  
          </label>  
          <label>  
            <input   
              type="checkbox"   
              checked={formData.preferences.includes('eco-friendly')}  
              onChange={() => handlePreferenceChange('eco-friendly')}   
            />  
            Eco-Friendly  
          </label>  
          <label>  
            <input   
              type="checkbox"   
              checked={formData.preferences.includes('fastest')}  
              onChange={() => handlePreferenceChange('fastest')}   
            />  
            Fastest  
          </label>  
        </div>  
          
        <h3>Emergency Contact</h3>  
        <input  
          type="text"  
          placeholder="Emergency Contact Name"  
          value={formData.emergencyContactName}  
          onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}  
        />  
        <input  
          type="tel"  
          placeholder="Emergency Contact Phone"  
          value={formData.emergencyContactPhone}  
          onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}  
        />  
          
        <button type="submit">Sign Up</button>  
      </form>  
        
      {error && <p style={{ color: 'red' }}>{error}</p>}  
      {success && <p style={{ color: 'green' }}>{success}</p>}  
    </div>  
  );  
}  
  
export default Register;