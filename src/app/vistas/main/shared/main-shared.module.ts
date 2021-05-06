import { NgModule } from '@angular/core';
import { MAIN_SHARED_COMPONENTS } from '.';
import { SharedModule } from 'src/app/custom-modules/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [...MAIN_SHARED_COMPONENTS],
  declarations: [...MAIN_SHARED_COMPONENTS]
})
export class MainSharedModule { }
