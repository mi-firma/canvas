import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GatewayService } from 'src/app/servicios/gateway.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { SessionService } from 'src/app/servicios';

@Component({
  selector: 'app-info-api',
  templateUrl: './info-api.component.html',
  styleUrls: ['./info-api.component.css']
})
export class InfoApiComponent implements OnInit {

  constructor(
    private toatsr: ToastrService,
    public gatewayService: GatewayService,
    private router: Router,
    public paramsService: ParamsService,
    private sessionService: SessionService
  ) { }
  url: string;
  key = '';
  token: string;
  menuDesplegado = false;
  urlDev: string;

  ngOnInit() {
    this.paramsService.paramsApi.subscribe((respuesta: any) => {
      this.url = respuesta.urlAPI;
      this.token = respuesta.token;
      this.urlDev = respuesta.urlDev;
    });
  }

  copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toatsr.success('Texto Copiado');
  }

  despMenu() {
    this.menuDesplegado = !this.menuDesplegado;
    if (this.menuDesplegado) {
      this.key = uuid.v4();
      console.log(this.key)
      this.gatewayService.resetPassword(this.key,this.sessionService.emailUser).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 204 || respuesta.statusCode == 201) {
          this.toatsr.success('La contraseña se ha generado correctamente')
        } else if (respuesta.statusCode == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    }
  }

  actualizar() {
    if (this.key.trim() === '') {
      this.toatsr.error('La contraseña no puede ser vacia');
    } else {
      this.gatewayService.resetPassword(this.key,this.sessionService.emailUser).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 204 || respuesta.statusCode == 201) {
          this.toatsr.success('La contraseña se ha actualizado correctamente');
        } else if (respuesta.statusCode == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    }
  }

}
