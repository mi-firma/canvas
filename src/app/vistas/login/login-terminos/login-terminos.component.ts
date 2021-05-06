import { Component, OnInit } from '@angular/core';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { Router } from '@angular/router';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-terminos',
  templateUrl: './login-terminos.component.html',
  styleUrls: ['./login-terminos.component.css']
})
export class LoginTerminosComponent implements OnInit {

  constructor(
    private gatewayService: GatewayService,
    private fdService: FiledataService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  containerRef: HTMLElement;

  terminos = []

  activate: string;
  validateHit = false;

  ngOnInit() {
    this.activate = localStorage.getItem('noActive');

    this.fdService.terminosListener$.subscribe((data: any) => {
      if (data.length === 0) {
        localStorage.clear();
        this.router.navigate(['']);
      }

      this.gatewayService.getEspecificTerms(data).subscribe((respuesta: any) => {
        this.terminos = respuesta.data;
        setTimeout(() => {
          for (let i = 0; i < this.terminos.length; i++) {
            document.getElementById('termino' + i).innerHTML = this.terminos[i].template;
          }
        });
      }, () => {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      });
    });
  }

  aceptar() {
    this.gatewayService.validate(localStorage.getItem('authId'), '').subscribe(async (Respuesta: any) => {
      if (Respuesta.statusCode == 200 || Respuesta.statusCode == 201 || Respuesta.statusCode == 204) {
        if (this.activate == 'false') {
          this.router.navigate(['registro/activar/cuenta']);
        } else {
          // this.router.navigate(['login']);
          localStorage.setItem('token', await this.obtenerToken());
          this.router.navigateByUrl('main/menu');
        }
      } else if (Respuesta.statusCode == 403) {
        this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente mas tarde');
        this.router.navigate(['']);
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    }, (response: any) => {
      if (response.error && response.error.statusCode === 403 ) {
        this.toastr.error('Su usuario ha sido bloqueado por medidas de seguridad, intente mas tarde');
        this.router.navigate(['']);
      } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
  });
  }

  obtenerToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.fdService.tokenTerminosListener$.subscribe((data: string) => {
        resolve(data);
      });
    });
  }

}
