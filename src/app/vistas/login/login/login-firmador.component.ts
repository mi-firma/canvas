import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { FiledataService } from 'src/app/servicios/filedata.service';
import * as Utils from 'src/app/Utilidades/utils';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/servicios';

@Component({
    selector: 'app-login-firmador',
    templateUrl: './login-firmador.component.html',
    styleUrls: ['./login-firmador.component.css']
})
export class LoginFirmadorComponent implements OnInit, OnDestroy {

    formPersona = new FormGroup({
        correo: new FormControl('', [Validators.required, Validators.email]),
    });

    prodEnvironment: boolean;

    animObj = {
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/animations/registro-1.json',
    };

    animObjmov = {
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/animations/registro-1-mobile.json',
    };

    haveCamera: boolean;
    userIp = '127.0.0.1';

    validateuserSubscription: Subscription;
    validateSubscription: Subscription;

    terms = [];

    constructor(
        private gatewayService: GatewayService,
        private paramsService: ParamsService,
        private router: Router,
        private fdService: FiledataService,
        private toastr: ToastrService,
        private sessionService : SessionService
    ) { }

    ngOnInit(): void {
        if(localStorage.getItem('blocked') != null){
            this.toastr.error('Superó el máximo de intentos, su usuario ha sido bloqueado por medidas de seguridad')
            localStorage.removeItem('blocked')
        }
        this.fdService.getIp().subscribe((respuesta: any) => {
            this.userIp = respuesta.ip;
            this.logAutomatic();
        }, () => {
            this.userIp = '127.0.0.1';
            this.logAutomatic();
        });
        Utils.detectWebcam().then((value: boolean) => {
            this.haveCamera = value;
        });
        this.getEnvironment();
        this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
            if (enabled) {
                (window as any).dataLayer.push({
                    event: 'GTMFormLogin',
                    gtmFormRegistroStepName: 'inicio',
                    gtmFormRegistroStepNumber: '1'
                });
            }
        });
    }

    logAutomatic(): void {
        if (localStorage.getItem('firma') != null) {
            const base64 = atob(localStorage.getItem('firma'));
            const l = base64.indexOf('_');

            let correo = base64.substring(l + 1);

            const ultimo = +correo.charAt(correo.length - 1);
            if (!isNaN(ultimo)) {
                correo = correo.substring(0, correo.length - 2);
            }

            this.formPersona.get('correo').setValue(correo);
            this.continue();
        }
    }

    /**
     * Returns the form control cedula
     */
    get Email() {
        return this.formPersona.get('correo');
    }

    getEnvironment(): void {
        this.prodEnvironment = window.location.href === 'https://app.mifirma.co/';
    }

    /**
     * Executes the login process
     */
    continue(): void {

        if (!this.formPersona.valid) {
            this.showInputInvalid();
            return;
        }

        const isMobile = window.innerWidth <= 640;
        const isTablet = !isMobile && window.innerWidth <= 800;
        const isDesktop = !isMobile && !isTablet;

        const windowInfo = Utils.datosMaquina(window);
        this.gatewayService.validateUser(
            this.formPersona.get('correo').value,
            '',
            this.userIp,
            windowInfo.browser,
            '',
            windowInfo.os,
            isMobile,
            isTablet,
            isDesktop,
            this.haveCamera,
            false,
            false
        ).subscribe(async (respuesta: any) => {
            if (respuesta.data.userExists) {
                if (respuesta.data.userAssignedPassword) {
                    this.login(respuesta);
                } else {
                   await this.resetPassword(respuesta);
                }
            } else {
                this.registerUser(respuesta.data.authId);
            }
        }, (response: any) => {
            if (response.error && response.error.statusCode === 403) {
                this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente más tarde');
            } else if (response.error && response.error.statusCode === 401) {
                this.activateAccount(response);
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });
    }

    login(respuesta: any): void {
        localStorage.setItem('personaNombre',
            `${respuesta.data.user.customerFirstName} ${respuesta.data.user.customerLastName}`);
        localStorage.setItem('phoneUser', respuesta.data.user.customerMobile);
        localStorage.setItem('correo', this.formPersona.get('correo').value);
        localStorage.setItem('personaId', respuesta.data.user.idCustomer);
        localStorage.setItem('authId', respuesta.data.authId);

        this.nextStep(respuesta);
    }

    activateAccount(respuesta: any) {
        localStorage.setItem('personaNombre',
            `${respuesta.error.data.customer.customerFirstName} ${respuesta.error.data.customer.customerLastName}`);
        localStorage.setItem('phoneUser', respuesta.error.data.customer.customerMobile);
        localStorage.setItem('correo', this.formPersona.get('correo').value);
        localStorage.setItem('personaId', respuesta.error.data.customer.idCustomer);
        localStorage.setItem('authId', respuesta.error.data.authId);
        if(respuesta.error.data.step == 'OTP'){
            this.validateUser();
            this.router.navigateByUrl('registro/confirmar/celular')
        }else{
            const nombre = this.sessionService.username.split(' ')
            this.gatewayService.resendEmail(this.sessionService.emailUser, nombre[0])
                .subscribe((res: any) => {
                    this.router.navigateByUrl('registro/activar/cuenta')
                });
        }
    }

    validateUser(): void {

        const isMobile = window.innerWidth <= 640;
        const isTablet = !isMobile && window.innerWidth <= 800;
        const isDesktop = !isMobile && !isTablet;

        const windowInfo = Utils.datosMaquina(window);

        this.gatewayService.validateUser(
          this.sessionService.emailUser,
          '',
          this.userIp,
          windowInfo.browser,
          '',
          windowInfo.os,
          isMobile,
          isTablet,
          isDesktop,
          false,
          false,
          false,
          5,
          this.sessionService.authId
        ).subscribe((res: any) => {
          if (res.data.userExists) {
            //this.authId = res.data.authId;
          }
        });
      }

    async resetPassword(respuesta: any) {
        localStorage.setItem('personaNombre',
            `${respuesta.data.user.customerFirstName} ${respuesta.data.user.customerLastName}`);
        localStorage.setItem('phoneUser', respuesta.data.user.customerMobile);
        localStorage.setItem('correo', this.formPersona.get('correo').value);
        localStorage.setItem('personaId', respuesta.data.user.idCustomer);
        localStorage.setItem('authId', respuesta.data.authId);
        await this.getTerms(respuesta);
        this.router.navigateByUrl('login/reset/password/pin')
    }

    nextStep(respuesta: any): void {
        switch (respuesta.data.nextStep.process) {
            case 'Terminos':
                this.processTerms(respuesta);
                break;
            case 'Facial':
                this.router.navigate(['login/facial']);
                break;
            case 'OTP':
                this.router.navigate(['login']);
                break;
            case 'Password':
              this.validateUserActive(respuesta);
                // this.router.navigate(['login/password']);
        }
    }

    processTerms(respuesta: any): void {
        if (JSON.stringify(respuesta.data.nextStep.properties) == '{}') {
            this.gatewayService.validate(respuesta.data.authId, '').subscribe((Respuesta: any) => {
                if (!respuesta.data.user.isActive) {
                    this.router.navigate(['registro/activar/cuenta']);
                } else {
                    this.nextStep(Respuesta);
                }
            }, (response: any) => {
                if (response.error && response.error.statusCode === 403) {
                    this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente más tarde');
                } else {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                }
            });
        } else {
            for (let i in respuesta.data.nextStep.properties) {
                this.terms.push(+respuesta.data.nextStep.properties[i]);
            }
            this.fdService.terms(this.terms);
            if (!respuesta.data.user.isActive) {
                localStorage.setItem('noActive', 'false');
            }
            //this.router.navigate(['login/terminos']);
            this.router.navigate(['login/password']);
        }
    }

    registerUser(authId: string): void {
        localStorage.setItem('authId', authId);
        localStorage.setItem('correo', this.formPersona.get('correo').value);
        this.router.navigate(['registro']);
    }

    showInputInvalid(): void {
        this.formPersona.get('correo').markAsTouched();
    }

    getTerms(respuesta: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if (JSON.stringify(respuesta.data.nextStep.properties) !== '{}') {
          for (let i in respuesta.data.nextStep.properties) {
            this.terms.push(+respuesta.data.nextStep.properties[i]);
          }
          this.fdService.terms(this.terms);
          if (!respuesta.data.user.isActive) {
              localStorage.setItem('noActive', 'false');
          }
          resolve();
        }else{
            resolve()
        }
      });
    }

    validateUserActive(respuesta) {
      if (!respuesta.data.user.isActive) {
        localStorage.setItem('noActive', 'false');
        this.router.navigate(['registro/activar/cuenta']);
      } else {
        this.router.navigate(['login/password']);
      }
    }

    ngOnDestroy(): void {
        if (this.validateSubscription) {
            this.validateSubscription.unsubscribe();
        }
        if (this.validateuserSubscription) {
            this.validateuserSubscription.unsubscribe();
        }
    }
}
