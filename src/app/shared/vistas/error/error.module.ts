import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from './error.component';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { LottieAnimationViewModule } from 'ng-lottie';

const routes: Routes = [
    { path: "", component: ErrorComponent }
];

@NgModule({
    declarations: [ErrorComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        AppSharedModule,
        RouterModule.forChild(routes),
        LottieAnimationViewModule.forRoot()
    ]
})
export class ErrorModule { }
