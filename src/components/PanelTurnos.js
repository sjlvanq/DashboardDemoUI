import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../api/api';
import ErrorMessages from './ErrorMessages';
import '../styles/styles.css';

const PanelTurnos = () => {
    const { token } = useAuth();
    const [errors, setErrors] = useState({});
    const [info, setInfo] = useState({});
    const [errorsAsignaciones, setErrorsAsignaciones] = useState({});
    const [infoAsignaciones, setInfoAsignaciones] = useState({});

    const [turno, setTurno] = useState({});
    const { getTurnos, getTurnoMesas, getTurnoMesasNoAsignadas,
        createTurno, deleteTurno,
        updateTurnoSetMozo, updateTurnoAddMesa,
        getPersonalByRole } = useApi();

    const [listaTurnos, setListaTurnos] = useState([]);
    const [listaTurnoMesas, setListaTurnoMesas] = useState([]);
    const [listaTurnoMesasNoAsignadas, setListaTurnoMesasNoAsignadas] = useState([])
    const [listaMozos, setListaMozos] = useState([]);

    const [selectedTurno, setSelectedTurno] = useState();
    const [selectedMesa, setSelectedMesa] = useState();
    const [mesaEnAsignacionDeMozo, setMesaEnAsignacionDeMozo] = useState({ turnoId: null, mesaId: null, mozoDni: null });
    const [isAsignandoMesas, setIsAsignandoMesas] = useState(false);

    const [isLoading, setIsLoading] = useState({ turnos: true, asignaciones: false });

    useEffect(() => {
        getTurnos()
            .then(async (data) => {
                setListaTurnos(data)
            })
            .catch((error) => {
                setErrors({ 'error': 'Error al obtener turnos' });
            })
            .finally(setIsLoading({ ...isLoading, turnos: false }));
    }, []);

    useEffect(() => {
		if (!selectedTurno && listaTurnos.length > 0) {
			setSelectedTurno(listaTurnos[0].turnoId);
            setMesaEnAsignacionDeMozo({ turnoId: listaTurnos[0].turnoId, mesaId: null, mozoDni: null });
			getTurnoMesas(listaTurnos[0].turnoId)
				.then(async (data) => setListaTurnoMesas(data))
				.catch((error) => {
					setErrors({ 'error': 'Error al obtener turnos' });
				})
				.finally(() => setIsLoading((prevObj) => ({ ...prevObj, asignaciones: false })));
			getTurnoMesasNoAsignadas(listaTurnos[0].turnoId)
				.then(async (data) => setListaTurnoMesasNoAsignadas(data))
				.catch((error) => {
					setErrors({ 'error': 'Error al obtener mesas no asignadas' });
				})
        }
    }, [listaTurnos, selectedTurno]);

    useEffect(() => {
        if (listaMozos.length > 0) {
            setMesaEnAsignacionDeMozo({ ...mesaEnAsignacionDeMozo, mozoDni: listaMozos[0].dni })
        }
    }, [listaMozos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTurno({ ...turno, [name]: value });
    };

    const handleTurnoOptionChange = (e, turnoId) => {
		console.log("handleTurnoOptionChange");
        setMesaEnAsignacionDeMozo({ turnoId: turnoId, mesaId: null, mozoDni: null });
        setErrorsAsignaciones({});
        setInfoAsignaciones({});
        setIsLoading((l) => ({ ...l, asignaciones: true }));
        setSelectedTurno(e.target.value);
        getTurnoMesas(turnoId)
            .then(async (data) => {
				setListaTurnoMesas(data); //SetListaTurnoMesas
				console.log("getTurnoMesas");
				console.log(data);})
            .catch((error) => {
                setErrors({ 'error': 'Error al obtener turnos' });
            })
            .finally(() => setIsLoading((prevObj) => ({ ...prevObj, asignaciones: false })));
        getTurnoMesasNoAsignadas(turnoId)
            .then(async (data) => {
				console.log("getTurnoMesasNoAsignadas")
                setListaTurnoMesasNoAsignadas(data);
                if (data.length > 1) { setSelectedMesa(data[0].idMesa);}
            })
            .catch((error) => {
                setErrorsAsignaciones({ 'error': 'Error al obtener mesas no asignadas del turno' });
            })
    };

    const handleTurnoCreateAsignacion = (e) => {
        const selectedTurno = e.target.value;
        setSelectedTurno(selectedTurno);
    };

    const handleDeleteTurno = async (e, turnoId) => {
        e.preventDefault();
        try {
            var response = await deleteTurno(turnoId);
            setListaTurnos((prevLista) =>
                prevLista.filter((turno) => turno.id !== turnoId)
            );
            setInfo(response);
        } catch (error) {
            console.error(`Error al eliminar la turno ${turnoId}:`, error);
        }
    };

    const handleEditTurno = async (e, turnoId) => {
        e.preventDefault();
    };

    const handleAsignarMozoAMesa = async () => {
        //setErrorsAsignaMozo({});
        //setInfoAsignaMozo({});
        try {
            const response = await updateTurnoSetMozo(mesaEnAsignacionDeMozo);
            setInfoAsignaciones(response);
            setIsLoading((prevObj) => ({ ...prevObj, asignaciones: true }));
            getTurnoMesas(mesaEnAsignacionDeMozo.turnoId)
                .then(async (data) => setListaTurnoMesas(data))
                .catch((error) => {
                    setErrorsAsignaciones({ 'error': 'Error al obtener mesas del turno' });
                })
                .finally(() => setIsLoading((prevObj) => ({ ...prevObj, asignaciones: false })));
        } catch (error) {
            setErrorsAsignaciones({ 'error': 'Error al intentar asignar el mozo' });
        }
    };

    const handleAsignarMesaATurno = async (e) => {
        setErrorsAsignaciones({});
        setInfoAsignaciones({});
        e.preventDefault();
        setIsAsignandoMesas(false)
        try {
            const response = await updateTurnoAddMesa({ mesaId: parseInt(selectedMesa,10), turnoId: selectedTurno });
            setInfoAsignaciones(response);
            setIsLoading((prevObj) => ({ ...prevObj, asignaciones: true }));
            getTurnoMesas(selectedTurno)
                .then(async (data) => setListaTurnoMesas(data))
                .catch((error) => {
                    setErrorsAsignaciones({ 'error': 'Error al obtener mesas de turno' });
                })
                .finally(() => setIsLoading((prevObj) => ({ ...prevObj, asignaciones: false })));
        } catch (error) {
            setErrorsAsignaciones({ 'error': 'Error desconocido al intentar asignar la mesa al turno' });
        }
    };

    const handleMesaEnAsignacionDeMozo = async (e, mesaId) => {
        e.preventDefault();
        setMesaEnAsignacionDeMozo({ ...mesaEnAsignacionDeMozo, mesaId: mesaId })
        //setMesaEnAsignacionDeMozo(mesaId);
        try {
            const response = await getPersonalByRole("MOZO");
            setListaMozos(response);
            //setMesaEnAsignacionDeMozo({...mesaEnAsignacionDeMozo, mozoDni: response[0].mozo});
        } catch (error) {
            if (error.errors) { //¿inaccesible...?
                setErrors(error.errors);
            } else {
                setErrors({ 'error': 'Error al intentar obtener listado de mozos' });
            }
        }
    };

    const handleMozoSelectChange = async (e) => {
        setErrorsAsignaciones({});
        setInfoAsignaciones({});
        setMesaEnAsignacionDeMozo({ ...mesaEnAsignacionDeMozo, mozoDni: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await createTurno(turno);
            setInfo(response);
            setTurno({ horaInicio: '', horaFin: '' });
            getTurnos()
                .then((data) => { setListaTurnos(data); })
                .catch((error) => { setErrors({ 'error': 'Error al intentar obtener listado de turnos' }) });
        } catch (error) {
            console.log("catch de error");
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ 'error': 'Error al intentar registrar el turno' });
            }
        }
    };

    return (
        <div>
            <h3>Turnos</h3>

            {listaTurnos.length > 0 && (
                <div>
                    {isLoading.turnos ? <p>Cargando...</p> :
                        (<>
                            <figure>
                                <table>
                                    <thead><tr><th>&nbsp;</th><th>Inicio</th><th>Fin</th></tr></thead>
                                    <tbody>
                                        {listaTurnos.map((t, idx) => (
                                            <tr key={t.turnoId}>
                                                <td>
                                                    <input
                                                        id={`TurnoTurno${idx}`}
                                                        type="radio"
                                                        name="turno"
                                                        value={t.turnoId}
                                                        checked={selectedTurno == t.turnoId}
                                                        onChange={(e) => handleTurnoOptionChange(e, t.turnoId)}
                                                    /></td>
                                                <td><label htmlFor={`TurnoTurno${idx}`}>{t.horaInicio}</label></td>
                                                <td><label htmlFor={`TurnoTurno${idx}`}>{t.horaFin}</label></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </figure>
                            { //listaTurnoMesas.length > 0 && 
							(
							
                                <>{
                                    isLoading.asignaciones ? <p>Cargando...</p> :
                                        <figure>
                                            <table style={{ marginTop: '10px' }}>
                                                <thead><tr><th style={{ textAlign: 'left' }}>Mesa&nbsp;
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsAsignandoMesas(!isAsignandoMesas);
                                                    }}>+</button>
                                                </th><th>Mozo</th><th>&nbsp;</th></tr></thead>
                                                <tbody>
                                                    {listaTurnoMesas.map((ms, i) => (
                                                        <tr key={`TurnoMesa${i}`}>
                                                            <td>{ms.mesa}</td>
                                                            <td style={{ minWidth: 100, textAlign: 'center' }}>{(ms.mozo) ? (ms.mozo) : (
                                                                (mesaEnAsignacionDeMozo.mesaId && mesaEnAsignacionDeMozo.mesaId === ms.mesaId) ?
                                                                    <select onChange={(e) => handleMozoSelectChange(e)}>
                                                                        {listaMozos.map((mz, i) => (
                                                                            <option key={i} value={mz.dni}>{mz.dni}</option>
                                                                        ))}
                                                                    </select>
                                                                    :
                                                                    "-----")}</td>
                                                            <td>{(ms.mozo) ?
                                                                <a href="/">Desvincular</a>
                                                                :
                                                                (
                                                                    (mesaEnAsignacionDeMozo.mesaId && mesaEnAsignacionDeMozo.mesaId === ms.mesaId) ?
                                                                        <>
                                                                            <button onClick={(e) => { handleAsignarMozoAMesa(e) }}>
                                                                                Asignar
                                                                            </button>&nbsp;&nbsp;
                                                                            <a href="/"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setMesaEnAsignacionDeMozo({ ...mesaEnAsignacionDeMozo, mesaId: null });
                                                                                }}
                                                                            >[X]</a>
                                                                        </>
                                                                        :
                                                                        <a href="/" onClick={(e) => {
                                                                            handleMesaEnAsignacionDeMozo(e, ms.mesaId)
                                                                        }}>
                                                                            Asignar
                                                                        </a>
                                                                )
                                                            }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                {isAsignandoMesas &&
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={3}>Asignar mesa al turno seleccionado:</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={1}>
                                                                <select value={selectedMesa} onChange={(e) => { setSelectedMesa(e.target.value) }}>
                                                                    <option value="" disabled={true}>Mesa a añadir</option>
                                                                    {listaTurnoMesasNoAsignadas.map((ms) => (
                                                                        <option key={ms.mesaId} value={ms.mesaId}>{ms.mesa}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td colSpan={2}>
                                                                <button onClick={(e) => handleAsignarMesaATurno(e)}>Asignar</button>&nbsp;&nbsp;
                                                                <a href="/" onClick={(e) => { e.preventDefault(); setIsAsignandoMesas(false) }}>[X]</a>
                                                            </td>
                                                        </tr>
                                                    </tfoot>}
                                            </table>
                                        </figure>
                                }</>
                            )}
                        </>
                        )}
                    {errorsAsignaciones.error && (<p><ErrorMessages errors={errorsAsignaciones.error} /></p>)}
                    {infoAsignaciones.newUpdMsg && (<p style={{ color: 'blue' }}>{infoAsignaciones.newUpdMsg}</p>)}
                    {infoAsignaciones.delMsg && (<p style={{ color: 'blue' }}>{infoAsignaciones.delMsg}</p>)}
                </div>
            )}

            <h4>Nuevo turno</h4>
            <form onSubmit={handleSubmit}>
                {info.newUpdMsg && (<p style={{ color: 'blue' }}>{info.newUpdMsg}</p>)}
                {errors.error && <ErrorMessages errors={errors.error} />}
                <div>
					<label htmlFor="horaInicio" className="input-con-boton">Hora de inicio del turno:</label>
					<div className="form-row" >
						<input
							style={{ display: 'inline-block' }}
							type="text"
							id="horaInicio"
							name="horaInicio"
							value={turno.horaInicio}
							onChange={handleInputChange} />
						<button
							style={{ display: 'inline-block' }}
							onClick={(e) => {
								e.preventDefault();
								const d = new Date();
								d.setHours(d.getHours() - 1); //DevEnv Inicio hace una hora
								const d2 = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
								setTurno({ ...turno, 'horaInicio': d2.slice(0, 19) })
							}}
						>*</button>
					</div>
					<>{errors.HoraInicio && <ErrorMessages errors={errors.HoraInicio} />}</>
                </div>
                <div>
					<label htmlFor="horaFin">Hora de finalización del turno:</label>
					<div className="form-row">
						<input
							type="text"
							id="horaFin"
							name="horaFin"
							value={turno.horaFin}
							onChange={handleInputChange} />
							<button
								onClick={(e) => {
									e.preventDefault();
									const d = new Date();
									d.setHours(d.getHours() + 1); //DevEnv Finalización dentro de una hora
									const d2 = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
									setTurno({ ...turno, 'horaFin': d2.slice(0, 19) })
								}}
							>*</button>
					</div>
                <>{errors.HoraFin && <ErrorMessages errors={errors.HoraFin} />}</>
				</div>
				<button type="submit">Ingresar turno</button>
            </form>
        </div>
    );
};

export default PanelTurnos;