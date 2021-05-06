import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FiledataService } from 'src/app/servicios/filedata.service';
import * as CustomValidators from 'src/app/validators/CustomValidators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TerminosComponent } from '../../modales/terminos/terminos.component';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';

@Component({
  selector: 'app-registro-inicio',
  templateUrl: './registro-inicio.component.html',
  styleUrls: ['./registro-inicio.component.css']
})
export class RegistroInicioComponent implements OnInit, OnDestroy {

  // Stores the info collected in this view
  formIni: any[] = [];

  // Register form
  formRegistro = new FormGroup({
    correo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    celular: new FormControl('', [Validators.required, Validators.minLength(10), CustomValidators.onlyNumbers]),
    Nombre: new FormControl('', [Validators.required]),
    Apellido: new FormControl('', [Validators.required]),
    Contrasena: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidators.validAtLestOneLowerCase, CustomValidators.validAtLestOneUpperCase, CustomValidators.validAtLestOneNumber, CustomValidators.validSpecialCharacter,CustomValidators.validSpacesCharacter,CustomValidators.validSlashCharacter,CustomValidators.validPlusCharacter]),
    Contrasena2: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidators.validAtLestOneLowerCase, CustomValidators.validAtLestOneUpperCase, CustomValidators.validAtLestOneNumber, CustomValidators.validSpecialCharacter,CustomValidators.validSpacesCharacter,CustomValidators.validSlashCharacter,CustomValidators.validPlusCharacter]),
  });


  termsArr;
  idTermsArr: Array<number> = [];
  userIp: string;

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

  fieldTextType: boolean = false;
  fieldTextType2: boolean = false;


  constructor(
    private router: Router,
    private fdService: FiledataService,
    private paramsService: ParamsService,
    private modalService: NgbModal,
    private gatewayService: GatewayService,
    private toastr: ToastrService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.fdService.getIp().subscribe((respuesta: any) => {
      this.userIp = respuesta.ip;
    }, () => {
      this.userIp = '127.0.0.1';
    });
    this.gatewayService.getTerms().subscribe((respuesta: any) => {
      this.termsArr = respuesta.data;
      for (let i = 0; i < respuesta.data.length; i++) {
        this.idTermsArr.push(respuesta.data[i].idTerms);
        this.formRegistro.addControl('termino' + i, new FormControl('', Validators.requiredTrue));
      }
    });

    this.formRegistro.get('correo').setValue(this.sessionService.emailUser);

    this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
      if (enabled) {
        (window as any).dataLayer.push({
          event: 'GTMFormRegistro',
          gtmFormRegistroStepName: 'datosBasicos',
          gtmFormRegistroStepNumber: '2'
        });
      }
    });
  }

  checkCharacters(e){
    var key = e.keyCode || e.which;
    if (key == 111 || key == 191) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }
    if (key == 187 || key == 107) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }
  }

  getNameForm(i: number) {
    return 'termino' + i;
  }

  /**
   * Returns the form control associated with the email input field
   */
  get Email() {
    return this.formRegistro.get('correo');
  }

  get Apellido() {
    return this.formRegistro.get('Apellido');
  }

  get Nombre() {
    return this.formRegistro.get('Nombre');
  }

  get Contrasena() {
    return this.formRegistro.get('Contrasena');
  }

  get Contrasena2() {
    return this.formRegistro.get('Contrasena2');
  }

  get equallsPass(){
    const value = (this.formRegistro.get('Contrasena').value == this.formRegistro.get('Contrasena2').value)
    return value;
  }

  /**
   * Returns the form control associated with the phone input field
   */
  get Celular() {
    return this.formRegistro.get('celular');
  }

  /**
   * Returns the form control associated with the terms and conditions check box
   */
  get Terminos() {
    return this.formRegistro.get('terminos');
  }


  /**
   * Returns the form control associated with the data policies check box
   */
  get ATDP() {
    return this.formRegistro.get('atdp');
  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType
  }

  toggleFieldTextType2(){
    this.fieldTextType2 = !this.fieldTextType2
  }

  /**
   * Redirects the user to the login page
   */
  login(): void {
    this.router.navigateByUrl('');
  }

  /**
   * If the form is valid, it will redirect the user to the next page
   * Otherwise, it will show an error
   */
  continuar(): void {

    if (!this.formRegistro.valid) {
      this.showInputError();
      return;
    }


    if (this.formRegistro.get('Contrasena').value != this.formRegistro.get('Contrasena2').value) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    localStorage.setItem('correo', this.formRegistro.get('correo').value);
    const guid = this.sessionService.authId;
    const password = this.formRegistro.get('Contrasena').value;
    localStorage.setItem('phoneUser', this.formRegistro.get('celular').value);
    localStorage.setItem('personaNombre', this.formRegistro.get('Nombre').value + ' ' + this.formRegistro.get('Apellido').value);
    this.gatewayService.createCustomer(this.formRegistro.get('Nombre').value, this.formRegistro.get('Apellido').value, password, this.formRegistro.get('correo').value,
      this.formRegistro.get('celular').value, this.userIp, this.idTermsArr).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          if (respuesta.message == 'Resource created successfully') {
            this.gatewayService.createUser(this.formRegistro.get('Nombre').value + " " + this.formRegistro.get('Apellido').value, this.formRegistro.get('correo').value, +this.formRegistro.get('celular').value).subscribe(() => {
            });
            this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
              if (enabled) {
                (window as any).dataLayer.push({ event: 'accountCreated' });
              }
            });
            this.gatewayService.validate(guid, '').subscribe((respuesta: any) => {
              if (respuesta.data.nextStep.process == 'OTP') {
                this.router.navigateByUrl('registro/confirmar/celular');
              }
            });
          } else {
            if (respuesta.message == 'User already exist.') {
              this.toastr.warning('El usuario ya existe');
              this.router.navigateByUrl('');
            } else {
              this.toastr.warning('Hubo un problema al crear el usuario');
              this.router.navigateByUrl('registro');
            }
          }
        } else if (respuesta.statusCode == 403) {
          this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente mas tarde');
          this.router.navigateByUrl('');
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      }, (response: any) => {
        if (response.error && response.error.statusCode === 403) {
          this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente mas tarde');
          this.router.navigateByUrl('');
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
  }

  /**
   * Finds the first form control which has an error
   */
  showInputError(): void {
    for (const field in this.formRegistro.controls) {
      const control = this.formRegistro.get(field);
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }

  /**
   * Opens a modal tha contains the website with the terms and conditions
   */
  openTermsModal(i: number): void {
    const modal = this.modalService.open(TerminosComponent, { centered: true, size: 'lg' });
    modal.componentInstance.template = this.termsArr[i].template;
    modal.result.then((didAccept: boolean) => {
      this.formRegistro.get('termino' + i).setValue(didAccept);
    }).catch((error: any) => { });
  }


  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
