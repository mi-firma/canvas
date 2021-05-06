export class Firma {
    id: number;
    order: number;
    requiresPassword: boolean;
    requiresDigitalSignature: boolean;
    requiresSMS: boolean;
    password: string;
    notificationType: number;
    name: string;
    email: string;
    phoneNumber: number;
    x: number;
    y: number;
    height: number;
    width: number;
    page: number;
    signatureAnnotations: string;
    daysAutoReminder: number;
    isAMassiveSignature: boolean;

    constructor(id: number, orden: number, requierePassword: boolean, requiereSMS: boolean,
                password: string, tipoNotificacion: number, nombre: string, correo: string, telefono: number,
                grafoX: number, grafoY: number, grafoAlto: number, grafoAncho: number, grafoPaginaNumero: number,
                requiereFirmaDigital: boolean, diasRecordatorio: number) {

        this.id = id;
        this.order = orden;
        this.requiresPassword = requierePassword;
        this.requiresDigitalSignature = requiereFirmaDigital;
        this.requiresSMS = requiereSMS;
        this.password = password;
        this.notificationType = tipoNotificacion;
        this.name = nombre;
        this.email = correo;
        this.phoneNumber = telefono;
        this.x = grafoX;
        this.y = grafoY;
        this.height = grafoAlto;
        this.width = grafoAncho;
        this.page = grafoPaginaNumero;
        this.daysAutoReminder = diasRecordatorio;
    }
}
