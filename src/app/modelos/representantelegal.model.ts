export class RepresentanteLegal {
  nit: string;
  razonSocial: string;
  correoEmpresarial: string;
  departamentoId: number;
  ciudadId: number;
  direccion: string;
  telefono: string;
  legalRepArea: string;

  constructor(nit: string, razonSocial: string, correoEmpresarial: string, deparId: number, ciuId: number, direccion: string, telefono: string, legalRepArea: string) {
    this.nit = nit;
    this.razonSocial = razonSocial;
    this.correoEmpresarial = correoEmpresarial;
    this.departamentoId = deparId;
    this.ciudadId = ciuId;
    this.direccion = direccion;
    this.telefono = telefono;
    this.legalRepArea = legalRepArea;
  }
}
