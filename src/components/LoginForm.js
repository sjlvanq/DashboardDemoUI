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
    <form onSubmit={handleSubmit} className="pure-form">
      <div>
        {errors.error && <ErrorMessages errors={errors.error} />}
        <label htmlFor="userName">Usuario:
        <input
          type="text"
          id="userName"
          name="userName"
          value={credentials.userName}
          onChange={handleInputChange}
		  autoComplete="username"
        />
		</label>
        {errors.UserName && <ErrorMessages errors={errors.UserName} />}
      </div>
      <div>
        <label htmlFor="password">Contraseña:
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
		  autoComplete="current-password"
        />
		</label>
        {errors.Password && <ErrorMessages errors={errors.Password} />}
      </div>
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default LoginForm;
