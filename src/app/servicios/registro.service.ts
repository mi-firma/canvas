import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  constructor(private httpClient: HttpClient) { }

  registrarUsuario(tipoIdentificacion: number, identificacion: number, correo: string, celular: number, fechaExpedicion: string) {
    const data = {
      tipoIdentificacionId: tipoIdentificacion,
      personaIdentificacion: identificacion,
      personaCorreo: correo,
      personaCelular: celular,
      personaFechaExpedicion: fechaExpedicion
    };
    return this.httpClient.post(`Registro/RegistrarUsuario/`, data, httpOptions);
  }

  /**
   * Metodo que valida el usuario al ingresar el OTP
   */
  validarUsuario(personaId: number, identificacionOTP: string, textoOTP: string, tipoIdentificacion: number,
    numeroIdentificacion: number) {
    const data = {
      personaId: personaId,
      identificacionOTP: identificacionOTP,
      textoOTP: textoOTP,
      tipoIdentificacion: tipoIdentificacion,
      numeroIdentificacion: numeroIdentificacion
    };
    return this.httpClient.post(`Registro/ValidarUsuario/`, data, httpOptions);
  }

  /**
   * Metodo que guarda en el flujo de registro los datos basicos de usuario
   */
  ubicacion(personaId: number, direccion: string, direccionComplemento: string, ciudadId: number, ciudadNombre: string, departamentoId: number, departamentoNombre: string) {
    const data = {
      personaId: personaId,
      ubicacion: {
        direccion: direccion,
        direccionComplemento: direccionComplemento,
        ciudadId: ciudadId,
        ciudadNombre: ciudadNombre,
        departamentoId: departamentoId,
        departamentoNombre: departamentoNombre
      }
    };
    return this.httpClient.post(`Registro/Ubicacion/`, data, httpOptions);
  }
}
