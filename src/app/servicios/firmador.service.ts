import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Firma } from '../modelos/firma.model';
import { Destinatario } from '../modelos/destinatario.model';
import { apisMiFirma, environment } from 'src/environments/environment';
import { file } from 'jszip';
import { stringify } from '@angular/compiler/src/util';

const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  })
});

const httpOptions2 = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization': `Basic ${environment.BasicToken}`,
    'TokenCustomer': `Bearer ${localStorage.getItem('token')}`
  })
});

@Injectable({
  providedIn: 'root'
})
export class FirmadorService {
  constructor(private httpClient: HttpClient) { }

  ListarGrafo() {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/graph/getAll`, httpOptions());
  }

  AdicionarGrafo(base64: string, nombreGrafo: string, tipo: string) {
    const data = {
      file: base64,
      fileName: nombreGrafo,
      fileExtension: tipo
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/graph/save`, data, httpOptions());
  }

  EliminarGrafo(grafoGuid: string) {
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/graph/delete/${grafoGuid}`, httpOptions());
  }

  ConfigurarFirma(file: string, tipoProceso: number,
    fileName: string, destinatarios: Array<Destinatario>, firmas: Array<Firma>, ipAdress: string, pagesCount: number, timeZone: string) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const data = {
      fileData: file,
      fileName: fileName,
      ipAdress: ipAdress,
      timeZone: timeZone,
      pages: pagesCount,
      signatureProcessType: tipoProceso,
      signatureExecutionType: 2,
      signers: destinatarios,
      signatures: firmas
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v1_0/documents', data, httpOptions());
  }

  ConfigurarFirma3(file: string, tipoProceso: number,
    fileName: string, destinatarios: Array<Destinatario>, firmas: Array<Firma>, ipAdress: string, pagesCount: number, timeZone: string, otherSigners: object, email: string, envelopeId: string) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const data = {
      fileData: file,
      fileName: fileName,
      ipAdress: ipAdress,
      timeZone: timeZone,
      userName: email,
      pages: pagesCount,
      signatureProcessType: tipoProceso,
      signatureExecutionType: 2,
      envelopeId: envelopeId,
      //signers: destinatarios,
      othersSigners: otherSigners,
      signatures: firmas
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/create', data, httpOptions());
  }

  ConfigurarFirmaMasivo(grafoGuid: string, ipAdress: string, timeZone: string, tipoProceso: number, documents: Array<any>) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const data = {
      graphGuid: grafoGuid,
      ipAdress: ipAdress,
      timeZone: timeZone,
      signatureProcessType: tipoProceso,
      signatureExecutionType: 2,
      documentsSigns: documents
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/massiveCreate', data, httpOptions());
  }

  ConfigurarFirma2(fileid: string, destinatarios: Array<Destinatario>, firmas: Array<Firma>) {
    const documents = [];
    const users = []
    for (let i = 0; i < firmas.length; i++) {
      const data = {
        sign: {
          order: firmas[i].order,
          graphX: firmas[i].x,
          graphY: firmas[i].y,
          highGraph: firmas[i].height,
          weightGraph: firmas[i].width,
          numberPageGraph: firmas[i].page
        },
        user: destinatarios[i].email
      }
      users.push(data)
    }
    const doc = {
      documentId: fileid,
      users: users
    }
    documents.push(doc)
    const data = {
      documents: documents
    };
    return this.httpClient.post(apisMiFirma.ApiManager + 'api/v1_0/signature/settings', data, httpOptions2());
  }

  ConfigurarFirma4(file: string, tipoProceso: number,
    fileName: string, firmas: Array<Firma>, ipAdress: string, pagesCount: number, timeZone: string, otherSigners: object, email: string, envelopeId: string,isMacro:boolean,guidMacro:string,lastMacro:boolean) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const data = {
      isMacroProcess: isMacro,
      processMacroGuid: guidMacro,
      isSignLast: lastMacro,
      fileData: file,
      fileName: fileName,
      ipAdress: ipAdress,
      timeZone: timeZone,
      userName: email,
      pages: pagesCount,
      signatureProcessType: tipoProceso,
      signatureExecutionType: 2,
      envelopeId: envelopeId,
      othersSigners: otherSigners,
      signatures: firmas
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v3_0/document/create', data, httpOptions());
  }
  uploadDoc(filename: string, filebase64: string) {
    const data = {
      fileName: filename,
      fileBase64: filebase64
    }
    return this.httpClient.post(apisMiFirma.ApiManager + 'api/v1_0/document/upload', data, httpOptions2());
  }

  getToSign(infopro: string) {
    const data = {
      infoProcess: infopro
    }
    return this.httpClient.post(apisMiFirma.ApiManager + 'api/v1_0/documents/getToSign', data, httpOptions2());
  }

  EjecutarFirma(solicitudFirmaGuid: string, signerName: string, grafoGuid: string,
    fileData: string, documentoSerial: string, ipAddress: string, timeZone: string, otp?: string, isMassive?:boolean) {
    const data = {
      signatureRequestGuid: solicitudFirmaGuid,
      signerName,
      fileData,
      documentSerial: documentoSerial,
      graphGuid: grafoGuid,
      ipAddress,
      timeZone,
      otp,
      isAMassiveSignature: isMassive
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/sign', data, httpOptions());
  }

  ObtenerDocumento(guidFirma: string) {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/document/getDocumentToSign/${guidFirma}`, httpOptions());
  }

  ObtenerDocumentoV2(guidFirma: string) {
    const data = {
      infoProcess: guidFirma
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v2_0/document/getDocumentsToSign/`, data, httpOptions());
  }

  ObtenerFirmantesDocumento(guidFirmantes: string) {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/signer/getSigners/${guidFirmantes}`, httpOptions());
  }

  ObtenerFirmasDisponibles(identificacion: string) {
    const data = {
      tipoIdentificacionNombre: 'CC',
      personaIdentificacion: identificacion
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Firmador/ObtenerCantidadFirmas/`, data, httpOptions());
  }

  EnviarRecordatorio(guidFirma: string, nombreFirmante: string, nombreSolicitante: string, nombreDocumento: string, correo: string, notificacionId: number, opcionCorreo: number) {
    const data = {
      requestToken: guidFirma,
      signerName: nombreFirmante,
      requesterName: nombreSolicitante,
      fileName: nombreDocumento,
      email: correo,
      notificacionContactoId: notificacionId,
      emailOption: opcionCorreo
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/signer/sendReminder`, data, httpOptions());
  }

  ActualizarPersona(solicitudFirmaToken: string, correo: string) {
    const data = {
      token: solicitudFirmaToken,
      email: correo
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/signer/update/email`, data, httpOptions());
  }

  EliminarFirmante(solicitudFirmaToken: string) {
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/signer/delete/${solicitudFirmaToken}`, httpOptions());
  }

  changeStateSign(array: any) {
    const data = {
      associateGraphRequests: array
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/signer/changeSignState`, data, httpOptions());
  }
}
