import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
const { setAuth } = useAuth();
const [ hierarchyLevel, setHierarchyLevel ] = useState();

  const [authState, setAuthState] = useState({
    isLogged: false,
    token: null,
  });
  
  const handleLoginSuccess = (token, hierarchy) => {
	setAuth(token);
    setAuthState({
      isLogged: true,
      token: token,
    });
	setHierarchyLevel(hierarchy);
  };
  
  return (
    <div>
      <h1>Dashboard Demo.</h1>
	  {authState.isLogged ? <Dashboard hierarchyLevel={hierarchyLevel} /> : <LoginForm onLoginSuccess={handleLoginSuccess} /> }
	  <p></p>
	<div style={{width:"100%", fontSize:"9px", textAlign:"center"}}>
	Silvano Emanuel Roques.&nbsp;
	&#128241; <a href="https://wa.me/541233331111"> 123 333 1111</a>&nbsp;
	&#9993; <a href="mailto:direccionde@correo.com"> direccionde@correo.com</a></div>
    </div>

  );
}

export default App;