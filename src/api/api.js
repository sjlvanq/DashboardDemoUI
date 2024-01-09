import {
    useAuth
} from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5270/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw error;
    }
    return response.json();
};

const configureHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

const buildUrl = (endpoint) => `${API_BASE_URL}/${endpoint}`;

const request = async (url, options) => {
    const response = await fetch(url, options);
    return handleResponse(response);
};

const useApi = () => {
    const {
        token
    } = useAuth();

    const loginUser = async (credentials) => {
        const url = buildUrl('Tokens/login');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(credentials),
        };
        return request(url, options);
    };

    const getRolesInferiores = async () => {
        const url = buildUrl('Roles/inferiores');
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const getMesas = async () => {
        const url = buildUrl('Mesas');
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const createMesa = async (mesa) => {
        const url = buildUrl('Mesas');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(mesa),
        };
        return await request(url, options);
    };

    const getTurnos = async () => {
        const url = buildUrl('Turnos');
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const getTurnoMesas = async (idTurno) => {
        const url = buildUrl(`Turnos/mesas/${idTurno}`);
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const getTurnoMesasNoAsignadas = async (idTurno) => {
        const url = buildUrl(`Turnos/mesas-no-asignadas/${idTurno}`);
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const createTurno = async (turno) => {
        const url = buildUrl('Turnos');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(turno),
        };
        return await request(url, options);
    };

    const updateTurnoSetMozo = async (asignacion) => {
        const url = buildUrl('Turnos/asignar-mozo');
        const options = {
            method: 'PUT',
            headers: configureHeaders(token),
            body: JSON.stringify(asignacion),
        };
        return await request(url, options);
    };

    const updateTurnoAddMesa = async (asignacion) => {
        const url = buildUrl('Turnos/asignar-mesa');
        const options = {
            method: 'PUT',
            headers: configureHeaders(token),
            body: JSON.stringify(asignacion),
        };
        return await request(url, options);
    };

    const deleteTurno = async (turno) => {
        return false;
    };

    const deleteMesa = async (mesaId) => {
        const url = buildUrl(`Mesas/${mesaId}`);
        const options = {
            method: 'DELETE',
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const getPersonalByRole = async (roleName) => {
        const url = buildUrl(`Personal/${roleName}`);
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const createPersonal = async (personal) => {
        const url = buildUrl('Personal');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(personal),
        };
        return await request(url, options);
    };

    const deletePersonal = async (personalId) => {
        const url = buildUrl(`Personal/${personalId}`);
        const options = {
            method: 'DELETE',
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const createVenta = async (venta) => {
        const url = buildUrl('Ventas');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(venta),
        };
        return await request(url, options);
    };

    const getVentaMesas = async () => {
        const url = buildUrl('Ventas/mesas');
        const options = {
            method: 'GET',
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    const getVentasConFiltro = async (venta) => {
        const url = buildUrl('Ventas/historial');
        const options = {
            method: 'POST',
            headers: configureHeaders(token),
            body: JSON.stringify(venta),
        };
        return await request(url, options);
    };

    const getPrueba = async () => {
        const url = buildUrl('Prueba');
        const options = {
            headers: configureHeaders(token),
        };
        return await request(url, options);
    };

    return {
        getPrueba,
        loginUser,
        getRolesInferiores,
        getPersonalByRole,
        createPersonal,
        deletePersonal,
        getMesas,
        createMesa,
        deleteMesa,
        createVenta,
        getVentaMesas,
        getVentasConFiltro,
        getTurnos,
        getTurnoMesas,
        getTurnoMesasNoAsignadas,
        createTurno,
        deleteTurno,
        updateTurnoSetMozo,
        updateTurnoAddMesa
    }
};

export default useApi;