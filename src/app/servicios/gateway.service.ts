import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization': `Basic ${environment.BasicToken}`
  })
};

const httpOptions2 = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization': `Basic ${environment.BasicToken}`,
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  })
});

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  constructor(private httpClient: HttpClient) { }

  validateDocument(cedula: number, camera: boolean) {
    return this.httpClient.get(`Gateway/validateDocument/${cedula}/${camera}`);
  }

  getLoginToken(personaId: number) {
    return this.httpClient.get(`Gateway/LoginToken/${personaId}`);
  }
  validarFacial(guid: string) {
    return this.httpClient.get(`Gateway/ValidarFacial/${guid}`);
  }
  generarOtp(cedula: number) {
    return this.httpClient.get(`Gateway/GenerarOtp/${cedula}`);
  }
  validarOtp(guidOtp: string, TextoOTP: string) {
    const data = {
      text: TextoOTP,
      identifier: guidOtp
    }
    return this.httpClient.post(`Gateway/ValidarOtp/`, data, httpOptions);
  }

  createCustomer(name: string, lastname: string, password: string, user: string, mobile: string, ip: string, terms: Array<number>) {
    const data = {
      firstName: name,
      lastName: lastname,
      password: password,
      user: user,
      customerMobile: mobile,
      publicIP: ip,
      listTerms: terms
    }
    return this.httpClient.post(apisMiFirma.Gateway + `Gateway/api/v2_0/createCustomer`, data, httpOptions);
  }
  validateUser(user: string, phonenumber: string, ip: string, browser: string, userAgent: string, os: string, mobile: boolean, tablet: boolean,
    desktop: boolean, camera: boolean, secondcamera: boolean, fingerprint: boolean, processCode?: number, authId?:string) {
    const data: any = {
      user: user,
      phoneNumber: phonenumber,
      deviceInfo: {
        publicIp: ip,
        browser: browser,
        os: os,
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: desktop,
        hasCamera: camera,
        hasSecondaryCamera: secondcamera,
        hasFingerprintReader: fingerprint
      }
    }
    if (processCode) data.processCode = processCode;
    if (authId) data.authId = authId;

    return this.httpClient.post(apisMiFirma.Gateway + `Gateway/api/v2_0/validate/user`, data, httpOptions);
  }
  validate(guid: string, data: string) {
    const val = {
      guid: guid,
      data: data
    }
    return this.httpClient.post(`${apisMiFirma.Gateway}Gateway/api/v2_0/validate`, val, httpOptions);
  }

  getTerms() {
    return this.httpClient.get(`${apisMiFirma.Gateway}Gateway/api/v2_0/terms/enabled`, httpOptions);
  }

  getEspecificTerms(ids: Array<any>) {
    let id = '';
    for (let i = 0; i < ids.length; i++) {
      id += 'ids=' + ids[i] + '&';
    }

    id = id.slice(0, -1);

    return this.httpClient.get(`${apisMiFirma.Gateway}Gateway/api/v2_0/terms/specific?${id}`, httpOptions);
  }

  createUser(name: string, email: string, phonenumber: number) {
    const data = {
      name: name,
      email: email,
      phoneNumber: phonenumber,
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/user/create`, data, httpOptions);
  }

  resetPassword(pass: string, correo: string) {
    const data = {
      newPassword: pass,
      email: correo
    }
    return this.httpClient.post(apisMiFirma.Gateway + `Gateway/api/v2_0/customers/resetPassword`, data, httpOptions2());
  }

  activeAcount(idActiveAcount: string) {
    const data = {
      activator: idActiveAcount,
    }
    return this.httpClient.post(apisMiFirma.Gateway + `Gateway/api/v2_0/customers/activateAccount`, data, httpOptions);
  }

  resetMovile(email: string, movile: string) {
    const data = {
      oldUser: email,
      customerMobile: movile
    }
    return this.httpClient.put(apisMiFirma.Gateway + `Gateway/api/v2_0/customers/editCustomer`, data, httpOptions);
  }

  resetEmail(email: string, newEmail: string) {
    const data = {
      oldUser: email,
      user: newEmail,
    }
    return this.httpClient.put(apisMiFirma.Gateway + `Gateway/api/v2_0/customers/editCustomer`, data, httpOptions);
  }

  resendEmail(email: string, name: string) {
    const data = {
      personaNombre: name,
      personaCorreo: email
    }
    return this.httpClient.post(apisMiFirma.Gateway + `Gateway/api/v2_0/customers/sendEmailActivateAccount`, data, httpOptions);
  }

  getTermsUser() {
    return this.httpClient.get(`${apisMiFirma.Gateway}Gateway/api/v3_0/terms/enabled`, httpOptions);
  }

  getTermsDate(customerId: string) {
    return this.httpClient.get(`${apisMiFirma.Gateway}Gateway/api/v2_0/terms/acceptance/${customerId}`, httpOptions2());
  }

}
