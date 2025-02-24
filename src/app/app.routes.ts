import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { UserMainComponent } from './_modules/user-main/user-main.component';
import { PartidosComponent } from './_modules/user-main/partidos/partidos.component';
import { ReservasComponent } from './_modules/user-main/reservas/reservas.component';
import { PerfilComponent } from './_modules/user-main/perfil/perfil.component';
import { LoginComponent } from './Auth/login/login.component';

export const routes: Routes = [
    // {
    //     path: 'user-main',
    //     loadChildren: () => import('./modules/user-main/user-main.module').then(m => m.UserMainModule)
    // },
    // { path: '**', redirectTo: '/user-main'}
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: '/user-main'
    // },
    // {
    //     path: 'user-main',

    //     // loadChildren: () => import('./pages/user-page/user-page.module').then(m => m.UserPageModule)
    // },
    // // {
    // //     path: 'user-main',
    // //     // component: UserMainComponent,
    // //     // ...canActivate( () => redirectUnauthorizedTo(['login']))
    // //     loadChildren: () => import('./pages/UserPage/user-page-module/user-page-module.module').then(m => m.UserPageModuleModule)
    // // },
    // {
    //     path: 'admin-main',
    //     component: AdminMainComponent,
    //     ...canActivate( () => redirectUnauthorizedTo(['login']))
    // },
    // {
    //     path: 'login',
    //     component: LoginComponent
    // },
    // // {
    // //     path: 'register',
    // //     component: RegisterComponent
    // // },
    // // {
    // //     path: 'register-profile',
    // //     component: RegisterProfileComponent
    // // },
    // // {
    // //     path: 'reservar',
    // //     component: ReservaComponent
    // // },
    // {
    //     path: '**',
    //     redirectTo: '/user-main'
    // }
    {
        path: 'user-main',
        component: UserMainComponent,
        // ...canActivate( () => redirectUnauthorizedTo(['login'])),
        children: [
            { path: 'partidos', component: PartidosComponent},
            { path: 'reserva', component: ReservasComponent},
            { path: 'perfil', component: PerfilComponent},
            { path: '', redirectTo: 'partidos', pathMatch: 'full'}
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    { path: '**', redirectTo: 'user-main' }
];

// export default routes;
