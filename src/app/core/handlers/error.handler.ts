import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '../../servicios/applicationInsights/monitoring.service';
import { SessionService } from 'src/app/servicios';

@Injectable({ providedIn: 'root' })
export class AppErrorHandler extends ErrorHandler {
  constructor(
    private readonly injector: Injector,
    private monitoringService: MonitoringService) {
    super();
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401: {
          const sessionService = this.injector.get<SessionService>(SessionService);
          sessionService.logout();
          break;
        }
        default: {
          const router = this.injector.get<Router>(Router);
          router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          break;
        }
      }
    }

    console.error(error);
    this.monitoringService.logException(error);
  }
}
