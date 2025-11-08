import React, { useState } from 'react';  
import Login from './components/login';  
import Register from './components/signup';  
import CreateTrip from './components/trip';  
import CompanionMatching from './components/match';  
import RouteDisplay from './components/display';  
import './App.css';  
  
function App() {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [userName, setUserName] = useState('');  
  const [activeTab, setActiveTab] = useState('createTrip');  
  const [showRegister, setShowRegister] = useState(false);  
  
  const handleLoginSuccess = (userData) => {  
    setIsLoggedIn(true);  
    setUserName(userData.name);  
  };  
  
  const handleRegisterSuccess = (data) => {  
    // After successful registration, show login form  
    setShowRegister(false);  
    alert('Registration successful! Please login.');  
  };  
  
  const handleLogout = () => {  
    localStorage.removeItem('userId');  
    localStorage.removeItem('userName');  
    setIsLoggedIn(false);  
    setUserName('');  
  };  
  
  if (!isLoggedIn) {  
    return (  
      <div className="App">  
        <div className="container">  
          <h1>TravelGo</h1>  
          {showRegister ? (  
            <>  
              <Register onRegisterSuccess={handleRegisterSuccess} />  
              <p>  
                Already have an account?{' '}  
                <button onClick={() => setShowRegister(false)}>Login</button>  
              </p>  
            </>  
          ) : (  
            <>  
              <Login onLoginSuccess={handleLoginSuccess} />  
              <p>  
                Don't have an account?{' '}  
                <button onClick={() => setShowRegister(true)}>Sign Up</button>  
              </p>  
            </>  
          )}  
        </div>  
      </div>  
    );  
  }  
  
  return (  
    <div className="App">  
      <header className="header">  
        <h1>TravelGo</h1>  
        <div className="user-info">  
          <span>Welcome, {userName}!</span>  
          <button onClick={handleLogout}>Logout</button>  
        </div>  
      </header>  
  
      <nav className="tabs">  
        <button   
          className={activeTab === 'createTrip' ? 'active' : ''}  
          onClick={() => setActiveTab('createTrip')}  
        >  
          Create Trip  
        </button>  
        <button   
          className={activeTab === 'findCompanions' ? 'active' : ''}  
          onClick={() => setActiveTab('findCompanions')}  
        >  
          Find Companions  
        </button>  
        <button   
          className={activeTab === 'optimizeRoute' ? 'active' : ''}  
          onClick={() => setActiveTab('optimizeRoute')}  
        >  
          Optimize Route  
        </button>  
      </nav>  
  
      <main className="content">  
        {activeTab === 'createTrip' && <CreateTrip />}  
        {activeTab === 'findCompanions' && <CompanionMatching />}  
        {activeTab === 'optimizeRoute' && <RouteDisplay />}  
      </main>  
    </div>  
  );  
}  
  
export default App;