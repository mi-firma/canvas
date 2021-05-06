import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PDFDocument } from 'pdf-lib';
import { LoaderService } from 'src/app/core/services/loader.service';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { ScriptsService } from 'src/app/servicios/scripts.service';
import { TemplatesService } from 'src/app/servicios/templates.service';
import { SubirPlantillaComponent } from 'src/app/vistas/modales/subir-plantilla/subir-plantilla.component';
import { FirmantesTemplateComponent } from 'src/app/vistas/modales/firmantes-template/firmantes-template.component';
import { ViewTemplateComponent } from 'src/app/vistas/modales/view-template/view-template.component';
import { SessionService } from 'src/app/servicios';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';

declare const OneDrive: any;

@Component({
  selector: 'app-admin-plantillas',
  templateUrl: './admin-plantillas.component.html',
  styleUrls: ['./admin-plantillas.component.css']
})
export class AdminPlantillasComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private fdService: FiledataService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private scriptService: ScriptsService,
    private paramsService: ParamsService,
    private documentService: DocumentosService,
    private router: Router,
    private templatesService: TemplatesService,
    private sessionService: SessionService
  ) { }

  menuOpen = false;
  lastIndexMenuOpen = -1;
  maxBytes = 20866662.4;
  scriptsLoaded = false;
  modalRef2: NgbModalRef;
  // Collection of documents the user has added
  docs: any[] = [];
  clientId: string;
  page: number = 1;
  templates = [];
  wordSearch: string = '';

  ngOnInit() {
    this.scriptService.load('oneDrive').then(() => {
      this.scriptsLoaded = true;
    }).catch((error) => {
    });
    this.paramsService.OneDrive.subscribe((res: any) => {
      this.clientId = res;
    });

    this.getTemplates();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.lastIndexMenuOpen !== -1 && this.templates.length > 0) {
      this.templates[this.lastIndexMenuOpen].menuOpen = false;
    }
  }

  menuOption(i: number, e: MouseEvent) {
    e.stopPropagation();
    this.lastIndexMenuOpen = i;
    if (this.lastIndexMenuOpen !== -1 && this.templates[i] !== this.templates[this.lastIndexMenuOpen]) {
      this.templates[this.lastIndexMenuOpen].menuOpen = false;
    }
    this.templates[i].menuOpen = !this.templates[i].menuOpen;
    this.lastIndexMenuOpen = i;
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Removes a document from the list
   * @param index The index of the file to be removed
   */
  deleteDoc(index: number): void {
    this.docs.splice(index, 1);
  }

  blobToFile(theBlob, fileName) {
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  crearPlantilla() {
    this.modalRef2 = this.modalService.open(SubirPlantillaComponent, { size: 'lg', centered: true });
    this.modalRef2.componentInstance.prueba = this;
  }

  getTemplates() {
    this.templatesService.getAllTemplates(this.page).subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
        this.templates = Respuesta.data.templates
        for (const temp of this.templates) {
          temp.menuOpen = false;
        }
      } else if (Respuesta.status_code == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  searchAllTemplates() {
    this.wordSearch = '';
    this.searchTemplates()
  }

  searchTemplates() {
    this.templatesService.getAllTemplates(this.page, this.wordSearch).subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
        this.templates = Respuesta.data.templates;
        for (const temp of this.templates) {
          temp.menuOpen = false;
        }
      } else if (Respuesta.status_code == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  deleteTemplate(i: number) {
    const modalRef = this.modalService.open(MensajesComponent, { centered: true });
    modalRef.componentInstance.tittle = 'Eliminar Plantilla';
    modalRef.componentInstance.message = '¿Está seguro que desea eliminar esta plantilla?';
    modalRef.result.then((result) => {
      if (result) {
        const id = this.templates[i].id
        this.templatesService.deleteTemplate(id).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.getTemplates();
          } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      }
    }, (error: any) => { });
  }

  viewTemplate(i: number) {
    const modalRef = this.modalService.open(ViewTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.idTemplate = this.templates[i].id;
  }

  editTemplate(i: number) {
    const id = this.templates[i].id;
    this.router.navigateByUrl('main/plantilla/' + id);
  }

  useTemplate(i: number) {
    const modalRef = this.modalService.open(FirmantesTemplateComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.idTemplate = this.templates[i].id;
  }

  verifyPDF(name: string): boolean {
    const arr = name.split('.');
    const pdf = 'pdf';
    let typeDocument = arr[arr.length - 1];
    typeDocument = typeDocument.toLowerCase();
    return typeDocument === pdf;
  }

  oneDrive() {
    let self = this
    const odOptions = {
      clientId: this.clientId,
      action: "download",
      multiSelect: false,
      advanced: {
        filter: "folder,.pdf"
      },
      success: function (files) {
        self.loaderService.startLoading();
        for (let index = 0; index < files.value.length; index++) {
          if (files.value[index].size <= self.maxBytes) {
            if (self.verifyPDF(files.value[index].name)) {
              self.fdService.getDocumentBlob(files.value[index]['@microsoft.graph.downloadUrl']).subscribe((res: any) => {
                var file = self.blobToFile(res, files.value[index].name);
                const reader = new FileReader();
                reader.onloadend = (e: any) => {
                  PDFDocument.load(new Uint8Array(e.target.result)).then(() => {
                    const base64 = self.arrayBufferToBase64(reader.result);
                    self.documentService.docHaveSign(base64).subscribe((res: any) => {
                      if (res.data.containsSign) {
                        self.toastr.error('No se puede modificar un documento con firmas digitales');
                      } else {
                        self.docs.push(file);
                        self.fdService.addFiles(self.docs);
                        self.router.navigateByUrl('main/plantilla')
                        self.modalRef2.close()
                      }
                    });
                  }).catch(() => {
                    self.loaderService.stopLoading();
                    self.toastr.error('Este documento está protegido con una contraseña, no se puede firmar digitalmente!');
                  });
                };
                reader.readAsArrayBuffer(file);
              });
            } else {
              self.loaderService.stopLoading();
              self.toastr.error('El documento no es un PDF');
            }
          } else {
            self.loaderService.stopLoading();
            self.toastr.error('El documento ' + files.value[index].name + ' pesa mas de 19.9MB');
          }
          if (index - 1 == files.value.length) {
            self.loaderService.stopLoading();
          }
        }
      },
      cancel: function () { self.toastr.info('Se ha cancelado el proceso'); },
      error: function (error: Error) {
        self.toastr.error('Ha ocurrido un error inesperado, intente nuevamente');
      }
    };
    OneDrive.open(odOptions);
  }

}
