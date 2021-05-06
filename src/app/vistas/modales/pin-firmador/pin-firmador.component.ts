import { Component, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { SessionService } from 'src/app/servicios';
import * as Utils from 'src/app/Utilidades/utils';

@Component({
    selector: 'app-pin-firmador',
    templateUrl: './pin-firmador.component.html',
    styleUrls: ['./pin-firmador.component.css']
})
export class PinFirmadorComponent implements OnInit, OnDestroy {
    isThirdParty = localStorage.getItem('isThirdParty') == 'true';
    thirdPartyColor = localStorage.getItem('thirdPartyColor');
    @Input() authId;
    @Input() phoneUser;

    certificado: any;

    isValid = false;
    loading = false;
    pinFormActive = true;
    keyValue: number;
    seconds = 30;
    optResend = true;
    OtpSends = 5;

    formPIN = new FormGroup({
        PIN1: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(999999)]))
    });

    validatePINSubscription: Subscription;
    certificateSubscription: Subscription;
    phoneNumber;

    constructor(
        public activeModal: NgbActiveModal,
        public toastr: ToastrService,
        private renderer: Renderer2,
        private gatewayService: GatewayService,
        private router: Router,
        private sessionService: SessionService
    ) { }

    ngOnInit() {
        this.phoneNumber = this.sessionService.phoneUser2;
    }

    continuar() {
        if (this.formPIN.valid) {
            const PIN = this.formPIN.get('PIN1').value;
            this.loading = true;
            this.pinFormActive = false;

            this.gatewayService.validate(this.authId, PIN).subscribe((res: any) => {
                if (res.statusCode === 200 && res.data.hit) {
                    this.activeModal.close(PIN);
                } else if (res.statusCode == 403) {
                    this.toastr.error('Superó el máximo de intentos, su usuario ha sido bloqueado por medidas de seguridad');
                    this.router.navigateByUrl('');
                    this.sessionService.logout();
                } else if (res.statusCode == 505) {
                    this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
                    this.loading = false;
                    this.pinFormActive = true;
                    this.clearForm();
                } else {
                    this.toastr.error('PIN incorrecto!');
                    this.loading = false;
                    this.pinFormActive = true;
                    this.clearForm();
                }
            }, (response: any)=> {
                if (response.error && response.error.statusCode === 401 ) {
                    this.sessionService.logout();
                } else if (response.error && response.error.statusCode == 403) {
                    this.activeModal.close();
                    //this.toastr.error('Superó el máximo de intentos, su usuario ha sido bloqueado por medidas de seguridad');
                    localStorage.setItem('blocked','true')
                    this.sessionService.logout();
                    this.router.navigateByUrl('');
                } else if (response.error && response.error.statusCode == 505) {
                    this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
                    this.loading = false;
                    this.pinFormActive = true;
                    this.clearForm();
                }
            });
        }
    }

    clearForm(): void {
        this.formPIN.get('PIN1').setValue('');
    }

    resendOtp(){
        this.OtpSends --;
        if(this.OtpSends == 0){
            this.toastr.info('Supero el máximo de reenvios de su código de validación')
        }
        this.optResend = false;
        this.startCountdown()
        this.validateUser()
    }

    validateUser(): void {

        const isMobile = window.innerWidth <= 640;
        const isTablet = !isMobile && window.innerWidth <= 800;
        const isDesktop = !isMobile && !isTablet;
    
        const windowInfo = Utils.datosMaquina(window);
    
        this.gatewayService.validateUser(
          this.sessionService.emailUser,
          '',
          '127.0.0.1',
          windowInfo.browser,
          '',
          windowInfo.os,
          isMobile,
          isTablet,
          isDesktop,
          false,
          false,
          false,
          5
        ).subscribe((res: any) => {
          if (res.data.userExists) {
            this.authId = res.data.authId;
          }
        });
    }

    startCountdown() {
          
        const interval = setInterval(() => {
          this.seconds--;
            
          if (this.seconds < 0 ) {
            clearInterval(interval);
            this.optResend = true
            this.seconds = 30;
          }
        }, 1000);
    }

    close(): void {
        this.activeModal.close(null);
    }

    setFocus(id: string) {
        const element = this.renderer.selectRootElement('#' + id);
        setTimeout(() => element.focus(), 0);
    }

    nextInput(keyEvent, next: string, prev: string) {
        if (keyEvent.target.value.length === 1) {
            this.setFocus(next);
        } else {
            if (keyEvent.keyCode === 8 && prev) {
                this.setFocus(prev);
            }
        }
    }

    lastKey(keyCode: number) {
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
            this.keyValue = keyCode;
        }
        if (keyCode === 8) {
            this.setFocus('PIN5');
        }
    }

    ngOnDestroy(): void {
        this.toastr.clear();
        if (this.validatePINSubscription) {
            this.validatePINSubscription.unsubscribe();
        }
        if (this.certificateSubscription) {
            this.certificateSubscription.unsubscribe();
        }
    }
}
