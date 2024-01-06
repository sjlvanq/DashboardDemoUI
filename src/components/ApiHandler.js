import React, { useState, useEffect } from 'react';

const ApiHandler = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleApiRequest = async (url, method, body) => {
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        setErrors(data.errors || { error: 'Error desconocido' });
        throw data;
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setErrors({ error: 'Error al realizar la solicitud' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // Implement token renewal if necessary
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && !refreshToken) {
      // Implement token renewal using refreshToken here
    }
  }, [token]);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          handleApiRequest,
          loading,
          errors,
          updateToken,
        })
      )}
    </>
  );
};

export default ApiHandler;
