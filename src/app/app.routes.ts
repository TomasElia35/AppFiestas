import { Routes } from '@angular/router';
import { EmpleadosList } from './components/empleados/empleados-list/empleados-list';
import { EmpleadosDetails } from './components/empleados/empleados-details/empleados-details';
import { Home } from './components/home/home';
import { EmpleadosInvite } from './components/empleados/empleados-invite/empleados-invite';
// 👇 1. Importa el nuevo componente
import { ResultadoComponent } from './components/resultado/resultado';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'Pagina de Inicio' },
    { path: 'escanear-invitacion', component: EmpleadosInvite, title: 'Escanear Invitación' },
    // 👇 2. Añade la nueva ruta para el resultado
    { path: 'resultado/:status', component: ResultadoComponent, title: 'Resultado del Check-in' },
    { path: 'listado-empleados', component: EmpleadosList, title: 'Listado de Empleados' },
    { path: 'details/:id', component: EmpleadosDetails }
];