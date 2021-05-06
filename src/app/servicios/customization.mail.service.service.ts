import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apisMiFirma } from 'src/environments/environment';
import { PersonaMailConfig } from '../modelos/personaMailConfig.model';

const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
});

@Injectable({
  providedIn: 'root'
})
export class CustomizationMailServiceService {

  constructor(private httpClient: HttpClient) { }

  GetPersonaMailConfig() {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v2_0/personaMailConfig/Get`, httpOptions());
  }

  AddPersonaMailConfig(model: any) {
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v2_0/personaMailConfig/Add`, model, httpOptions());
  }

  UpdatePersonaMailConfig(model: any) {
    return this.httpClient.put(apisMiFirma.GatewayMiFirma + `Gateway/api/v2_0/personaMailConfig/Update`, model, httpOptions());
  }

  DeletePersonaMailConfig(id: string) {
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v2_0/personaMailConfig/Delete?id=${id}`, httpOptions());
  }



}
