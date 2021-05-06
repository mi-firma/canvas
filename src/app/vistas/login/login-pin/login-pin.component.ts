import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OTPValidationResponse } from 'src/app/modelos/login.model';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/servicios';
import { Subscription } from 'rxjs';
import { GatewayService } from 'src/app/servicios/gateway.service';

@Component({
  selector: 'app-login-pin',
  templateUrl: './login-pin.component.html',
  styleUrls: ['./login-pin.component.css']
})
export class LoginPinComponent implements OnInit, OnDestroy {
  user: string;
  phoneDigits: string;

  loading = false;
  keyValue: number;
  otpValidationResponse: OTPValidationResponse = new OTPValidationResponse();

  formOTP = new FormGroup({
    OTP1: new FormControl('', Validators.compose([Validators.required,
    Validators.min(0),
    Validators.max(999999),
    Validators.pattern('^[0-9]*$')]))
  });

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
    private sessionService: SessionService,
    private toastr: ToastrService,
    private router: Router,
    private gatewayService: GatewayService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init(): void {
    if (localStorage.getItem('correo') == null) {
      this.router.navigateByUrl('');
    }
    this.user = this.sessionService.username;
    this.phoneDigits = this.sessionService.phoneUser2;
  }

  loginOTP(): void {
    if (this.formOTP.valid) {
      const OTP = this.formOTP.get('OTP1').value;
      this.loading = true;
      this.loginSubscription = this.gatewayService.validate(this.sessionService.authId, OTP).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 ||  respuesta.statusCode == 204) {
          if (respuesta.data.hit) {
            if (respuesta.data.nextStep.process == 'Dashboard') {
              localStorage.setItem('token', respuesta.data.nextStep.properties.TOKEN);
              this.router.navigateByUrl('main/menu');
            }
          } else {
            this.toastr.error('Código Incorrecto');
            this.loading = false;
            this.clearForm();
          }
        } else if (respuesta.statusCode == 403) {
          this.toastr.error('Superó el máximo de intentos de autenticación, su usuario ha sido bloqueado por medidas de seguridad');
          this.router.navigateByUrl('');
        } else if (respuesta.statusCode == 505) {
          this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
          this.loading = false;
          this.clearForm();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      }, (response: any) => {
        if (response.error && response.error.statusCode === 403 ) {
          this.toastr.error('Superó el máximo de intentos de autenticación, su usuario ha sido bloqueado por medidas de seguridad');
          this.router.navigateByUrl('');
        } else if (response.error && response.error.statusCode == 505) {
          this.toastr.error('No pudimos validar el código OTP, por favor intente de nuevo');
          this.loading = false;
          this.clearForm();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
    });
    }
  }

  clearForm(): void {
    this.formOTP.setValue({
      OTP1: '',
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
      this.setFocus('OTP5');
    }
  }

  ngOnDestroy(): void {
    this.toastr.clear();
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
