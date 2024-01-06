import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';

const PanelVentasRegistro = () => {
  const { token } = useAuth();
  const [ errors, setErrors ] = useState({});
  const [ info, setInfo ] = useState({});
  
  const [ venta, setVenta ] = useState({});
  const { createVenta, getVentaMesas } = useApi();
  
  const [ selectedMesa, setSelectedMesa ] = useState(null);
  const [ listaMesas, setListaMesas ] = useState([]);
    	
  useEffect(() => {
    getVentaMesas()
      .then((data) => {
		  if(!data.length){throw 1;}
		  setListaMesas(data);
	  })
      .catch((error) => {
        setErrors({'error':'Error al intentar obtener mesas asignadas a Ud. en los turnos actuales'});
      });
  }, []);
    
  useEffect(() => {
	if (!selectedMesa && listaMesas.length > 0) {
		setSelectedMesa(listaMesas[0].mesaId);
	}
  }, [listaMesas, selectedMesa]);

  useEffect(() => {
    if (info.newUpdMsg) {
      const timerId = setTimeout(() => {
        setInfo({});
      }, 3500);
      return () => clearTimeout(timerId);
    }
  }, [info.newUpdMsg]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenta({ ...venta, [name]: value });
  };
  
  const handleMesaOptionChange = (e,mesaId) => {
	  setSelectedMesa(e.target.value);
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
    setErrors({});
	try {
	  const v = { ...venta, mesaId: selectedMesa};
      const response = await createVenta(v);
	  setInfo(response);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
		setErrors({'error':'Error al intentar registrar la venta'});
      }
    }
  };
  
  return (
    <div>
	  <h3>Ventas</h3>
	  <h4>Registrar venta</h4>
	  {info.delMsg && (<p style={{ color: 'blue' }}>{info.delMsg}</p>)}
	  <form onSubmit={handleSubmit}>
	  {info.newUpdMsg && (<p style={{ color: 'blue' }}>{info.newUpdMsg}</p>)}
	  {errors.error && <ErrorMessages errors={errors.error} />}
			<ul>
			{listaMesas.map((m,idx) => (
			  <li key={idx}>
			  <input 
			    id={`VentaMesa${idx}`}
				type="radio"
				name="mesa"
				value={m.mesaId}
				checked={selectedMesa == m.mesaId}
				onChange={(e)=>handleMesaOptionChange(e,m.mesaId)}
				/> &nbsp;
			  <label htmlFor={`VentaMesa${idx}`}>
				{m.mesa} {/*[{t.turnoId},{t.id},{selectedTurno},{idx}]*/}
			  </label>
			  </li>
            ))}
			</ul>
	  <div><label htmlFor="nombre">Monto:</label><input
          type="text"
          id="monto"
          name="monto"
          value={venta.monto}
          onChange={handleInputChange}
		  disabled={!selectedMesa}/>
		  {errors.Monto && <ErrorMessages errors={errors.Monto} />}
		  </div>
	  <button type="submit" disabled={!selectedMesa}>Registrar venta</button>
	  </form>
	</div>
  );
};

export default PanelVentasRegistro;