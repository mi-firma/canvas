import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule
    ],
    exports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule,
        HttpClientModule
    ]
})
export class CoreModule { }
