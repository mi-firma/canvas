import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { SessionService } from 'src/app/servicios';

export interface ITerms {
  idTermType: number;
  termsType: string;
}

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  configuracion: any;
  terminos: any = [];
  tipoTermino: ITerms;
  titulo: string = '';
  userId: string;
  dateTerms: any;
  dateTerm: string;
  publicIp: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gatewayService: GatewayService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {

    this.userId = this.sessionService.userId;

    this.route.params.subscribe(async params => {
      await this.init(params.nombreTerm);
    });

  }

  async init(nombreTerm) {
    this.configuracion = {
      nombreTermino: nombreTerm
    }

    if (this.configuracion.nombreTermino === 'terminos-condiciones') {

      this.tipoTermino = {idTermType: 1, termsType: 'Terminos Y Condiciones'};
      this.titulo = 'Términos y condiciones servicio de firma electrónica';

    } else
    if (this.configuracion.nombreTermino === 'tratamiento-datos') {

      this.tipoTermino = {idTermType: 2, termsType: 'Tratamiento de datos personales'};
      this.titulo = 'Autorización para el tratamiento de datos personales';

    } else {
      this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
    }

    await this.obtenerTerminos();
    await this.obtenerFechaAceptacion();
    this.crearVistaTerminos();

  }

  obtenerTerminos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gatewayService.getTermsUser().subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 204 || respuesta.statusCode == 201) {
          this.terminos = respuesta.data;
          resolve();
        } else if (respuesta.status_code == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    });
  }

  crearVistaTerminos() {
    const termino = this.terminos.filter(item => item.termsType === this.tipoTermino.termsType);
    document.getElementById('termino').innerHTML = termino[0].template;




    document.querySelectorAll('.txt-title').forEach(el => el.remove());
    document.querySelectorAll('.txt-subtitle-terms').forEach(el => el.remove());

  }

  obtenerFechaAceptacion(): Promise<void> {
    const termino = this.terminos.filter(item => item.termsType === this.tipoTermino.termsType);
    this.tipoTermino.idTermType = termino[0].idTerms;
    return new Promise<void>((resolve, reject) => {
      this.gatewayService.getTermsDate(this.userId).subscribe((respuesta: any) => {
          this.dateTerms = respuesta.data.filter(item => item.idTerms === this.tipoTermino.idTermType);
          this.dateTerm = this.dateTerms[0].addedDate;
          this.publicIp = this.dateTerms[0].publicIp;
          resolve();
      });
    });
  }

}
