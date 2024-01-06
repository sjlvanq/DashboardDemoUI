import React from 'react';
import { useAuth } from '../context/AuthContext';

import PanelPersonal from './PanelPersonal';
import PanelMesas from './PanelMesas';
import PanelTurnos from './PanelTurnos';
import PanelVentasRegistro from './PanelVentasRegistro';
import PanelVentasHistorial from './PanelVentasHistorial';

const Dashboard = (hierarchyLevel) => {
  const { token } = useAuth();
  console.log(hierarchyLevel.hierarchyLevel);
  //console.log("Token en Dashboard:", token);
  return (
	<div>
	<p><a href="/">Salir</a></p>
	{hierarchyLevel.hierarchyLevel <= 1 && <PanelPersonal />}
	{hierarchyLevel.hierarchyLevel ===0 && <PanelVentasHistorial />} 
	{hierarchyLevel.hierarchyLevel ===1 && <><PanelMesas /><PanelTurnos /></>} 
	{hierarchyLevel.hierarchyLevel ===2 && <PanelVentasRegistro />}
	</div>
  );
};

export default Dashboard;

/*

*/