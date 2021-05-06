import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/custom-modules/shared.module';
import { MAIN_ROUTES } from './main.routes';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { AppLayoutsModule } from 'src/app/layouts/layout.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularDraggableModule } from 'angular2-draggable';
import { DragulaModule } from 'ng2-dragula';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MainSharedModule } from './shared/main-shared.module';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { MatRadioModule, MatSelectModule } from '@angular/material';
import { NgXCreditCardsModule } from 'ngx2-credit-cards';
import { TitleCasePipe } from '@angular/common';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminPlantillasComponent } from './components/admin-plantillas/admin-plantillas.component';
import { AgregarFirmantesComponent } from './components/agregar-firmantes/agregar-firmantes.component';
import { FirmadorLargoComponent } from './components/agregar-firmantes/Forms/firmadorlargo.component';
import { FirmadorUnicoComponent } from './components/agregar-firmantes/Forms/firmadorunico.component';
import { ConfigFirmaComponent } from './components/config-firma/config-firma.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ConfigurarUsuariosComponent } from './components/configurar-usuarios/configurar-usuarios.component';
import { CrearPlantillaComponent } from './components/crear-plantilla/crear-plantilla.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FirmaProcesadaComponent } from './components/firma-procesada/firma-procesada.component';
import { FirmadorPDFTronComponent } from './components/firmador-pdftron/firmador.component';
import { InfoApiComponent } from './components/info-api/info-api.component';
import { MenuComponent } from './components/menu/menu.component';
import { PagoExitosoComponent } from './components/pagos/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './components/pagos/pago-fallido/pago-fallido.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { InfoFacturacionComponent } from './components/pagos/pagosComponents/info-facturacion.component';
import { InfoPagoComponent } from './components/pagos/pagosComponents/info-pago.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PlanComponent } from './components/plan/plan.component';
import { InfoDocumentoComponent } from './components/repositorio/info-documento/info-documento.component';
import { RepositorioComponent } from './components/repositorio/repositorio.component';
import { TipoFirmaComponent } from './components/tipo-firma/tipo-firma.component';
import { InfoFolderComponent } from './components/repositorio/info-folder/info-folder.component';
import { ExpedienteComponent } from './components/repositorio/expediente/expediente.component';
import { TermsComponent } from './components/terms/terms.component';
import { TeamsComponent } from './components/teams/teams.component';
import { ManageTeamComponent } from './components/manage-team/manage-team.component';
import { BasicOptionsComponent } from './components/basic-options/basic-options.component';
import { InvitationTeamComponent } from './components/invitation-team/invitation-team.component';
import { InfoRechazoComponent } from './components/info-rechazo/info-rechazo.component';
import { CustomizationMailTemplateComponent } from './components/customization-mail-template/customization-mail-template.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorPhotoshopModule } from 'ngx-color/photoshop';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PlanSliderComponent } from './components/plan/plan-slider/plan-slider.component';

@NgModule({
  declarations: [
    MainWrapperComponent,
    MenuComponent,
    ConfiguracionComponent,
    DocumentosComponent,
    AgregarFirmantesComponent,
    FirmadorLargoComponent,
    FirmadorUnicoComponent,
    FirmadorPDFTronComponent,
    PerfilComponent,
    PlanComponent,
    PlanSliderComponent,
    ConfigFirmaComponent,
    RepositorioComponent,
    InfoDocumentoComponent,
    PagoExitosoComponent,
    PagoFallidoComponent,
    PagosComponent,
    InfoFacturacionComponent,
    InfoPagoComponent,
    ConfigurarUsuariosComponent,
    FirmaProcesadaComponent,
    TipoFirmaComponent,
    InfoApiComponent,
    AdminPlantillasComponent,
    CrearPlantillaComponent,
    InfoFolderComponent,
    ExpedienteComponent,
    TermsComponent,
    TeamsComponent,
    ManageTeamComponent,
    BasicOptionsComponent,
    InvitationTeamComponent,
    InfoRechazoComponent,
    CustomizationMailTemplateComponent,
  ],
  imports: [
    SharedModule,
    MAIN_ROUTES,
    AppLayoutsModule,
    NgxFileDropModule,
    PdfViewerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    NgXCreditCardsModule,
    AngularDraggableModule,
    DragulaModule.forRoot(),
    SignaturePadModule,
    NgbModule,
    MainSharedModule,
    AppSharedModule,
    TextMaskModule,
    MatSlideToggleModule,
	ColorSketchModule,
    ColorPhotoshopModule,
    SlickCarouselModule
  ],
  exports: [],
  providers: [TitleCasePipe]
})
export class MainModule { }
