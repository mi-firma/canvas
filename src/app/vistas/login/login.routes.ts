import { Routes, RouterModule } from '@angular/router';
import { LoggedGuard } from 'src/app/core/guards/logged/logged.guard';
import { ResetPasswordGuard } from 'src/app/core/guards/resetPassword/resetPassword.guard';
import { AppLayoutComponent } from 'src/app/layouts/layout/layout.component';
import { LoginFacialComponent } from './login-facial/login-facial.component';
import { LoginPasswordComponent } from './login-password/login-password.component';
import { LoginPinComponent } from './login-pin/login-pin.component';
import { LoginTerminosComponent } from './login-terminos/login-terminos.component';
import { LoginFirmadorComponent } from './login/login-firmador.component';
import { ResetPasswordPinComponent } from './reset-password-pin/reset-password-pin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedGuard],
    component: AppLayoutComponent,
    children: [
        {
            path: '',
            component: LoginFirmadorComponent
        },
        {
            path: 'login',
            component: LoginPinComponent
        },
        {
            path: 'login/facial',
            component: LoginFacialComponent
        },
        {
            path: 'login/terminos',
            component: LoginTerminosComponent
        },
        {
            path: 'login/password',
            component: LoginPasswordComponent
        },
        {
            path: 'login/reset/password',
            component: ResetPasswordComponent,
            canActivate: [ResetPasswordGuard]
        },
        {
            path: 'login/reset/password/pin',
            component: ResetPasswordPinComponent
        }
    ],
  }
];

export const LOGIN_ROUTES = RouterModule.forChild(routes);
