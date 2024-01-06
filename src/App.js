import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import Prueba from './components/Prueba';

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
    </div>
  );
}

export default App;
/*
	  {authState.isLogged ? <Dashboard /> : <LoginForm onLoginSuccess={handleLoginSuccess} /> }
	  
	  
  return (
	<AuthProvider value={{ authState, setAuth: handleLoginSuccess }}>
    <div>
      <h1>Dashboard Demo.</h1>
	  {authState.isLogged ? <Dashboard /> : <LoginForm onLoginSuccess={handleLoginSuccess} /> }
	  <p></p>
    </div>
    </AuthProvider>

  );*/