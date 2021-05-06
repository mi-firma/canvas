import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { GatewayService } from 'src/app/servicios/gateway.service';
import * as Utils from 'src/app/Utilidades/utils';

@Component({
  selector: 'app-reset-password-pin',
  templateUrl: './reset-password-pin.component.html',
  styleUrls: ['./reset-password-pin.component.css']
})
export class ResetPasswordPinComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    public toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private gatewayService: GatewayService,
    private fdService: FiledataService
  ) { }

  keyValue: number;
  email: string;
  authId: string;

  formPIN = new FormGroup({
    PIN1: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(999999)]))
  });

  seconds = 30;
  optResend = true;
  OtpSends = 5;
  terms = [];
  userIp = '127.0.0.1';

  async ngOnInit() {
    if (!this.sessionService.emailUser) {
      this.router.navigateByUrl('');
    }
    this.email = this.sessionService.emailUser;

    this.userIp = await this.getIpAddress();

    this.validateUser();
  }

  resendOtp() {
    this.OtpSends--;
    if (this.OtpSends == 0) {
      this.toastr.info('Supero el máximo de reenvios del correo de activacion')
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
      4
    ).subscribe((res: any) => {
      if (res.data.userExists) {
        localStorage.setItem('authId', res.data.authId);
        this.authId = res.data.authId;
      }
    });
}

startCountdown() {

  const interval = setInterval(() => {
    this.seconds--;

    if (this.seconds < 0) {
      clearInterval(interval);
      this.optResend = true
      this.seconds = 30;
    }
  }, 1000);
}

  authenticate(): void {

    if (!this.formPIN.valid) {
      return;
    }

    const PIN = this.formPIN.get('PIN1').value;
    this.gatewayService.validate(this.authId, PIN).subscribe(async (respuesta: any) => {
      if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
        if (respuesta.data.hit) {
          localStorage.setItem('pinAllowed', '1');
          await this.validateTerms(respuesta);
          this.router.navigateByUrl('login/reset/password');
        } else {
          this.toastr.error('Código Incorrecto');
          this.clearForm();
        }
      } else if (respuesta.statusCode == 403) {
        this.toastr.error('Superó el máximo de intentos de autenticación, su usuario ha sido bloqueado por medidas de seguridad');
        this.router.navigateByUrl('');
      } else if (respuesta.statusCode == 505) {
        this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
        this.clearForm();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    }, (response: any) => {
      if (response.error && response.error.statusCode === 401) {
        this.sessionService.logout();
      } else if (response.error && response.error.statusCode == 403) {
        this.toastr.error('Superó el máximo de intentos de autenticación, su usuario ha sido bloqueado por medidas de seguridad');
        this.router.navigateByUrl('');
      } else if (response.error && response.error.statusCode == 505) {
        this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
        this.clearForm();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  clearForm(): void {
    this.formPIN.setValue({
      PIN1: ''
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
      this.setFocus('PIN5');
    }
  }

  validateTerms(respuesta): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (JSON.stringify(respuesta.data.nextStep.properties) !== '{}') {
          for (let i in respuesta.data.nextStep.properties) {
            this.terms.push(+respuesta.data.nextStep.properties[i]);
          }
          this.fdService.terms(this.terms);
          resolve();
        }
        resolve();
    });
  }

  getIpAddress(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.fdService.getIp().subscribe((respuesta: any) => {
        resolve(respuesta.ip);
      }, () => {
        resolve('127.0.0.1');
      });
    });
  }

}
