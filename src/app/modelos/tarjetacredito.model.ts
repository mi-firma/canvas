export class TarjetaCredito {
  nombreTitularTarjeta: string;
  franquiciaTarjeta: string;
  fechaExpiracion: string;
  numeroTarjeta: string;
  codigoVerificacionTarjeta: string;

  constructor(nombreTitularTarjeta: string, franquicia: string, fechaExp: string, numero: string, cvc: string) {
    this.nombreTitularTarjeta = nombreTitularTarjeta;
    this.franquiciaTarjeta = franquicia;
    this.fechaExpiracion = fechaExp;
    this.numeroTarjeta = numero;
    this.codigoVerificacionTarjeta = cvc;
  }
}
