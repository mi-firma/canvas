import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/servicios';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { ParamsService } from 'src/app/servicios/params/params.service';

@Component({
  selector: 'app-activar-cuenta',
  templateUrl: './activar-cuenta.component.html',
  styleUrls: ['./activar-cuenta.component.css']
})
export class ActivarCuentaComponent implements OnInit, OnDestroy {

  constructor(
    private renderer: Renderer2,
    public toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private gatewayService: GatewayService,
    private paramsService: ParamsService,
    public activatedRoute: ActivatedRoute,
  ) { }

  keyValue: number;
  email: string;
  toUpdate = false;
  seconds2 = 5;
  seconds = 30;
  optResend = true;
  OtpSends = 5;
  timeInactive = 60;

  idActiveAcount: string;
  isActive: boolean = false;
  interval
  offButton: boolean = false
  successActive: boolean = true;
  done:boolean = false;

  formUpdate = new FormGroup({
    correo: new FormControl("", [Validators.required, Validators.email]),
    correo2: new FormControl("", [Validators.required, Validators.email]),
  });

  get Email() {
    return this.formUpdate.get('correo');
  }

  get Email2() {
    return this.formUpdate.get('correo2');
  }

  ngOnInit() {
    this.idActiveAcount = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idActiveAcount != null) {
      this.isActive = true;
      this.gatewayService.activeAcount(this.idActiveAcount).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          localStorage.setItem('token', respuesta.data.properties.TOKEN)
          this.successActive = true;
          this.done = true;
          this.startCountdown2()
        } else if(respuesta.statusCode == 404) {
          this.router.navigateByUrl('');
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      }, (response: any) => {
        if (response.error && response.error.status_Code === 500) {
          this.done = true;
          this.successActive = false;
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    } else {
      console.log("hola")
      this.startCountdown3()
    }
    this.getEmail()
    this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
      if (enabled) {
        (window as any).dataLayer.push({
          event: 'GTMFormRegistro',
          gtmFormRegistroStepName: 'ValidarCuenta',
          gtmFormRegistroStepNumber: '3'
        });
      }
    });
  }

  getEmail() {
    this.email = this.sessionService.emailUser;
    let initialDigits = this.email.substr(0, 2);
    let baseEmail = this.email.split('@');
    let lastDigits = baseEmail[0].substr(baseEmail[0].length - 2);
    this.email = initialDigits + '****' + lastDigits + '@' + baseEmail[1];
  }

  update(): void {
    this.timeInactive = 60;
    if (this.formUpdate.valid) {
      if (this.formUpdate.get('correo').value != this.formUpdate.get('correo2').value) {
        this.toastr.error('Los correos no coinciden');
        return;
      }
      this.gatewayService.resetEmail(this.sessionService.emailUser, this.formUpdate.get('correo').value).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          localStorage.setItem('correo', this.formUpdate.get('correo').value)
          this.toUpdate = false;
          this.getEmail()
          this.resendOtp()
          this.formUpdate.setValue({
            correo: '',
            correo2: ''
          })
        } else if (respuesta.statusCode == 400) {
          this.toastr.error('Este correo ya se encuentra registrado en Mi Firma')
          this.formUpdate.setValue({
            correo: '',
            correo2: ''
          })
        }
      })
    }
  }

  cancel() {
    this.timeInactive = 60;
    this.toUpdate = false;
    this.formUpdate.setValue({
      correo: '',
      correo2: ''
    })
  }

  resendOtp() {
    this.timeInactive = 60;
    this.OtpSends--;
    if (this.OtpSends == 0) {
      this.toastr.info('Supero el máximo de reenvios del correo de activacion')
    }
    this.optResend = false;
    this.startCountdown()
    this.resendEmail()
  }

  resendEmail(): void {

    const nombre = this.sessionService.username.split(' ')
    this.gatewayService.resendEmail(this.sessionService.emailUser, nombre[0])
      .subscribe((res: any) => {

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

  startCountdown2() {

    const interval = setInterval(() => {
      this.seconds2--;

      if (this.seconds2 < 0) {
        clearInterval(interval);
        this.router.navigateByUrl('main/menu')
      }
    }, 1000);
  }

  startCountdown3() {

    this.interval = setInterval(() => {
      this.timeInactive--;
      if (this.timeInactive < 0) {
        clearInterval(this.interval);
        this.offButton = true;
        this.toUpdate = false;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }


}
