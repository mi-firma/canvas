import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPlan } from '../interfaces/plan.interface';

@Injectable({
  providedIn: 'root'
})

export class FiledataService {
  private filesData = new BehaviorSubject<any[]>([]);
  private registroIni = new BehaviorSubject<any[]>([]);
  private firmantes = new BehaviorSubject<any[]>([]);
  private pdfsrc = new BehaviorSubject<Uint8Array>(new Uint8Array);
  private certificado = new BehaviorSubject<any>({});
  private pdfOri = new BehaviorSubject<any>({});
  private grafo = new BehaviorSubject<any>({});
  private plan = new BehaviorSubject<IPlan>(null);
  private terminos = new BehaviorSubject<any[]>([]);
  private inOrder = new BehaviorSubject<boolean>(null);
  private tokenTerminos = new BehaviorSubject<string>('');
  private infoMasiv = new BehaviorSubject<any[]>([]);
  private allFiles = new BehaviorSubject<any[]>([]);
  private allFilesConfig = new BehaviorSubject<any[]>([]);
  filesListener$ = this.filesData.asObservable();
  registroIniListener$ = this.registroIni.asObservable();
  firmantesListener$ = this.firmantes.asObservable();
  pdfsrcListener$ = this.pdfsrc.asObservable();
  certificadoListener$ = this.certificado.asObservable();
  pdfOriListener$ = this.pdfOri.asObservable();
  grafoListener$ = this.grafo.asObservable();
  planListener$ = this.plan.asObservable();
  terminosListener$ = this.terminos.asObservable();
  inOrderListener$ = this.inOrder.asObservable();
  tokenTerminosListener$ = this.tokenTerminos.asObservable();
  infoMasivListener$ = this.infoMasiv.asObservable();
  allFilesListener$ = this.allFiles.asObservable();
  allFilesConfigListener$ = this.allFilesConfig.asObservable();

  constructor(private http: HttpClient) { }

  addFiles(arr: any[]) {
    this.filesData.next(arr);
  }

  addFirmantes(arr: any[]) {
    this.firmantes.next(arr);
  }

  addPdf(string: Uint8Array) {
    this.pdfsrc.next(string);
  }

  addCertificado(certificado: any) {
    this.certificado.next(certificado);
  }

  addPdfOri(pdf: any) {
    this.pdfOri.next(pdf);
  }

  addGrafo(gr: any) {
    this.grafo.next(gr);
  }

  addRegistroIni(arr: any[]) {
    this.registroIni.next(arr);
  }

  getIp() {
    return this.http.get('https://jsonip.com');
  }

  addPlan(plan: IPlan) {
    this.plan.next(plan);
  }
  terms(arr: any[]) {
    this.terminos.next(arr);
  }

  getDocumentBlob( url ) {
    return this.http.get(url, {responseType:"blob"} );
  }

  signInOrder(bool:boolean){
    this.inOrder.next(bool)
  }

  tokenTerms(token: string) {
    this.tokenTerminos.next(token);
  }

  signMasiv(arr:any[]){
    this.infoMasiv.next(arr)
  }

  addAllFiles(arr: any[]) {
    this.allFiles.next(arr);
  }

  addFilesConfig(arr: any[]) {
    this.allFilesConfig.next(arr);
  }
}
