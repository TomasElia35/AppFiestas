import { Routes } from '@angular/router';
import { EmpleadosList } from './components/empleados/empleados-list/empleados-list';
import { EmpleadosDetails } from './components/empleados/empleados-details/empleados-details';
import { Home } from './components/home/home';
import { EmpleadosInvite } from './components/empleados/empleados-invite/empleados-invite';
import { ResultadoComponent } from './components/resultado/resultado';
import { InvitacionesEventoComponent } from './components/invitaciones-evento/invitaciones-evento';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
    { path: '', component: InvitacionesEventoComponent, title: 'Mi Entrada - Fiesta Fin de Año' },
    { path: 'login', component: LoginComponent, title: 'Ingreso Staff' },
    { path: 'home', component: Home, title: 'Panel Staff', canActivate: [authGuard] },
    { path: 'escanear-invitacion', component: EmpleadosInvite, title: 'Escanear Invitación',canActivate: [authGuard] },
    { path: 'resultado/:status', component: ResultadoComponent, title: 'Resultado del Check-in',canActivate: [authGuard] },
    { path: 'listado-empleados', component: EmpleadosList, title: 'Listado de Empleados', canActivate: [authGuard] },
    { path: 'details/:id', component: EmpleadosDetails, canActivate: [authGuard], title: 'Detalles del Empleado' },
    { path: '**', redirectTo: '' }

];