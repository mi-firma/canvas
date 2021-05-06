export interface ICertificate {
  cantidadFirmas?: number;
  certificadoConfigurado?: boolean;
  fechaVigencia?: string;
  id?: number;
  idTipoCertificado?: number;
  nit?: string;
  razonSocialEmpresa?: string;
  serial?: string;
  tipoCertificado: string;
}
