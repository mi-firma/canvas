import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma } from 'src/environments/environment';
import { Router } from '@angular/router';

const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  })
});

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) { }

  IsFirstSession(email: string) {
    return this.httpClient.post(apisMiFirma.GatewayMiFirma+`Gateway/api/v1_0/user/reviewFirstSession/${email}`, httpOptions());
  }

  get userId(): string {
    return localStorage.getItem('personaId');
  }

  get authId(): string {
    return localStorage.getItem('authId');
  }

  get identificadorOtp(): string {
    return localStorage.getItem('identificadorOTP');
  }

  get recoRestrictive(): string {
    return localStorage.getItem('reconoserRestrictive');
  }

  get otpRestrictive(): string {
    return localStorage.getItem('otpRestrictive');
  }

  get username(): string {
    return localStorage.getItem('personaNombre');
  }

  get documentUser(): string {
    return localStorage.getItem('documento');
  }

  get emailUser(): string {
    return localStorage.getItem('correo');
  }

  get reconoserGuid(): string {
    return localStorage.getItem('reconoserGuid');
  }

  get reconoserUrl(): string {
    return localStorage.getItem('reconoserUrl');
  }

  get validarOtp(): string {
    return localStorage.getItem('validarOtp');
  }

  get phoneUser(): string {
    return localStorage.getItem('celular');
  }

  get phoneUser2(): string {
    return localStorage.getItem('phoneUser');
  }

  get isLogged(): boolean {
    return localStorage.getItem('token') != null;
  }

  get isRequestPending(): boolean {
    return localStorage.getItem('pendingRequest') != null;
  }

  get isANoob(): boolean {
    return localStorage.getItem('noob') === '1';
  }

  get isPinAllowed(): boolean {
    console.log(localStorage.getItem('pinAllowed'));
    return localStorage.getItem('pinAllowed') != null;
  }

  get isNoobNull(): boolean {
    return localStorage.getItem('noob') == null;
  }

  set signatureGuid(value: string) {
    localStorage.setItem('firma', value);
  }

  logout(guidFirma?: string): void {
    let noob = localStorage.getItem('noob');
    if (noob == null) {
        noob = '1';
    }
    let blocked = localStorage.getItem('blocked')
    let idCompany = localStorage.getItem('idCompany')
    let idWorkGroup = localStorage.getItem('idWorkGroup')
    localStorage.clear();
    if(blocked != null){
      localStorage.setItem('blocked',blocked);
    }
    if(idCompany != null && idWorkGroup != null){
      localStorage.setItem('idCompany',idCompany);
      localStorage.setItem('idWorkGroup',idWorkGroup);
    }
    localStorage.setItem('noob', noob);
    if (guidFirma) {
      localStorage.setItem('firma', guidFirma);
    }
    this.router.navigateByUrl('')
  }
}
