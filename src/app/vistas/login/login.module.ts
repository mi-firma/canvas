import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/custom-modules/shared.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { LottieAnimationViewModule } from 'ng-lottie';
import { MatSelectModule } from '@angular/material';
import { LOGIN_ROUTES } from './login.routes';
import { LoginFirmadorComponent } from './login/login-firmador.component';
import { LoginFacialComponent } from './login-facial/login-facial.component';
import { LoginPasswordComponent } from './login-password/login-password.component';
import { LoginPinComponent } from './login-pin/login-pin.component';
import { LoginTerminosComponent } from './login-terminos/login-terminos.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordPinComponent } from './reset-password-pin/reset-password-pin.component';
import { AppLayoutsModule } from 'src/app/layouts/layout.module';
import { AppSharedModule } from 'src/app/shared/app-shared.module';

@NgModule({
    declarations: [
        LoginFirmadorComponent,
        LoginFacialComponent,
        LoginPasswordComponent,
        LoginPinComponent,
        LoginTerminosComponent,
        ResetPasswordComponent,
        ResetPasswordPinComponent
    ],
    imports: [
        SharedModule,
        LottieAnimationViewModule.forRoot(),
        LOGIN_ROUTES,
        AppSharedModule,
        AppLayoutsModule,
        RecaptchaModule,
        MatSelectModule,
    ],
    exports: []
})
export class LoginModule { }
