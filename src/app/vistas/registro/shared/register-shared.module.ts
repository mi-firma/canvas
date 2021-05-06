import { NgModule } from '@angular/core';
import { REGISTER_SHARED_COMPONENTS } from '.';

@NgModule({
    imports: [],
    exports: [...REGISTER_SHARED_COMPONENTS],
    declarations: [...REGISTER_SHARED_COMPONENTS]
})
export class RegisterSharedModule { }
