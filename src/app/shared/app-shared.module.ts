import { NgModule } from '@angular/core';
import { SHARED_COMPONENTS, SHARED_PIPES } from '.';
import { SharedModule } from 'src/app/custom-modules/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatSelectModule } from '@angular/material';

@NgModule({
    imports: [SharedModule, SignaturePadModule, NgxFileDropModule, MatSelectModule],
    exports: [...SHARED_COMPONENTS, ...SHARED_PIPES],
    declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES]
})
export class AppSharedModule { }
