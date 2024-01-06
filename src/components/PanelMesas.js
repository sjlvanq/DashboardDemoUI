import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';

const PanelMesas = () => {
  const { token } = useAuth();
  const [ errors, setErrors ] = useState({});
  const [ info, setInfo ] = useState({});
  
  const [ mesa, setMesa ] = useState({});
  const { createMesa } = useApi();
    
  const { getMesas, deleteMesa } = useApi();
  const [ listaMesas, setListaMesas ] = useState([]);
  const [ selectedMesa, setSelectedMesa ] = useState('');

  const [isLoadingListaMesas, setIsLoadingListaMesas] = useState(false);

  useEffect(() => {
	setMesa({asignarANuevosTurnos: true});
    getMesas()
      .then((data) => setListaMesas(data))
      .catch((error) => {
        console.error('Error al obtener mesas');
      });
  }, []);
  
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
    setMesa({ ...mesa, [name]: value });
  };

  const handleMesaCreateAsignacion = (e) => {
    const selectedMesa = e.target.value;
    setSelectedMesa(selectedMesa);
  };

  const handleDeleteMesa = async (e, mesaId) => {
	setInfo({});
	setErrors({});
    e.preventDefault();
	console.log("Delete",mesaId);
	  try {
		var response = await deleteMesa(mesaId);
		setInfo(response);
		getMesas()
			.then((data) => {setListaMesas(data); })
			.catch((error) => {console.error(`Error al obtener listado de mesas`)});
		/*
		setListaMesas((prevLista) =>
		  prevLista.filter((mesa) => mesa.id !== mesaId)
		);
		*/
	  } catch (error) {
		//console.error(`Error al eliminar la mesa ${mesaId}`);
		setErrors({'delMsg':'Error desconocido'});
	  }
  };

  const handleEditMesa = async (e, mesaId) => {
    e.preventDefault();
	console.log("Edit",mesaId);
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
    setErrors({});
	setInfo({});
	try {
      const response = await createMesa(mesa);
	  setInfo(response);
	  setMesa({ nombre: '', asignarANuevosTurnos: false });
	  getMesas()
        .then((data) => {setListaMesas(data); })
        .catch((error) => {console.error(`Error al obtener listado de mesas`)});
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({'error':'Error desconocido'});
      }
    }
  };
  
  return (
    <div>
	  <h3>Mesas</h3>

      {listaMesas.length > 0 && (
        <div>          
			{ isLoadingListaMesas ? <p>Cargando...</p> :
			(
			<figure>
			<table style={{textAlign:"center"}}>
			<thead>
			<tr>
			<th>Mesa</th>
			<th>Asignación<br />automática</th>
			<th colSpan="2">Acciones</th>
			</tr>
			</thead><tbody>
			{listaMesas.map((p) => (
			  <tr key={p.mesaId}> 
			  <td>{p.nombre}</td>
			  <td>{(p.asignarANuevosTurnos)?"Sí":"No"}</td>
			  <td><a href="/" onClick={(e)=>{handleDeleteMesa(e,p.mesaId)}}>Eliminar</a></td>
			  </tr>
            ))}
			</tbody>
			</table>
			</figure>
			)}
		{info.delMsg && (<p style={{ color: 'blue' }}>{info.delMsg}</p>)}
		{errors.delMsg && (<p style={{ color: 'red' }}>{errors.delMsg}</p>)}
        </div>
      )}
	  <h4>Nueva mesa</h4>
	  <form onSubmit={handleSubmit}>
	  {info.newUpdMsg && (<p style={{ color: 'blue' }}>{info.newUpdMsg}</p>)}
	  {errors.error && <ErrorMessages errors={errors.error} />}
	  <div><label htmlFor="nombre">Nombre de la mesa:</label><input
          type="text"
          id="nombre"
          name="nombre"
          value={mesa.nombre}
          onChange={handleInputChange}/>
		  {errors.Nombre && <ErrorMessages errors={errors.Nombre} />}
		  </div>
	  <div className="form-row">
	  <label htmlFor="asignarANuevosTurnos">Asignar a nuevos turnos:</label>
	  <input 
		  type="checkbox"
          id="asignarANuevosTurnos"
          name="asignarANuevosTurnos"
          checked={mesa.asignarANuevosTurnos}
          onClick={()=>{
			  setMesa({...mesa, asignarANuevosTurnos: !mesa.asignarANuevosTurnos});
			  }}/>
		  {errors.AsignarANuevosTurnos && <ErrorMessages errors={errors.AsignarANuevosTurnos} />}
	  </div>
	  <button type="submit">Ingresar mesa</button>
	  </form>
	</div>
  );
};

export default PanelMesas;