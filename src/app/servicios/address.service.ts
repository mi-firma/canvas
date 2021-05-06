import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddress } from '../interfaces/address.interface';
import { GetReceiver } from '../modelos/Base/receiver.model';
import { map } from 'rxjs/operators';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization': `Basic ${environment.BasicToken}`,
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<IAddress[]> {
      return this.httpClient.get<GetReceiver<IAddress[]>>(`${apisMiFirma.authGateway}Gateway/api/v1_0/address/getall`, httpOptions)
        .pipe(map(res => res.data));
  }

  create(data: any): Observable<any> {
      data.phone = '3152201335';
      return this.httpClient.post(`${apisMiFirma.authGateway}Gateway/api/v1_0/address/add`, data, httpOptions);
  }

  setDefault(id: number): Observable<any> {
    return this.httpClient.put(`${apisMiFirma.authGateway}Gateway/api/v1_0/address/setdefault/${id}`, null, httpOptions);
  }
}
