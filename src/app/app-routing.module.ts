import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppLayoutComponent } from './layouts/layout/layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./vistas/login/login.module').then(m => m.LoginModule)
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'otros-firmantes/:guid',
                loadChildren: () => import('./vistas/main/components/otros-firmantes-pdftron/otros-firmantes-pdftron.module')
                .then((x) => x.OtrosFirmantesPDFTRONModule)
            }
        ]
    },
    {
        path: 'main',
        loadChildren: () => import('./vistas/main/main.module').then(m => m.MainModule)
    },
    {
        path: 'registro',
        loadChildren: () => import('./vistas/registro/registro.module').then(m => m.RegistroModule)
    },
    {
        path: 'main/errorMifirma',
        loadChildren: () => import('./shared/vistas/error/error.module').then(m => m.ErrorModule)
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        onSameUrlNavigation: 'reload',
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
