import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';

const PanelPersonal = () => {
  const { token } = useAuth();
  const [ errors, setErrors ] = useState({});
  const [ info, setInfo ] = useState({});

  const [ personal, setPersonal] = useState({});
  const { createPersonal } = useApi();
  
  const { getRolesInferiores, getPersonalByRole, deletePersonal } = useApi();
  const [ roles, setRoles ] = useState([]);
  const [ listaPersonal, setListaPersonal ] = useState([]);
  
  const [ selectedRole, setSelectedRole ] = useState('');

  const [isLoadingListaPersonal, setIsLoadingListaPersonal] = useState(false);

  useEffect(() => {
	//console.log('Token en PanelPersonal:', token);
    getRolesInferiores()
      .then((data) => setRoles(data))
      .catch((error) => {
        return
		//console.error('Error al obtener roles:', error);
      });
  }, []);
  
  useEffect(() => {
	setPersonal({ ...personal, ["role"]: selectedRole });
    setErrors({});
  }, [selectedRole]);

  useEffect(() => {
    if (info.delMsg || info.newUpdMsg) {
      const timerId = setTimeout(() => {
        setInfo({});
      }, 3500);
      return () => clearTimeout(timerId);
    }
  }, [info.delMsg,info.newUpdMsg]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonal({ ...personal, [name]: value });
  };

  const handleRoleChange = (e) => {
    const selectedRoleName = e.target.value;
    setSelectedRole(selectedRoleName);
    getPersonalByRole(selectedRoleName)
      .then((data) => {setListaPersonal(data); })
      .catch((error) => {console.error(`Error al obtener usuarios para el rol ${selectedRoleName}:`, error)});
  };

  const handleDeletePersonal = async (e, userUuid) => {
    e.preventDefault();
	  try {
		var response = await deletePersonal(userUuid);
		setListaPersonal((prevLista) =>
		  prevLista.filter((personal) => personal.id !== userUuid)
		)
		setInfo(response);
	  } catch (error) {
		console.error(`Error al eliminar el personal ${userUuid}`);
	  }
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
    setErrors({});
	setInfo({});
	try {
      const response = await createPersonal(personal);
	  setInfo(response);
	  setPersonal({dni:'',firstName:'',lastName:'',password:'',role:selectedRole});
	  getPersonalByRole(selectedRole)
        .then((data) => {setListaPersonal(data); })
        .catch((error) => {console.error(`Error al obtener listado de personal`)});
    } catch (error) {
		console.log("catch de error");
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({'error':'Error desconocido'});
      }
    }
  };
  
  return (
    <div>
	  <h3>Personal</h3>
      <label htmlFor="role">Selecciona un rol:</label>
      <select id="role" onChange={handleRoleChange} value={selectedRole}>
        <option value="" disabled>Seleccione un rol</option>
        {roles.map((role) => (
          <option key={role.id} value={role.normalizedName}>{role.name}</option>
        ))}
      </select>

      {listaPersonal.length > 0 && (
        <div>
			{ isLoadingListaPersonal ? <p>Cargando...</p> :
			(
			<figure><table style={{textAlign:'center'}}>
			<thead>
				<tr>
					<th>DNI</th>
					<th>Nombres</th>
					<th>Apellidos</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
			{listaPersonal.map((p) => (
			  <tr key={p.id}>
				<td>{p.dni}</td>
				<td>{p.firstName}</td>
				<td>{p.lastName}</td>
				<td>
				{
					/*
					<a href="/" onClick={(e)=>{e.preventDefault();console.log("Editar",p.id);}}>Editar</a>
					&nbsp;&bull;&nbsp;
					*/
				}					
					<a href="/" onClick={(e)=>{handleDeletePersonal(e,p.id)}}>Eliminar</a>
				</td>
			  </tr>
            ))}
			</tbody>
			</table></figure>
			)}
		{info.delMsg && (<p style={{ color: 'blue' }}>{info.delMsg}</p>)}
        </div>
      )}
	  {selectedRole && ( <>
	  <h4>Nuevo personal: {selectedRole}</h4>
	  <form onSubmit={handleSubmit}>
	  {info.newUpdMsg && (<p style={{ color: 'blue' }}>{info.newUpdMsg}</p>)}
	  {errors.error && <ErrorMessages errors={errors.error} />}
	  <div><label htmlFor="dni">DNI:&nbsp;<input
          type="text"
          id="dni"
          name="dni"
          value={personal.dni}
          onChange={handleInputChange}/>
		  {errors.DNI && <ErrorMessages errors={errors.DNI} />}
		  </label></div>
	  <div><label htmlFor="firstName">Nombres:&nbsp;<input 
		  type="text"
          id="firstName"
          name="firstName"
          value={personal.firstName}
          onChange={handleInputChange}/>
		  {errors.FirstName && <ErrorMessages errors={errors.FirstName} />}
		  </label></div>
	  <div><label htmlFor="lastName">Apellidos:&nbsp;<input 
	      type="text"
          id="lastName"
          name="lastName"
          value={personal.lastName}
          onChange={handleInputChange}/>
		  {errors.LastName && <ErrorMessages errors={errors.LastName} />}
		  </label></div>
	  <div><label htmlFor="password">Contraseña:&nbsp;<input 
	      type="text"
          id="password"
          name="password"
          value={personal.password}
          onChange={handleInputChange}/>
		  {errors.Password && <ErrorMessages errors={errors.Password} />}
		  </label></div>
	  <button type="submit">Registrar personal</button>
	  </form>
	  </>)}
    </div>
  );
};

export default PanelPersonal;
