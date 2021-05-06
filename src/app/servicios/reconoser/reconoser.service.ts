import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IRcsValidationRequest } from 'src/app/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ReconoserService {
    headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    isReconoserEnabled() {
        return this.http.get(`Reconoser/isReconoserEnabled`);
    }

    getToken() {
        return this.http.post(
            'https://demorcs.olimpiait.com:6314/TraerToken',
            {
                clientId: environment.reconoserClientId,
                clientSecret: environment.reconoserClientSecret
            },
            {
                headers: this.headers
            }
        ).subscribe((res: any) => {
            if (res.accessToken) {
                localStorage.setItem('rcsToken', res.accessToken);
            }
        });
    }

    validationRequest(data: any): Observable<IRcsValidationRequest> {
        this.headers = this.headers.set('Authorization', 'Bearer ' + localStorage.getItem('rcsToken'));

        return this.http.post(
            'https://demorcs.olimpiait.com:6314/Validacion/SolicitudValidacion', data, {
            headers: this.headers
        }
        ).pipe(
            map((res: any) => res.data)
        );
    }

    validateFinishRequest(guidProcessData: any): Observable<any> {
        this.headers = this.headers.set('Authorization', 'Bearer ' + localStorage.getItem('rcsToken'));

        return this.http.post(
            'https://demorcs.olimpiait.com:6314/Validacion/ConsultarValidacion', guidProcessData, {
            headers: this.headers
        }
        );
    }
}
