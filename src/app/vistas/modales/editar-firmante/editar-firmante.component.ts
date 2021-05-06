import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MensajesComponent } from '../mensajes/mensajes.component';

@Component({
  selector: 'app-editar-firmante',
  templateUrl: './editar-firmante.component.html',
  styleUrls: ['./editar-firmante.component.css']
})
export class EditarFirmanteComponent implements OnInit, OnDestroy {

  @Input() correo: string;
  @Input() solicitudFirmaToken: any;
  nuevoCorreo: string;
  formUpdateSigner = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
  });

  updateEmailSubscription: Subscription;

  constructor(
    private modalService: NgbActiveModal,
    private modalServiceMessage: NgbModal,
    public toast: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.nuevoCorreo = this.correo.trim();
  }

  /**
   * Returns the form control associated with the email input field
   */
  get Email() {
    return this.formUpdateSigner.get('correo');
  }

  /**
   * Updates the user email associated with a signer
   */
  actualizarEmail(): void {

    if (this.formUpdateSigner.valid) {

      const modalRef = this.modalServiceMessage.open(MensajesComponent, { centered: true});
      modalRef.componentInstance.tittle = 'Actualizar Firmante';
      modalRef.componentInstance.message = '¿Está seguro que desea actualizar el correo del firmante?';
      modalRef.result.then((result) => {

        if (result) {
          this.modalService.close(this.nuevoCorreo);
        }
      }, (error: any) => {
          this.modalService.close(null);
      });
    }
  }

  cancelar(): void {
    this.modalService.close(null);
  }

  ngOnDestroy(): void {
    if (this.updateEmailSubscription) {
      this.updateEmailSubscription.unsubscribe();
    }
  }

}
