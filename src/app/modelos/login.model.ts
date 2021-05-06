export class LoginRequest {
    documentoIdentificacion: number;
    textoOTP: string;
}
export class OTPValidationResponse {
    esValidoOTP: boolean;
    intentosRestantes: number;
    empresas: EmpresasLogin[];
    loginToken: string;
    mensaje: string;
}

export class EmpresasLogin {
    id: number;
    empresaRazonSocial: string;
    empresaIdentificacion: number;
    empresaIdentificacionCodigo: number;
    empresaLogo: string;
    tipoPersona: number;
    certificadoActivo: boolean;
    vigenciaCertificado: boolean;
}

export class SessionTokenModel {
    sessionToken: string;
    identificacion: string;
}
