import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const modules: any[] = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgbModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  declarations: [],
  providers: []
})
export class SharedModule { }
