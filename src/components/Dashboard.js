import React from 'react';
import { useAuth } from '../context/AuthContext';

import PanelPersonal from './PanelPersonal';
import PanelMesas from './PanelMesas';
import PanelTurnos from './PanelTurnos';
import PanelVentasRegistro from './PanelVentasRegistro';
import PanelVentasHistorial from './PanelVentasHistorial';

const Dashboard = () => {
  const { token } = useAuth();
  //console.log("Token en Dashboard:", token);
  return <>	  <p><a href="/">Salir</a></p>
<PanelPersonal /><PanelMesas /><PanelTurnos /><PanelVentasRegistro /><PanelVentasHistorial /></>;
};

export default Dashboard;