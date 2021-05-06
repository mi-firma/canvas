import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { CreateFolderComponent } from '../create-folder/create-folder.component';

@Component({
  selector: 'app-list-folders',
  templateUrl: './list-folders.component.html',
  styleUrls: ['./list-folders.component.css']
})
export class ListFoldersComponent implements OnInit {

  @Input() raiz : boolean;
  folderId: string = '';
  statusRaiz: boolean = false;

  constructor(
    private documentsService: DocumentosService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  folders = []

  ngOnInit() {
    this.listFolders()
  }

  listFolders() {
    this.documentsService.listEnvelopes().subscribe((Respuesta: any) => {
      if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
        if(Respuesta.data.length > 0){
          this.folders = Respuesta.data
        }else{
          this.toastr.error('No posee carpetas para mover este documento.')
          this.activeModal.close()
        }
      } else if (Respuesta.statusCode == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    }, (response: any) => {
      if (response.error && response.error.status_Code === 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  disasociate(){
    this.activeModal.close('dis');
  }

  selectFolder(){
    if (this.statusRaiz) {
      this.disasociate();
    } else {
      this.activeModal.close(this.folderId);
    }
  }

  close() {
    this.activeModal.close()
  }

  selectItem(folderId: string, statusRaiz: boolean) {
    if (!statusRaiz) {
      this.folderId = (this.folderId === folderId) ? '': folderId;
      this.statusRaiz = statusRaiz;
    } else {
      this.folderId = folderId;
      this.statusRaiz = !this.statusRaiz;
    }
  }

  modalCreateFolder() {
    const modalRef = this.modalService.open(CreateFolderComponent, { centered: true });
    modalRef.result.then((name) => {
        if (name) {
            this.createFolder(name)
        }
    });
  }

  createFolder(name: string) {
    this.documentsService.createEnvelope(name).subscribe((Respuesta: any) => {
        if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
            this.toastr.success('Carpeta creada correctamente')
            this.folders = []
            this.listFolders()
        } else if (Respuesta.statusCode == 401) {
            this.sessionService.logout();
        } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
    }, (response: any) => {
        if (response.error && response.error.status_Code === 401) {
            this.sessionService.logout();
        } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
    });
}

}
