import React, { useState } from 'react';  
import axios from 'axios';  
  
const API_BASE = 'http://localhost:5000';  
  
function Login({ onLoginSuccess }) {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [error, setError] = useState('');  
  
  const handleLogin = async (e) => {  
    e.preventDefault();  
    try {  
      const response = await axios.post(`${API_BASE}/api/auth/login`, {  
        email,  
        password  
      });  
        
      // Store userId and name from response  
      localStorage.setItem('userId', response.data.userId);  
      localStorage.setItem('userName', response.data.name);  
      onLoginSuccess(response.data);  
    } catch (err) {  
      setError(err.response?.data?.msg || 'Login failed');  
    }  
  };  
  
  return (  
    <div>  
      <h2>Login</h2>  
      <form onSubmit={handleLogin}>  
        <input  
          type="email"  
          placeholder="Email"  
          value={email}  
          onChange={(e) => setEmail(e.target.value)}  
          required  
        />  
        <input  
          type="password"  
          placeholder="Password"  
          value={password}  
          onChange={(e) => setPassword(e.target.value)}  
          required  
        />  
        <button type="submit">Login</button>  
      </form>  
      {error && <p style={{ color: 'red' }}>{error}</p>}  
    </div>  
  );  
}  
  
export default Login;