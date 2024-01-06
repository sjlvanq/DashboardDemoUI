import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';

const LoginForm = ({ onLoginSuccess }) => {
  const { setAuth } = useAuth();
  const { loginUser } = useApi();
  const [credentials, setCredentials] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await loginUser(credentials);
      onLoginSuccess(response.token);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({'error':'Problema desconocido'});
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
	<div>
	  <div style={{display:"flex", flexDirection:'row' }}>
        {errors.error && <ErrorMessages errors={errors.error} />}
		<label htmlFor="userName" style={{ width:'7em'}}>Usuario:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={credentials.userName}
          onChange={handleInputChange}
		  autoComplete="username"
        />
        {errors.UserName && <ErrorMessages errors={errors.UserName} />}
      </div>
      <div style={{display:"flex", flexDirection:'row' }}>
        <label htmlFor="password" style={{ width:'7em'}}>Clave:</label>
        <input 
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
		  autoComplete="current-password"
        />
        {errors.Password && <ErrorMessages errors={errors.Password} />}
      </div>
	  <div style={{marginTop:'5px'}}>
      <button type="submit" style={{width:'100%'}}>Iniciar sesión</button>
	  </div>
	</div>
    </form>
  );
};

export default LoginForm;
