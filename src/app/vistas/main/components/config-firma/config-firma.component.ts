import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/servicios';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';

@Component({
    selector: 'app-config-firma',
    templateUrl: './config-firma.component.html',
    styleUrls: ['./config-firma.component.css']
})
export class ConfigFirmaComponent implements OnInit, OnDestroy {

    signatures = [];
    nombre: string;
    retrieveSignaturesSubscription: Subscription;
    deleteSignatureSubscription: Subscription;

    constructor(
        private modalService: NgbModal,
        public firmadorService: FirmadorService,
        public toast: ToastrService,
        public sessionService: SessionService,
        public router: Router
    ) { }

    ngOnInit() {
        this.init();
    }

    /**
     * Intitializes the user name and the list of signatures
     */
    init(): void {
        this.nombre = this.sessionService.username;
        this.retrieveGrafos();
    }

    /**
     * Returns the width of the signature canvas
     */
    getWidthSignaturePad(): number {
        if (window.innerWidth <= 640) {
            return window.innerWidth - 20 - 50;
        } else {
            return window.innerWidth * .8 * .8 - 20;
        }
    }

    /**
     * Retrieves the signatures associated with this user
     */
    retrieveGrafos(): void {
        this.retrieveSignaturesSubscription = this.firmadorService.ListarGrafo().subscribe((Respuesta: any) => {
            if (Respuesta.status_code == 200 || Respuesta.status_code == 201) {
                if (Respuesta.data.graphs != null) {
                    this.signatures = Respuesta.data.graphs;
                    for (const signature of this.signatures) {
                        signature.archivo = `data:image/${signature.tipoImagen};base64,${signature.archivo}`;
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
     * Event that triggers when a signature iamge has been saved
     * @param image URI base64 of signature image - null if operation was unsuccessful
     */
    onSave(image: string): void {
        if (image) {
            this.toast.success('Tu firma ha sido guardada exitosamente!');
            this.retrieveGrafos();
        } else {
            this.toast.error('No se pudo guardar la firma manuscrita!');
        }
    }

    /**
     * Deletes a signature from the list
     * @param i Index of the signature to be deleted
     */
    deleteSignature(i: number): void {
        const modalRef = this.modalService.open(MensajesComponent, { centered: true });
        modalRef.componentInstance.tittle = 'Eliminar Firma';
        modalRef.componentInstance.message = '¿Está seguro que desea eliminar esta firma?';
        modalRef.result.then((result) => {
            if (result) {
                this.deleteSignatureSubscription = this.firmadorService.EliminarGrafo(this.signatures[i].guid)
                    .subscribe((Respuesta: any) => {
                        if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                            this.toast.success('Firma eliminada exitosamente!');
                            this.retrieveGrafos();
                        } else if (Respuesta.status_code == 401) {
                            this.sessionService.logout();
                        } else {
                            this.toast.error('No se pudo eliminar la firma!');
                        }
                    });
            }
        }, (error: any) => { });
    }

    ngOnDestroy(): void {
        this.toast.clear();
        this.modalService.dismissAll();
        if (this.deleteSignatureSubscription) {
            this.deleteSignatureSubscription.unsubscribe();
        }
        if (this.retrieveSignaturesSubscription) {
            this.retrieveSignaturesSubscription.unsubscribe();
        }
    }
}
