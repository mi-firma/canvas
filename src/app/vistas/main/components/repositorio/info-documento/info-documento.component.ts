import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { EditarFirmanteComponent } from 'src/app/vistas/modales/editar-firmante/editar-firmante.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { MensajesComponent } from '../../../../modales/mensajes/mensajes.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as Utils from 'src/app/Utilidades/utils';

@Component({
  selector: 'app-info-documento',
  templateUrl: './info-documento.component.html',
  styleUrls: ['./info-documento.component.css']
})
export class InfoDocumentoComponent implements OnInit, OnDestroy {

  documento: any;
  signers: Array<any> = [];
  signer: any;
  correoActual: string;
  lastIndexMenuOpen = -1;
  correoRecordatotio: number = 1;
  correoEditar: number = 2;
  isDownloading: boolean = false;

  constructor(
    private router: Router,
    private firmadorService: FirmadorService,
    private documentosService: DocumentosService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    public toast: ToastrService,
  ) { }

  ngOnInit() {
    this.obtenerDetalles();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.lastIndexMenuOpen !== -1) {
      this.signers[this.lastIndexMenuOpen].menuOpen = false;
    }
  }

  obtenerDetalles(): void {
    this.documento = {
      documentoNombre: this.route.snapshot.paramMap.get('nombreDoc'),
      documentoSerial: this.route.snapshot.paramMap.get('serial'),
      estadoProcesoNombre: this.route.snapshot.paramMap.get('estadoDoc'),
      tipoSolicitud: this.route.snapshot.paramMap.get('tipoSolicitud')
    };
    this.firmadorService.ObtenerFirmantesDocumento(this.documento.documentoSerial).subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201){
        this.signers = Respuesta.data.signers;
        for (const signer of this.signers) {
          if (signer.ejecucionFirmaGrafoFecha === '0001-01-01T00:00:00') {
            signer.ejecucionFirmaGrafoFecha = '';
          }
          signer.menuOpen = false;
        }
      } else if (Respuesta.status_code == 401) {
          this.sessionService.logout();
      } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  /**
   * Triggers the browser to download a document that is retrieved through a web service.
   */
  descargar(): void {
    this.isDownloading = true;
    this.documentosService.recuperarDocumento(this.documento.documentoSerial).subscribe((data: any) => {
      const linkSource = `data:application/pdf;base64,${data.data.fileBase64}`;
      const downloadLink = document.createElement('a');
      const name = this.documento.documentoNombre;
      downloadLink.href = linkSource;
      downloadLink.download = name;
      downloadLink.click();
    });
  }

  /**
   * Toggles the selected menu
   * @param doc The index of the document associated with the selected menu
   */
  menuOption(i: number, e: MouseEvent): void {
    e.stopPropagation();
    if (this.lastIndexMenuOpen !== -1 && this.signers[i] !== this.signers[this.lastIndexMenuOpen]) {
      this.signers[this.lastIndexMenuOpen].menuOpen = false;
    }
    this.signers[i].menuOpen = !this.signers[i].menuOpen;
    this.lastIndexMenuOpen = i;
  }

  /**
   * Asks the user whether or not they are sure the want to send an email to remind other users to sign the document
   * @param signer The signer object
   */
  recordatorio(signer: any): void {
    const modalRef = this.modalService.open(MensajesComponent, { centered: true });
    modalRef.componentInstance.tittle = 'Enviar Recordatorio';
    modalRef.componentInstance.message = '¿Está seguro que desea enviar un recordatorio?';
    modalRef.result.then((result) => {
      if (result) {
        this.enviarCorreo(signer, this.correoRecordatotio);
      }
    }, (error: any) => {});
  }

  /**
   * Edits the user that should sign the file
   * @param signer The signer object
   */
  editarFirmante(signer: any): void {
    const modalRef = this.modalService.open(EditarFirmanteComponent, { centered: true});
    modalRef.componentInstance.correo = signer.personaCorreo;
    modalRef.componentInstance.solicitudFirmaToken = signer.solicitudFirmaToken;
    modalRef.result.then((result) => {
      if (result) {

        this.correoActual = signer.personaCorreo;
        signer.personaCorreo = result;
        this.firmadorService.ActualizarPersona(signer.solicitudFirmaToken,
          signer.personaCorreo).subscribe((data: any) => {
            if (data.status_code == 200 || data.status_code == 204 || data.status_code == 201) {
              this.enviarCorreo(signer, this.correoEditar);
              this.toast.success('Se ha editado el firmante exitosamente!');
              this.obtenerDetalles();
            } else if (data.status_code == 401) {
                this.sessionService.logout();
            } else {
              if (data.message === 'Correo Existente') {
                signer.personaCorreo = this.correoActual;
                this.toast.error('Correo de firmante ya existe');
              } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
              }
            }
          }, (response: any) => {
            if (response.error && response.error.status_code === 401 ) {
                this.sessionService.logout();
            } else {
              if (response.error.message === 'Correo Existente') {
                signer.personaCorreo = this.correoActual;
                this.toast.error('Correo de firmante ya existe');
              } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
              }
            }
          });
      }
    }, (error: any) => {});
  }

  /**
   * Deletes an user from a document process
   * @param signer The signer object
   */
  eliminarFirmante(signer: any): void {

    const modalRef = this.modalService.open(MensajesComponent, { centered: true});
    modalRef.componentInstance.tittle = 'Eliminar Firmante';
    modalRef.componentInstance.message = '¿Está seguro que desea eliminar este firmante del documento?';
    modalRef.result.then((result) => {

      if (result) {
        this.firmadorService.EliminarFirmante(signer.solicitudFirmaToken).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.toast.success('Se ha eliminado el firmante exitosamente!');
            this.signers.splice(this.signers.indexOf(signer), 1);
          } else if (Respuesta.status_code == 401) {
              this.sessionService.logout();
          } else {
              this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      }
    },
      (error: any) => {});
  }

  /**
   * Sends an email to remind users to sign the file
   * @param signer The signer object
   */
  enviarCorreo(signer: any, opcioncorreo: number): void {
    this.firmadorService.EnviarRecordatorio(signer.solicitudFirmaToken, signer.personaPrimerNombre,
      this.sessionService.username, this.documento.documentoNombre,
      signer.personaCorreo, signer.notificacionContactoId, opcioncorreo).subscribe((Respuesta: any) => {
        if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
          this.toast.success('Se ha enviado la notificación exitosamente!');
        } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
        } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
  }

  closeModal() {
    this.isDownloading = !this.isDownloading;
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.toast.clear();
  }
}
