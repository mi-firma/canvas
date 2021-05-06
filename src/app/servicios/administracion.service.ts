import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  constructor(private httpClient: HttpClient) { }

  Certificados(tipoIdentificacion: number, cedula: number) {
    return this.httpClient.get(`Administracion/Certificados/${tipoIdentificacion}/${cedula}`);
  }

  obtenerPersonaUbicaciones(tipoDocumento: number, numeroDocumento: string) {
    return this.httpClient.get(`Administracion/ObtenerPersonaUbicaciones/${tipoDocumento}/${numeroDocumento}`);
  }
}
