import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { ParamsService } from 'src/app/servicios/params/params.service';
import * as CustomValidators from 'src/app/validators/CustomValidators';
import * as Utils from 'src/app/Utilidades/utils';

@Component({
  selector: 'app-confirmar-celular',
  templateUrl: './confirmar-celular.component.html',
  styleUrls: ['./confirmar-celular.component.css']
})
export class ConfirmarCelularComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    public toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private gatewayService: GatewayService,
    private paramsService: ParamsService,
  ) { }

  keyValue: number;
  phoneUser: string;
  toUpdate = false;
  seconds = 30;
  optResend = true;
  OtpSends = 5;

  formPIN = new FormGroup({
    PIN1: new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(999999)]))
  });
  formUpdate = new FormGroup({
    celular: new FormControl('', [Validators.required, Validators.minLength(10), CustomValidators.onlyNumbers]),
    celular2: new FormControl('', [Validators.required, Validators.minLength(10), CustomValidators.onlyNumbers]),
  });

  get Celular() {
    return this.formUpdate.get('celular');
  }

  get Celular2() {
    return this.formUpdate.get('celular2');
  }

  ngOnInit() {
    this.getMovile();
  }

  Ingresar(): void {
    if (this.formPIN.valid) {
      const guid = this.sessionService.authId;
      const PIN = this.formPIN.get('PIN1').value;
      this.gatewayService.validate(guid, PIN).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          if (respuesta.data.hit) {
            this.router.navigateByUrl('registro/activar/cuenta');
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
  }

  getMovile(){
    this.phoneUser = this.sessionService.phoneUser2;
    let lastDigits = this.phoneUser.substr(this.phoneUser.length-2);
    this.phoneUser = '*****'+lastDigits;
    localStorage.setItem('phoneUser',this.phoneUser);
  }

  update() {
    if (this.formUpdate.valid) {
      if (this.formUpdate.get('celular').value != this.formUpdate.get('celular2').value) {
        this.toastr.error('Los numeros móviles no coinciden');
        return;
      }
      this.gatewayService.resetMovile(this.sessionService.emailUser,this.formUpdate.get('celular').value).subscribe((respuesta:any)=>{
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          localStorage.setItem('phoneUser',this.formUpdate.get('celular').value)
          this.toUpdate = false;
          this.getMovile()
          this.resendOtp()
          this.formUpdate.setValue({
            celular:'',
            celular2:''
          })
        }
      })
    }
  }

  cancel(){
    this.toUpdate = false;
    this.formUpdate.setValue({
      celular:'',
      celular2:''
    })
  }

  resendOtp() {
    this.OtpSends--;
    if (this.OtpSends == 0) {
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
      5,
      this.sessionService.authId
    ).subscribe((res: any) => {
      if (res.data.userExists) {
        //this.authId = res.data.authId;
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

}

