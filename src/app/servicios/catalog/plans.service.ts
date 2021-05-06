import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPlan } from '../../interfaces/plan.interface';
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
export class PlansService {
  constructor(private httpClient: HttpClient) { }

    getPlans(code: string): Observable<IPlan[]> {
      return this.httpClient.get<GetReceiver<IPlan[]>>(`${apisMiFirma.CatalogGateway}Gateway/api/v1_0/Package/PackageGroup/getAll/${code}`, httpOptions)
        .pipe(map(res => res.data));
    }
}
