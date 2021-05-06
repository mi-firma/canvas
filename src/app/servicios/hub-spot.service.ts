import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HubSpotService {
    private urlCreateContac = 'https://api.hubapi.com/contacts/v1/contact/?hapikey=';
    private urlUpdateContac = 'https://api.hubapi.com/contacts/v1/contact/email/testingapis@hubspot.com/profile?hapikey=demo';
    private claveApi = 'aa3eb1e2-f1b9-404a-b1f2-74af739a05ee';

    constructor(
        private http: HttpClient,
        private router: Router) { }

    crearContacto(JsonContacto) {
        const url = this.urlCreateContac + this.claveApi;
        const parametros = JsonContacto;
        return this.EnvioPeticion(url, parametros);
    }

    private EnvioPeticion(url, parametros) {
        // const httpHeaders = new HttpHeaders({
        //   'Content-Type': 'application/json'
        // });
        // const options = {
        //   headers: httpHeaders
        // };

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<any>(url, parametros, httpOptions)
            .pipe(
                map((resp) => {
                    const respJson = typeof (resp) === 'object' ? resp : JSON.parse(resp);
                    return respJson;
                })
            );
    }
}
