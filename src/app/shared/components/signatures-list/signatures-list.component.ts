import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SessionService } from 'src/app/servicios';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { Subscription } from 'rxjs';
import { AgregarFirmaComponent } from 'src/app/vistas/modales/agregar-firma/agregar-firma.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signatures-list',
  templateUrl: './signatures-list.component.html',
  styleUrls: ['./signatures-list.component.css']
})
export class SignaturesListComponent implements OnInit, OnDestroy {
  @Input() maximumSignatures;

  @Output() signatureGuidChanged = new EventEmitter<string>();

  @Output() signatureUriChanged = new EventEmitter<string>();

  signatures: Array<any> = [];

  retrieveSignaturesSubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private firmadorService: FirmadorService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.retrieveSignatures();
  }

  /**
   * Retrieves the last maximumSignatures used by the user
   */
  retrieveSignatures(addsignature?:boolean): void {

    this.retrieveSignaturesSubscription = this.firmadorService.ListarGrafo().subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 201) {
        if (Respuesta.data.graphs != null) {
          this.signatures = Respuesta.data.graphs;
          for (const signature of this.signatures) {
            signature.archivo = `data:image/${signature.tipoImagen};base64,${signature.archivo}`;
          }
          if (this.signatures.length > this.maximumSignatures) {
            this.signatures.splice(0, this.signatures.length - this.maximumSignatures);
          }
          if(addsignature){
            this.chooseSignature(this.signatures[this.signatures.length-1].archivo,this.signatures[this.signatures.length-1].guid)
          }
        } else {
          this.signatures = [];
        }
      } else if (Respuesta.status_code == 204) {
        this.signatures = [];
      } else if (Respuesta.status_code == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  /**
   * Event that triggers when a new signature is selected
   *
   * @param base64 Uri Base64 selected signature
   * @param signatureGuid Signature unique identifier
   */
  chooseSignature(base64: string, signatureGuid: string): void {
    this.signatureGuidChanged.emit(signatureGuid);
    this.signatureUriChanged.emit(base64);
  }

  /**
   * Opens a modal to let the user create a new signature
   */
  addSignature(): void {
    const modalRef = this.modalService.open(AgregarFirmaComponent, { size: 'lg', centered: true });
    modalRef.result.then((base64) => {
      if (base64) {
        //this.signatureUriChanged.emit(base64);
        this.retrieveSignatures(true);
      }
    }).catch((error: any) => { });
  }

  ngOnDestroy(): void {
    this.retrieveSignaturesSubscription.unsubscribe();
    this.modalService.dismissAll();
  }
}
