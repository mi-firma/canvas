import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutsModule } from './layouts/layout.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppPdfViewerComponent } from './vistas/modales/pdf-viewer/pdf-viewer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarFirmaComponent } from './vistas/modales/agregar-firma/agregar-firma.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AngularDraggableModule } from 'angular2-draggable';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PinFirmadorComponent } from './vistas/modales/pin-firmador/pin-firmador.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CoreModule } from './custom-modules/core.module';
import { AppSharedModule } from './shared/app-shared.module';
import { AyudaFirmaComponent } from './vistas/modales/ayuda-firma/ayuda-firma.component';
import { TerminosComponent } from './vistas/modales/terminos/terminos.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { LottieAnimationViewModule } from 'ng-lottie';
import { EditarFirmanteComponent } from './vistas/modales/editar-firmante/editar-firmante.component';
import { MatChip, MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule } from '@angular/material';
import { AppErrorHandler } from './core/handlers/error.handler';
import { SubirPlantillaComponent } from './vistas/modales/subir-plantilla/subir-plantilla.component';
import { FirmantesTemplateComponent } from './vistas/modales/firmantes-template/firmantes-template.component';
import { ViewTemplateComponent } from './vistas/modales/view-template/view-template.component';
import { MensajesComponent } from './vistas/modales/mensajes/mensajes.component';
import { CreateFolderComponent } from './vistas/modales/create-folder/create-folder.component';
import { ListFoldersComponent } from './vistas/modales/list-folders/list-folders.component';
import { ShareDocComponent } from './vistas/modales/share-doc/share-doc.component';
import { FinishSignComponent } from './vistas/modales/finish-sign/finish-sign.component';
import { ListaMasivaComponent } from './vistas/modales/lista-masiva/lista-masiva.component';
import { CreateTeamComponent } from './vistas/modales/create-team/create-team.component';
import { ListCompanyUsersComponent } from './vistas/modales/list-company-users/list-company-users.component';
import { RejectSignComponent } from './vistas/modales/reject-sign/reject-sign.component';

@NgModule({
    declarations: [AppComponent, AppPdfViewerComponent, AgregarFirmaComponent,
                   PinFirmadorComponent,
                   AyudaFirmaComponent, TerminosComponent, EditarFirmanteComponent, MensajesComponent,
                   SubirPlantillaComponent, FirmantesTemplateComponent, ViewTemplateComponent, CreateFolderComponent,
                   ListFoldersComponent, ShareDocComponent, FinishSignComponent, ListaMasivaComponent, CreateTeamComponent, ListCompanyUsersComponent, RejectSignComponent],
    imports: [
        CommonModule,
        CoreModule,
        AppLayoutsModule,
        AppRoutingModule,
        NgbModule,
        PdfViewerModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        SignaturePadModule,
        AngularDraggableModule,
        DragDropModule,
        NgxFileDropModule,
        AppSharedModule,
        LottieAnimationViewModule.forRoot()
    ],
    exports: [AppPdfViewerComponent, AgregarFirmaComponent, PinFirmadorComponent, AyudaFirmaComponent,
      TerminosComponent, EditarFirmanteComponent, SubirPlantillaComponent, FirmantesTemplateComponent, ViewTemplateComponent,CreateFolderComponent,
      ListFoldersComponent,ShareDocComponent,FinishSignComponent,ListaMasivaComponent,CreateTeamComponent, ListCompanyUsersComponent, RejectSignComponent],
    entryComponents: [AppPdfViewerComponent, AgregarFirmaComponent,
                      PinFirmadorComponent, AyudaFirmaComponent,
                      TerminosComponent, EditarFirmanteComponent,
                      SubirPlantillaComponent, FirmantesTemplateComponent, ViewTemplateComponent, MensajesComponent,CreateFolderComponent,
                      ListFoldersComponent,ShareDocComponent,FinishSignComponent,ListaMasivaComponent,CreateTeamComponent, ListCompanyUsersComponent, RejectSignComponent],
    providers: [TitleCasePipe, {provide: ErrorHandler, useClass: AppErrorHandler}],
    bootstrap: [AppComponent]
})
export class AppModule { }
