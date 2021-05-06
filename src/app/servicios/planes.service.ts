import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlan } from '../interfaces/plan.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {
  constructor(private httpClient: HttpClient) { }

    GetPlanes(): Observable<IPlan[]> {
        return this.httpClient.get<IPlan[]>(`Firmador/ListarPlanes/`);
    }
}
