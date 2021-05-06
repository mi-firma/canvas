import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TarjetaCredito } from '../modelos/tarjetacredito.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PagosService {
    constructor(private httpClient: HttpClient) { }

    pagarConTarjetaCredito(personaId: number, planId: number, direccionIP: string, tarjetaCredito: TarjetaCredito, cuotas: number, guardarTC: boolean) {
        const data = {
            personaId: personaId,
            planId: planId,
            direccionIPComprador: direccionIP,
            informacionTarjetaCredito: tarjetaCredito,
            numeroCuotasPago: cuotas,
            guardarTarjetaParaPagosFuturos: guardarTC
        };
        return this.httpClient.post(`Pagos/PagarConTarjetaDeCredito/`, data, httpOptions);
    }

    obtenerHistorialDeRecargas(Id: number) {
        const data = {
            personaId: Id
        };
        return this.httpClient.post(`Pagos/ObtenerHistorialDeRecargas/`, data, httpOptions);
    }

    pagarConPSE(personaId: number, planId: number, tipoPersona: string, bancoId: number) {
        const data = {
            personaId: personaId,
            planId: planId,
            tipoPersona: tipoPersona,
            bancoId: bancoId
        };
        return this.httpClient.post('Pagos/PagarPorPSE/', data, httpOptions);
    }

    guardarTarjetaCredito(personaId: number, tarjetaCredito: TarjetaCredito) {
        const data = {
            personaId: personaId,
            informacionTarjetaCredito: {
                franquiciaTarjeta: tarjetaCredito.franquiciaTarjeta,
                fechaExpiracion: tarjetaCredito.fechaExpiracion,
                numeroTarjeta: tarjetaCredito.numeroTarjeta,
                codigoVerificacionTarjeta: tarjetaCredito.codigoVerificacionTarjeta
            }
        };
        return this.httpClient.post('Pagos/GuardarTarjetaCredito/', data, httpOptions);
    }

    obtenerTarjetasCredito(personaId: number) {
        const data = {
            personaId: personaId
        };
        return this.httpClient.post('Pagos/ObtenerTarjetasCredito/', data, httpOptions);
    }

    pagarConTarjetaCreditoGuardada(personaId: number, planId: number, franquiciaTarjeta: string, numeroTarjetaEnmascarado: string, cuotas: number) {
        const data = {
            personaId: personaId,
            planId: planId,
            franquiciaTarjeta: franquiciaTarjeta,
            numeroTarjetaEnmascarado: numeroTarjetaEnmascarado,
            numeroCuotasPago: cuotas
        };
        return this.httpClient.post('Pagos/PagarConTarjetaCreditoGuardada/', data, httpOptions);
    }

    eliminarTarjetaCredito(personaId: number, franquiciaTarjeta: string, numeroTarjetaEnmascarado: string) {
        const data = {
            personaId: personaId,
            franquiciaTarjeta: franquiciaTarjeta,
            numeroTarjetaEnmascarado: numeroTarjetaEnmascarado
        };
        return this.httpClient.delete('Pagos/EliminarTarjetaCredito');
    }

    getBancos() {
        return this.httpClient.get(`Pagos/ObtenerBancos/`);
    }
}
