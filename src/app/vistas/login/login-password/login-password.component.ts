import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/servicios';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { GatewayService } from 'src/app/servicios/gateway.service';

@Component({
  selector: 'app-login-password',
  templateUrl: './login-password.component.html',
  styleUrls: ['./login-password.component.css']
})
export class LoginPasswordComponent implements OnInit, OnDestroy {

  formPersona = new FormGroup({
    correo: new FormControl({value: '', disabled : true}, [Validators.required, Validators.email]),
    Contrasena: new FormControl('', [Validators.required]),
  });

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

  loginSubscription: Subscription;
  terms = [];
  validTerms = false;

  constructor(
    private sessionService: SessionService,
    private gatewayService: GatewayService,
    private toastr: ToastrService,
    private router: Router,
    private fdService: FiledataService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('correo') == null) {
      this.router.navigateByUrl('');
    }
    this.formPersona.get('correo').setValue(this.sessionService.emailUser);
  }

  /**
   * Returns the form control cedula
   */
  get Email() {
    return this.formPersona.get('correo');
  }

  get Contrasena() {
    return this.formPersona.get('Contrasena');
  }

  /**
   * Executes the login process
   */
  login(event: Event): void {

    event.preventDefault();

    if (!this.formPersona.valid) {
      this.showInputInvalid();
      return;
    }

    this.loginSubscription = this.gatewayService.validate(this.sessionService.authId, this.Contrasena.value)
    .subscribe(async (respuesta: any) => {
      if (respuesta.data.hit) {
        await this.validateTerms();
        if (await this.termsValidate()) {
          this.fdService.tokenTerms(respuesta.data.nextStep.properties.TOKEN);
          this.router.navigate(['login/terminos']);
        } else {
          localStorage.setItem('token', respuesta.data.nextStep.properties.TOKEN);
          this.router.navigateByUrl('main/menu');
        }

      } else {
        this.clearForm();
        this.toastr.error('Contraseña Incorrecta');
      }
    }, (response: any) => {
      if (response.error && response.error.statusCode === 403 ) {
        this.toastr.error('Superó el máximo de intentos de autenticación, su usuario ha sido bloqueado por medidas de seguridad');
        this.router.navigateByUrl('');
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }});
  }

  clearForm(): void {
    this.Contrasena.setValue('');
  }

  showInputInvalid(): void {
    this.formPersona.get('correo').markAsTouched();
    this.formPersona.get('Contrasena').markAsTouched();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  termsValidate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fdService.terminosListener$.subscribe((data: any) => {
        if (data.length > 0 && this.validTerms) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  validateTerms(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gatewayService.validate(this.sessionService.authId, '').subscribe((Respuesta: any) => {
        if (JSON.stringify(Respuesta.data.nextStep.properties) !== '{}') {
          for (let i in Respuesta.data.nextStep.properties) {
            this.terms.push(+Respuesta.data.nextStep.properties[i]);
          }
          this.fdService.terms(this.terms);
          this.validTerms = true;
          resolve();
        } else {
          this.validTerms = false;
        }
        resolve();
    }, (response: any) => {
        if (response.error && response.error.statusCode === 403) {
            this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente más tarde');
        } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
        resolve();
    });
    });
  }


}
