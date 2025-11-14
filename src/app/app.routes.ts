import { Routes } from '@angular/router';
import { EmpleadosList } from './components/empleados/empleados-list/empleados-list';
import { EmpleadosDetails } from './components/empleados/empleados-details/empleados-details';
import { Home } from './components/home/home';

export const routes: Routes = [
    // Agregar rutas correspondientes para ir al inicio
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'Pagina de Inicio' },
    { path: 'listado-empleados', component: EmpleadosList, title: 'Listado de Empleados' },
    { path: 'details/:id', component: EmpleadosDetails }
];
