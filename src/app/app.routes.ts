import { Routes } from '@angular/router';
import { UserMainComponent } from './pages/UserPage/user-main/user-main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { AdminMainComponent } from './pages/AdminPage/admin-main/admin-main.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { RegisterProfileComponent } from './Auth/register-profile/register-profile.component';
import { ReservaComponent } from './pages/UserPage/reserva/reserva.component';
import { PartidosComponent } from './pages/UserPage/partidos/partidos.component';
import { MensajesComponent } from './pages/UserPage/mensajes/mensajes.component';
import { PerfilComponent } from './pages/UserPage/perfil/perfil.component';
import { TorneoComponent } from './pages/UserPage/torneo/torneo.component';
import { CheckOutComponent } from './pages/UserPage/check-out/check-out.component';
import { ReservasComponent } from './pages/AdminPage/reservas/reservas.component';
import { MisReservasComponent } from './pages/UserPage/mis-reservas/mis-reservas.component';
import { ConvetirFechasComponent } from './temporales/convetir-fechas/convetir-fechas.component';
import { MiPartidoComponent } from './pages/UserPage/mi-partido/mi-partido.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/user-main'
    },
    // {
    //     path: 'convertir-fechas',
    //     component: ConvetirFechasComponent
    // },
    {
        path: 'user-main',
        component: UserMainComponent,
        ...canActivate( () => redirectUnauthorizedTo(['login'])),
        children: [
            {path: 'partidos', component: PartidosComponent},
            {path: 'chat', component: MensajesComponent},
            {path: 'perfil', component: PerfilComponent},
            {path: 'torneo', component: TorneoComponent},
            {path: '**', redirectTo: 'partidos'}
        ]
    },
    {
        path: 'admin-main',
        component: AdminMainComponent,
        // ...canActivate( () => redirectUnauthorizedTo(['login']))
        children: [
            {path: 'reservas', component: ReservasComponent},
            {path: '**', redirectTo: 'admin-main'}
        ]
    },
    {path: 'reservas-check-in', component: ReservaComponent},
    {path: 'mis-reservas', component: MisReservasComponent},
    // {path: 'mi-partido', component: MiPartidoComponent},
    {path: 'check-out', component: CheckOutComponent},
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'register-profile',
        component: RegisterProfileComponent
    },
    // {
    //     path: 'reservar',
    //     component: ReservaComponent
    // },
    {
        path: '**',
        redirectTo: '/user-main'
    }
];
