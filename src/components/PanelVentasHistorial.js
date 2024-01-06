import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';
import '../styles/styles.css';

const PanelVentasHistorial = () => {
  const { token } = useAuth();
  const [ errors, setErrors ] = useState({});
  const [ info, setInfo ] = useState();
  
  const [ ventasFiltro, setVentasFiltro ] = useState({});
  const { getVentasConFiltro } = useApi();
    
  const [ listaVentasFiltradas, setListaVentasFiltradas ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
	  /*
    getVentasConFiltro()
      .then(async (data) => {
		  setListaVentasFiltradas(data)
	  })
      .catch((error) => {
        setErrors({'error':'Error al obtener turnos'});
      });
	  */
  }, []);
  
    useEffect(() => {
    if (info) {
      const timerId = setTimeout(() => {
        setInfo(null);
      }, 3500);
      return () => clearTimeout(timerId);
    }
  }, [info]);
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVentasFiltro({ ...ventasFiltro, [name]: value });
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
    setErrors({});
	setIsLoading(true);
	try {
      const response = await getVentasConFiltro(ventasFiltro);
	  setListaVentasFiltradas(response);
	  if(Array.isArray(response) && response.length===0){setInfo("No hay ventas en el intervalo especificado");}
	  setVentasFiltro({ intervaloInicio: '', intervaloFin: '' });
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
		setErrors({'error':'Error al intentar obtener las ventas'});
      }
    } finally {
		setIsLoading(false);
	}
  };
  
  return (
    <div>
	  <h3>Ventas</h3>	  
	  <h4>Historial de ventas</h4>
	  <form onSubmit={handleSubmit}>
	  {info && (<p style={{ color: 'blue' }}>{info}</p>)}
	  {errors.error && <ErrorMessages errors={errors.error} />}
	  <div>
		  <label htmlFor="intervaloInicio">Desde:</label>
		  <div className="form-row">
			  <input
				  type="text"
				  id="intervaloInicio"
				  name="intervaloInicio"
				  value={ventasFiltro.intervaloInicio}
				  onChange={handleInputChange}/>
				  <button onClick={(e)=>{
					  e.preventDefault();
					  const d = new Date();
					  d.setHours(d.getHours() - 1); //DevEnv Inicio hace una hora
					  const d2 = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
					  setVentasFiltro({ ...ventasFiltro, 'intervaloInicio': d2.slice(0, 19) })}}
					>*</button>
		  </div>
		  {errors.IntervaloInicio && <ErrorMessages errors={errors.IntervaloInicio} />}
	  </div>
	  <div>
		  <label htmlFor="intervaloFin">Hasta:</label>
		  <div className="form-row">
			  <input
				  type="text"
				  id="intervaloFin"
				  name="intervaloFin"
				  value={ventasFiltro.intervaloFin}
				  onChange={handleInputChange}/>
				  <button onClick={(e)=>{
					  e.preventDefault();
					  const d = new Date();
					  d.setHours(d.getHours() + 1); //DevEnv Finalización dentro de una hora
					  const d2 = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
					  setVentasFiltro({ ...ventasFiltro, 'intervaloFin': d2.slice(0, 19) })}}
					>*</button>
		  </div>
		  {errors.IntervaloFin && <ErrorMessages errors={errors.IntervaloFin} />}
	</div>
		<button type="submit">Ver ventas</button>
	  </form>
	  	{/*info.delMsg && (<p style={{ color: 'blue' }}>{info.delMsg}</p>)*/}
	    {listaVentasFiltradas.length > 0 && (
        <div>          
			{isLoading ? <p>Cargando...</p> :
			(
			<table>
			<thead><th>Fecha/Hora</th><th>Valor</th><th>Mesa</th><th>Mozo</th></thead>
			<tbody>
			{listaVentasFiltradas.map((f,idx) => (
			  
			  <tr key={`$VentaFiltrada{idx}`}>
				<td>{f.fechaHoraVenta} </td><td> ${f.monto} </td><td> {f.mesa} </td><td> {f.mozo}</td>
			  </tr>
			  
            ))}
			</tbody>
			</table>
			)}
        </div>
      )}
	</div>
  );
};

export default PanelVentasHistorial;