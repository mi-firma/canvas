import { Routes, RouterModule } from '@angular/router';
import { RegistroWrapperComponent } from './registro-wrapper/registro-wrapper.component';
import { RegistroPinComponent } from './registro-pin/registro-pin.component';
import { RegistroFotoComponent } from './registro-foto/registro-foto.component';
import { LoggedGuard } from 'src/app/core/guards/logged/logged.guard';
import { RegistroFormularioComponent } from './registro-formulario/registro-formulario.component';
import { RegistroInicioComponent } from './registro-inicio/registro-inicio.component';
import { ActivarCuentaComponent } from './activar-cuenta/activar-cuenta.component';
import { ConfirmarCelularComponent } from './confirmar-celular/confirmar-celular.component';

const routes: Routes = [
  {
    path: '',
    component: RegistroWrapperComponent,
    children: [
      {
        canActivate: [LoggedGuard],
        path: '',
        component: RegistroInicioComponent
      },
      {
        canActivate: [LoggedGuard],
        path: 'datos/ubicacion',
        component: RegistroFormularioComponent
      },
      {
        canActivate: [LoggedGuard],
        path: 'datos/confirma',
        component: RegistroPinComponent
      },
      {
        path: 'datos/foto',
        component: RegistroFotoComponent
      },
      {
        path: 'activar/cuenta',
        component: ActivarCuentaComponent
      },
      {
        path: 'activar/cuenta/:id',
        component: ActivarCuentaComponent
      },
      {
        path: 'confirmar/celular',
        component: ConfirmarCelularComponent
      }
    ],
  }
];

export const REGISTER_ROUTES = RouterModule.forChild(routes);
