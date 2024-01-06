// api.js
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5270/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

const useApi = () => {
  const { token } = useAuth();

  const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/Tokens/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  };

  const getRolesInferiores = async () => {
    const response = await fetch(`${API_BASE_URL}/Roles/inferiores`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const getMesas = async () => {
    const response = await fetch(`${API_BASE_URL}/Mesas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const createMesa = async (mesa) => {
    const response = await fetch(`${API_BASE_URL}/Mesas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mesa),
    });
	return handleResponse(response);
  }

  const getTurnos = async () => {
    const response = await fetch(`${API_BASE_URL}/Turnos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const getTurnoMesas = async (idTurno) => {
  const response = await fetch(`${API_BASE_URL}/Turnos/mesas/${idTurno}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };
  
  const getTurnoMesasNoAsignadas = async (idTurno) => {
  const response = await fetch(`${API_BASE_URL}/Turnos/mesas-no-asignadas/${idTurno}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const createTurno = async (turno) => {
    const response = await fetch(`${API_BASE_URL}/Turnos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(turno),
    });
    return handleResponse(response);
  };

  const updateTurnoSetMozo = async (asignacion) => {
	  const response = await fetch(`${API_BASE_URL}/Turnos/asignar-mozo`, {
		  method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asignacion),
    });
    return handleResponse(response);
  };

  const updateTurnoAddMesa = async (asignacion) => {
	  const response = await fetch(`${API_BASE_URL}/Turnos/asignar-mesa`, {
		  method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asignacion),
    });
    return handleResponse(response);
  };

  const deleteTurno = async (turno) => {return false;};

  const deleteMesa = async (mesaId) => {
	const response = await fetch(`${API_BASE_URL}/Mesas/${mesaId}`, {
		method: 'DELETE',
		headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const getPersonalByRole = async (roleName) => {
    const response = await fetch(`${API_BASE_URL}/Personal/${roleName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const createPersonal = async (personal) => {
    const response = await fetch(`${API_BASE_URL}/Personal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personal),
    });

    return handleResponse(response);
  };
  
  const deletePersonal = async (personalId) => {
	const response = await fetch(`${API_BASE_URL}/Personal/${personalId}`, {
		method: 'DELETE',
		headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  const createVenta = async (venta) => {
    const response = await fetch(`${API_BASE_URL}/Ventas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    return handleResponse(response);
  };

  const getVentaMesas = async () => {
    const response = await fetch(`${API_BASE_URL}/Ventas/mesas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }});
    return handleResponse(response);
  };
  
  const getVentasConFiltro = async (venta) => {
    const response = await fetch(`${API_BASE_URL}/Ventas/historial`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    return handleResponse(response);
  };

  const getPrueba = async () => {
    const response = await fetch(`${API_BASE_URL}/Prueba`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  };

  return { getPrueba, loginUser, 
  getRolesInferiores, getPersonalByRole, createPersonal, deletePersonal, 
  getMesas, createMesa, deleteMesa,
  createVenta, getVentaMesas, getVentasConFiltro,
  getTurnos, getTurnoMesas, getTurnoMesasNoAsignadas, createTurno, deleteTurno, updateTurnoSetMozo, updateTurnoAddMesa
  }
};

export default useApi;
