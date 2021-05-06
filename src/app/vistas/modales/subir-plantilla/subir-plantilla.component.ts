import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { PDFDocument } from 'pdf-lib';
import { LoaderService } from 'src/app/core/services/loader.service';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { ScriptsService } from 'src/app/servicios/scripts.service';
import { AdminPlantillasComponent } from '../../main/components/admin-plantillas/admin-plantillas.component';


@Component({
  selector: 'app-subir-plantilla',
  templateUrl: './subir-plantilla.component.html',
  styleUrls: ['./subir-plantilla.component.css']
})
export class SubirPlantillaComponent implements OnInit, OnDestroy {

  @Input() prueba: AdminPlantillasComponent;
  maxBytes = 20866662.4;
  scriptsLoaded = false;
  // Collection of documents the user has added
  docs: any[] = [];
  clientId: string;

  constructor(
    private router: Router,
    private fdService: FiledataService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private scriptService: ScriptsService,
    private paramsService: ParamsService,
    private documentService: DocumentosService,
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
    this.scriptService.load('oneDrive').then(() => {
      this.scriptsLoaded = true;
    }).catch((error) => {
    });
    this.paramsService.OneDrive.subscribe((res: any) => {
      this.clientId = res;
    });
  }

  /**
   * Event that triggers when a file or a collection of files is dropped or chosen
   * @param files Collection of entry files
   */
  dropped(files: NgxFileDropEntry[]): void {
    this.loaderService.startLoading();
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (file.size <= this.maxBytes) {
            if (this.verifyPDF(file.name)) {
              const reader = new FileReader();
              reader.onloadend = (e: any) => {
                PDFDocument.load(new Uint8Array(e.target.result)).then(() => {
                  const base64 = this.arrayBufferToBase64(reader.result);
                  this.documentService.docHaveSign(base64).subscribe((res: any) => {
                    if (res.data.containsSign) {
                      this.toastr.error('No se puede modificar un documento con firmas digitales');
                    } else {
                      this.docs.push(file);
                      this.loaderService.stopLoading();
                      this.fdService.addFiles(this.docs);
                      this.router.navigateByUrl('main/plantilla');
                      this.activeModal.close();
                    }
                  });
                }).catch(() => {
                  this.loaderService.stopLoading();
                  this.toastr.error('Este documento está protegido con una contraseña, no se puede firmar digitalmente!');
                });
              };
              reader.readAsArrayBuffer(file);
            } else {
              this.loaderService.stopLoading();
              this.toastr.error('El documento no es un PDF');
            }
          } else {
            this.loaderService.stopLoading();
            this.toastr.error('El documento ' + file.name + ' pesa mas de 19.9MB');
          }
        });
      }
    }
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
   * Pushes the added documents to a file data service and navigates to the next view
   */
  continue(): void {
    this.fdService.addFiles(this.docs);
    this.router.navigate(['main/agregarfirmantes']);
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

  close(): void {
    this.activeModal.close();
  }

  oneDrive() {
    this.prueba.oneDrive();
  }
  /**
   * Returns true if the document is a PDF
   * @param name The name of the document - with the extension
   */
  verifyPDF(name: string): boolean {
    const arr = name.split('.');
    const pdf = 'pdf';
    let typeDocument = arr[arr.length - 1];
    typeDocument = typeDocument.toLowerCase();
    return typeDocument === pdf;
  }

  ngOnDestroy(): void {
    this.toastr.clear();
  }

}
