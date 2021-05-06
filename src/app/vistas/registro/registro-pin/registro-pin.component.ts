import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/servicios/registro.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { ReconoserService } from 'src/app/servicios/reconoser/reconoser.service';
import { Subscription } from 'rxjs';
import { ParamsService } from 'src/app/servicios/params/params.service';

@Component({
    selector: 'app-registro-pin',
    templateUrl: './registro-pin.component.html',
    styleUrls: ['./registro-pin.component.css']
})
export class RegistroPinComponent implements OnInit, OnDestroy {

    keyValue: number;

    formPIN = new FormGroup({
        PIN1: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])),
        PIN2: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])),
        PIN3: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9)])),
        PIN4: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9)]))
    });

    usuario: string;
    phoneDigits = '';
    desiredDigits = 2;

    loginSubscription: Subscription;

    animObj = {
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/registro-4.json',
      };

    animObjmov = {
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/registro-4-mobile.json',
    };

    constructor(
        private renderer: Renderer2,
        public toastr: ToastrService,
        private router: Router,
        private paramsService: ParamsService,
        public registroService: RegistroService,
        public sessionService: SessionService,
        private reconoserService: ReconoserService
    ) { }

    ngOnInit() {
        this.init();
    }

    init(): void {
        if (localStorage.getItem('personaId') == null) {
            this.router.navigateByUrl('');
            return;
        }

        this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
            if (enabled) {
                (window as any).dataLayer.push({ event: 'GTMFormRegistro',
                                                gtmFormRegistroStepName: 'registro/datos/confirma',
                                                gtmFormRegistroStepNumber: '5' });
            }
        });
        this.usuario = this.sessionService.username;
        const celular = this.sessionService.phoneUser2;
        this.phoneDigits = celular.substr(celular.length - this.desiredDigits, this.desiredDigits);

        this.reconoserService.getToken();
    }

    Ingresar(keyCode: number, prev: string): void {
        if (this.formPIN.valid) {
            const OTP = this.formPIN.get('PIN1').value +
                this.formPIN.get('PIN2').value +
                this.formPIN.get('PIN3').value +
                this.formPIN.get('PIN4').value;

            this.loginSubscription = this.registroService.validarUsuario(+localStorage.getItem('personaId'),
                localStorage.getItem('identificadorOTP'),
                OTP,
                1,
                +localStorage.getItem('documento')).subscribe((Respuesta: any) => {
                    if (Respuesta.operacionExitosa) {
                        localStorage.setItem('loginToken', Respuesta.loginToken);

                        if (localStorage.getItem('skip') != null) {
                            localStorage.removeItem('skip');
                            this.router.navigateByUrl('main/menu');
                        } else {
                            this.reconoserService.isReconoserEnabled().subscribe((enabled: boolean) => {
                                if (enabled) {
                                    this.router.navigateByUrl('registro/datos/foto');
                                } else {
                                    this.router.navigateByUrl('registro/certificado/pin');
                                }
                            }, (error: any) => {
                                this.router.navigateByUrl('registro/certificado/pin');
                            });
                        }
                    } else {
                        this.toastr.error('OTP incorrecto!');
                        this.clearForm();
                    }
                }, (error: any) => {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                });
        }

        if (keyCode === 8) {
            this.setFocus(prev);
        }
    }

    clearForm(): void {
        this.formPIN.setValue({
            PIN1: '',
            PIN2: '',
            PIN3: '',
            PIN4: ''
        });
    }

    setFocus(id: string): void {
        const element = this.renderer.selectRootElement('#' + id);
        setTimeout(() => element.focus(), 0);
    }

    nextInput(keyEvent, next: string, prev: string): void {
        if (keyEvent.target.value.length === 1) {
            this.setFocus(next);
        } else {
            if (keyEvent.keyCode === 8 && prev) {
                this.setFocus(prev);
            }
        }
    }

    lastKey(keyCode: number): void {
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
            this.keyValue = keyCode;
        }
        if (keyCode === 8) {
            this.setFocus('OTP3');
        }
    }

    ngOnDestroy(): void {
        this.toastr.clear();
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }
}
