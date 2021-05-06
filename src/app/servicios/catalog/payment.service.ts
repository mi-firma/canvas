import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetReceiver } from '../../modelos/Base/receiver.model';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'CommerceAuthorization': `Basic ${environment.CatalogBasicToken}`,
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private httpClient: HttpClient) { }

    addOrder(purchase: any): Observable<any> {
        return this.httpClient.post<GetReceiver<any>>(`${apisMiFirma.CatalogGateway}Gateway/api/v1_0/Order/Add`, purchase, httpOptions)
          .pipe(map(res => res.data));
    }
}

