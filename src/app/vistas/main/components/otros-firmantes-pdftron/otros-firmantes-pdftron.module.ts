import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OtrosFirmantesPDFTRONComponent } from './otros-firmantes-pdftron.component';
import { AppSharedModule } from 'src/app/shared/app-shared.module';

const routes: Routes = [
    { path: '', component: OtrosFirmantesPDFTRONComponent }
];

@NgModule({
    declarations: [OtrosFirmantesPDFTRONComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        PdfViewerModule,
        AppSharedModule,
        RouterModule.forChild(routes)
    ]
})
export class OtrosFirmantesPDFTRONModule { }
