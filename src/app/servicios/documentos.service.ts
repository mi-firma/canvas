import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
export class DocumentosService {
  constructor(private httpClient: HttpClient) { }

  listarDocumentos() {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + 'Gateway/api/v1_0/document/getAll', httpOptions());
  }

  listarDocumentos2(nPage: number, pageSize: number, word?: string) {
    if (!word) {
      word = ''
    }
    const data = {
      parametro: word,
      page: nPage,
      pageSize: pageSize
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/getAllDocumentsEnvelope', data, httpOptions());
  }

  listarDocumentosFolder(nPage: number, pageSize: number, email: string, idFolder: string, word?: string) {
    if (!word) {
      word = ''
    }
    const data = {
      userName: email,
      identificationEnvelope: idFolder,
      parametro: word,
      page: nPage,
      pageSize: pageSize
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v1_0/envelope/userDocumentsByEnvelope', data, httpOptions());
  }

  unlockDocuments(guids:Array<string>){
    const data = {
      serialDocument: guids
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/unlock', data, httpOptions());
  }

  shareDocument(serialDoc: string, name: string, docs: Array<any>) {
    const data = {
      documentSerial: serialDoc,
      personName: name,
      recipients: docs
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/document/sendDocumentEmailToUsers', data, httpOptions());
  }

  downloadFolder(idFolder: string, user: string) {
    const data = {
      userName: user,
      identificationEnvelope: idFolder
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + 'Gateway/api/v2_0/envelope/userDocumentsByEnvelope', data, httpOptions());
  }

  recuperarDocumento(serial: string) {
    return this.httpClient.get(apisMiFirma.ApiManager + `api/v1_0/document/download?documentId=${serial}`, httpOptions2());
  }

  deleteDocument(serial:string){
    const httpOptions3 = () => ({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }),
      body: {
        serialDocument: serial
      }
    });
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/document/delete`, httpOptions3());
  }

  docHaveSign(base64: string) {
    const data = {
      documentBase64: base64
    }
    return this.httpClient.post(apisMiFirma.GatewayFirma + `Gateway/api/v1_0/ESignature/ValidateExistSigns`, data);
  }


  //API ENVELOPES

  createEnvelope(name: string) {
    const data = {
      envelopeName: name
    }
    return this.httpClient.post(apisMiFirma.ApiManager + `api/v1_0/envelope/create`, data, httpOptions2());
  }

  updateEnvelope(name: string, id: string,) {
    const data = {
      envelopeName: name,
      envelopeId: id
    }
    return this.httpClient.put(apisMiFirma.ApiManager + `api/v1_0/envelope/edit`, data, httpOptions2());
  }

  associateFile(id: string, documents: Array<any>) {
    const data = {
      envelopeId: id,
      listDocumentId: documents
    }
    return this.httpClient.post(apisMiFirma.ApiManager + `api/v1_0/envelope/file/associate`, data, httpOptions2());
  }

  disassociateFile(id: string, documents: Array<any>) {
    const data = {
      envelopeId: id,
      listDocumentId: documents
    }
    return this.httpClient.post(apisMiFirma.ApiManager + `api/v1_0/envelope/file/disassociate`, data, httpOptions2());
  }

  listEnvelopes() {
    return this.httpClient.get(apisMiFirma.ApiManager + `api/v1_0/envelope/user/envelope/list`, httpOptions2());
  }

  filesEnvelope(id: string) {
    return this.httpClient.get(apisMiFirma.ApiManager + `api/v1_0/envelope/user/byEnvelope/list/${id}`, httpOptions2());
  }

  deleteEnvelope(nameFolder: string, user: string) {
    const httpOptions3 = () => ({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }),
      body: {
        nameEnvelope: nameFolder,
        userName: user
      }
    });
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/envelope/delete`, httpOptions3());
  }
  rejectSign(serial: string, comment: string) {
    const data = {
      serialDocument: serial,
      reason: comment
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/document/reject`, data, httpOptions());
  }

}
