import { NgModule } from '@angular/core';
import { AppLayoutMainComponent } from './layout-main/layout-main.component';
import { AppLayoutComponent } from './layout/layout.component';
import { AppNavComponent } from './nav/nav.component';
import { LoaderComponent } from './loader/loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../core/interceptors/loader.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { AppConfigurationLayoutComponent } from './ConfigurationLayout/configurationlayout.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../custom-modules/shared.module';

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppLayoutMainComponent,
    AppNavComponent,
    LoaderComponent,
    AppConfigurationLayoutComponent
  ],
  imports: [
    SharedModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      closeButton: true,
      tapToDismiss: true,
      timeOut: 5000,
      easeTime: 1000,
      progressBar: true,
      progressAnimation: 'decreasing',
      maxOpened: 1,
      autoDismiss: true
    }),
  ],
  exports: [
    LoaderComponent,
    AppNavComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})

export class AppLayoutsModule { }
