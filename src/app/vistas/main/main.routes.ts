import { Routes, RouterModule } from '@angular/router';
import { CartGuard } from 'src/app/core/guards/cart/cart.guard';
import { NoFilesGuard } from 'src/app/core/guards/nofiles/no-files.guard';
import { SelectedPlanGuard } from 'src/app/core/guards/selected-plan/selected-plan.guard';
import { AdminPlantillasComponent } from './components/admin-plantillas/admin-plantillas.component';
import { AgregarFirmantesComponent } from './components/agregar-firmantes/agregar-firmantes.component';
import { BasicOptionsComponent } from './components/basic-options/basic-options.component';
import { ConfigFirmaComponent } from './components/config-firma/config-firma.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ConfigurarUsuariosComponent } from './components/configurar-usuarios/configurar-usuarios.component';
import { CrearPlantillaComponent } from './components/crear-plantilla/crear-plantilla.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FirmaProcesadaComponent } from './components/firma-procesada/firma-procesada.component';
import { FirmadorPDFTronComponent } from './components/firmador-pdftron/firmador.component';
import { InfoApiComponent } from './components/info-api/info-api.component';
import { InfoRechazoComponent } from './components/info-rechazo/info-rechazo.component';
import { InvitationTeamComponent } from './components/invitation-team/invitation-team.component';
import { ManageTeamComponent } from './components/manage-team/manage-team.component';
import { MenuComponent } from './components/menu/menu.component';
import { PagoExitosoComponent } from './components/pagos/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './components/pagos/pago-fallido/pago-fallido.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PlanComponent } from './components/plan/plan.component';
import { ExpedienteComponent } from './components/repositorio/expediente/expediente.component';
import { InfoDocumentoComponent } from './components/repositorio/info-documento/info-documento.component';
import { InfoFolderComponent } from './components/repositorio/info-folder/info-folder.component';
import { RepositorioComponent } from './components/repositorio/repositorio.component';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';
import { TipoFirmaComponent } from './components/tipo-firma/tipo-firma.component';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { CustomizationMailTemplateComponent } from './components/customization-mail-template/customization-mail-template.component';

const routes: Routes = [
  {
    path: '',
    component: MainWrapperComponent,
    children: [
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'documentos',
        component: DocumentosComponent
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent
      },
      {
        path: 'agregarfirmantes',
        canActivate: [NoFilesGuard],
        component: AgregarFirmantesComponent
      },
      {
        path: 'firmador-pdftron',
        canActivate: [NoFilesGuard],
        component: FirmadorPDFTronComponent
      },
      {
        path: 'repositorio',
        component: RepositorioComponent
      },
      {
        path: 'info-documento/:serial/:nombreDoc/:estadoDoc/:tipoSolicitud',
        component: InfoDocumentoComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'pago/exitoso',
        canActivate: [CartGuard],
        component: PagoExitosoComponent
      },
      {
        path: 'pago/fallido',
        canActivate: [CartGuard],
        component: PagoFallidoComponent
      },
      {
        path: 'pagos',
        canActivate: [CartGuard],
        component: PagosComponent
      },
      {
        path: 'plan',
        component: PlanComponent
      },
      {
        path: 'miFirma',
        component: ConfigFirmaComponent
      },
      {
        path: 'configurar/usuarios',
        component: ConfigurarUsuariosComponent
      },
      {
        path: 'firmar/procesado',
        component: FirmaProcesadaComponent
      },
      {
        path: 'tipo/firma',
        component: TipoFirmaComponent
      },
      {
        path: 'api',
        component: InfoApiComponent
      },
      {
        path: 'plantillas',
        component: AdminPlantillasComponent
      },
      {
        path: 'plantilla',
        component: CrearPlantillaComponent
      },
      {
        path: 'plantilla/:id',
        component: CrearPlantillaComponent
      },
      {
        path: 'repositorio/:nameFolder/:id',
        component: InfoFolderComponent
      },
      {
        path: 'expediente/:serial',
        component: ExpedienteComponent
      },
      {
        path: 'terminos/:nombreTerm',
        component: TermsComponent
      },
      {
        path: 'equipos',
        component: TeamsComponent
      },
      {
        path: 'equipo/:name/:idC/:id',
        component: ManageTeamComponent
      },
      {
        path: 'opciones',
        component: BasicOptionsComponent
      },
      { 
        path: 'customMailTemplate', component: CustomizationMailTemplateComponent
      },
	    {
        path: 'invitacion/:id/:idC',
        component: InvitationTeamComponent
      },
      {
        path: 'firmar/rechazado',
        component: InfoRechazoComponent
      }
    ]
  }

];

export const MAIN_ROUTES = RouterModule.forChild(routes);
