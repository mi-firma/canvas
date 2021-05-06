import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'TokenCustomer': 'Bearer ' + localStorage.getItem("token")
  })
});

const httpOptions2 = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization' : `Basic ${environment.BasicToken}}`,
    'TokenCustomer': 'Bearer ' + localStorage.getItem("token")
  })
});

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(private httpClient: HttpClient) { }

  obtenerExpediente(serial: string) {
    const data = {
      documentId: serial,
      macroProcessId: '',
      documentProcessId: ''
    };
    return this.httpClient.post(apisMiFirma.ApiManager + `api/v1_0/trace`, data, httpOptions2());
  }
}
