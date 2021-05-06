import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    activeRequests = 0;

    /**
     * URLs for which the loading screen should not be enabled
     */
    skippUrls = [
        '/authrefresh',
        'Certificados/ValidarPINCertificado/'
    ];

    constructor(private cargardorService: LoaderService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let displayLoadingScreen = true;

        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }

        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.cargardorService.startLoading();
            }
            this.activeRequests++;

            return next.handle(request).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.cargardorService.stopLoading();
                    }
                })
            );
        } else {
            return next.handle(request);
        }
    }
}
