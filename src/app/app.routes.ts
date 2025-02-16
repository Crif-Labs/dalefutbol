import { Routes } from '@angular/router';
import { UserMainComponent } from './pages/UserPage/user-main/user-main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { AdminMainComponent } from './pages/AdminPage/admin-main/admin-main.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { RegisterProfileComponent } from './Auth/register-profile/register-profile.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/user-main'
    },
    {
        path: 'user-main',
        component: UserMainComponent,
        // ...canActivate( () => redirectUnauthorizedTo(['login']))
    },
    {
        path: 'admin-main',
        component: AdminMainComponent,
        ...canActivate( () => redirectUnauthorizedTo(['login']))
    },
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
    {
        path: '**',
        redirectTo: '/user-main'
    }
];
