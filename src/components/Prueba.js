import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';

const Prueba = () => {
  const { token } = useAuth();
  const { getPrueba } = useApi();
  const [msj, setMsj] = useState('');
  useEffect(() => {
	//console.log('Token en Prueba:', token);
    getPrueba()
      .then((data) => setMsj(data))
      .catch((error) => {
        console.error('Error en Prueba:', error);
      });
  }, [token]);
return(
<p>{msj}</p>

)
};

export default Prueba;