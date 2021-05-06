import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { GatewayService } from 'src/app/servicios/gateway.service';
import * as CustomValidators from 'src/app/validators/CustomValidators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  formPersona = new FormGroup({
    Contrasena: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidators.validAtLestOneLowerCase, CustomValidators.validAtLestOneUpperCase, CustomValidators.validAtLestOneNumber, CustomValidators.validSpecialCharacter, CustomValidators.validSpacesCharacter,CustomValidators.validSlashCharacter,CustomValidators.validPlusCharacter]),
    Contrasena2: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidators.validAtLestOneLowerCase, CustomValidators.validAtLestOneUpperCase, CustomValidators.validAtLestOneNumber, CustomValidators.validSpecialCharacter, CustomValidators.validSpacesCharacter,CustomValidators.validSlashCharacter,CustomValidators.validPlusCharacter]),
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

  fieldTextType: boolean = false;
  fieldTextType2: boolean = false;
  terms = [];


  constructor(
    private gatewayService: GatewayService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private fdService: FiledataService
  ) { }

  ngOnInit() {
  }


  get Contrasena2() {
    return this.formPersona.get('Contrasena2');
  }

  get Contrasena() {
    return this.formPersona.get('Contrasena');
  }

  get equallsPass() {
    const value = (this.formPersona.get('Contrasena').value == this.formPersona.get('Contrasena2').value)
    return value;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2
  }

  resetPassword(): void {

    if (!this.formPersona.valid) {
      this.showInputInvalid();
      return;
    }

    if (this.formPersona.get('Contrasena').value != this.formPersona.get('Contrasena2').value) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    this.gatewayService.resetPassword(this.formPersona.get('Contrasena').value, this.sessionService.emailUser).subscribe(async (res: any) => {
      this.toastr.success('La contraseña se ha actualizado correctamente');
      if (await this.termsValidate()) {
        this.fdService.tokenTerms(res.data.TOKEN);
        this.router.navigate(['login/terminos']);
      } else {
        localStorage.setItem('token', res.data.TOKEN)
        this.router.navigateByUrl('main/menu');
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


  /**
   * Shows a label whose message is related to a validation error
   */
  showInputInvalid(): void {
    this.formPersona.get('correo').markAsTouched();
    this.formPersona.get('Contrasena').markAsTouched();
  }

  termsValidate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fdService.terminosListener$.subscribe((data: any) => {
        if (data.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

}
