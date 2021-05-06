import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/custom-modules/shared.module';
import { REGISTER_ROUTES } from './registro.routes';
import { RegistroWrapperComponent } from './registro-wrapper/registro-wrapper.component';
import { AppLayoutsModule } from 'src/app/layouts/layout.module';
import { RegistroPinComponent } from './registro-pin/registro-pin.component';
import { RegisterSharedModule } from './shared/register-shared.module';
import { RegistroFotoComponent } from './registro-foto/registro-foto.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { RegistroFormularioComponent } from './registro-formulario/registro-formulario.component';
import { RegistroInicioComponent } from './registro-inicio/registro-inicio.component';
import { MatSelectModule, MatTooltipModule} from '@angular/material';
import { DatePipe } from '@angular/common';
import { ActivarCuentaComponent } from './activar-cuenta/activar-cuenta.component';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarCelularComponent } from './confirmar-celular/confirmar-celular.component';

@NgModule({
    declarations: [
        RegistroWrapperComponent,
        RegistroPinComponent,
        RegistroFotoComponent,
        RegistroFormularioComponent,
        RegistroInicioComponent,
        ActivarCuentaComponent,
        ConfirmarCelularComponent,
    ],
    imports: [
        SharedModule,
        AppSharedModule,
        LottieAnimationViewModule.forRoot(),
        REGISTER_ROUTES,
        RegisterSharedModule,
        AppLayoutsModule,
        MatSelectModule,
        MatTooltipModule,
        NgbModule
    ],
    exports: [],
    providers: [DatePipe]
})
export class RegistroModule { }
