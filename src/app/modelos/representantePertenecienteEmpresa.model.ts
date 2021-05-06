export class PertenecienteEmpresa {
  nit: string;
  razonSocial: string;
  departamentoId: number;
  ciudadId: number;
  areaEmpleado: string;
  posicionEmpleado: string;
  direccionFisica: string;
  correo: string;
  telefono: string;

  constructor(nit: string, razonSocial: string, departamentoId: number, ciudadId: number, areaEmpleado: string, posicionEmpleado: string, direccionFisica: string, correo: string, telefono: string) {
    this.nit = nit;
    this.razonSocial = razonSocial;
    this.departamentoId = departamentoId;
    this.ciudadId = ciudadId;
    this.areaEmpleado = areaEmpleado;
    this.posicionEmpleado = posicionEmpleado;
    this.direccionFisica = direccionFisica;
    this.correo = correo;
    this.telefono = telefono;
  }
}
