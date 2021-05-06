import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ReconoserService } from 'src/app/servicios/reconoser/reconoser.service';
import { Observable } from 'rxjs';
import { IRcsValidationRequest } from 'src/app/interfaces';
import { SessionService } from 'src/app/servicios';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-foto',
  templateUrl: './registro-foto.component.html',
  styleUrls: ['./registro-foto.component.css']
})
export class RegistroFotoComponent implements OnInit {
  iframeUrl$: Observable<IRcsValidationRequest>;
  processCode: string;

  constructor(
    private router: Router,
    private reconoserService: ReconoserService,
    private sessionService: SessionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.init();

    const userData = {
      guidConv: '254c17d6-402b-448a-90e1-bf01dad1decc',
      tipoValidacion: 1,
      asesor: 'olimpia',
      sede: 'olimpia',
      tipoDoc: 'CC',
      numDoc: this.sessionService.documentUser,
      email: this.sessionService.emailUser,
      celular: this.sessionService.phoneUser2,
      usuario: 'mifirma',
      clave: '12345'
    };
    this.iframeUrl$ = this.reconoserService.validationRequest(userData);
  }

  init(): void {
    if (localStorage.getItem('loginToken') == null) {
      this.router.navigateByUrl('');
      return;
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(e) {
    if ((e.data.for === 'resultData') && e.data.proccessCode) {
      this.validateFinishRequest(e.data.proccessCode);
    }
  }

  validateFinishRequest(guidProcess: string) {
    const requestData = {
      guidConv: '254c17d6-402b-448a-90e1-bf01dad1decc',
      procesoConvenioGuid: guidProcess,
      usuario: 'mifirma',
      clave: '12345'
    };

    this.reconoserService.validateFinishRequest(requestData)
      .subscribe((res: any) => {
        if (res.data.finalizado) {
          this.router.navigateByUrl('registro/certificado/pin');
        } else {
          this.toastr.warning('Por favor termine el proceso');
        }
      });
  }

  continuar(): void {
    this.router.navigateByUrl('registro/certificado/pin');
  }

  omitir(): void {
    this.router.navigateByUrl('registro/certificado/pin');
  }

  /**
   * Function to listen if iframe operation finish !
   */
  // receiver(event) {
  //   if (event.origin !== 'https://dominio_validador') {
  //     return;
  //   }

  //   if (event.data.for === 'resultData') {
  //     console.log('Linkear !!');
  //   }
  // }
}
