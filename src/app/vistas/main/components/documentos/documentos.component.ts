import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { Router } from '@angular/router';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { ToastrService } from 'ngx-toastr';
import { PDFDocument } from 'pdf-lib';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ScriptsService } from 'src/app/servicios/scripts.service';
import { ParamsService } from 'src/app/servicios/params/params.service';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { SessionService } from 'src/app/servicios';

declare const OneDrive: any;

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit, OnDestroy {
  isThirdParty = localStorage.getItem('isThirdParty') == 'true';
  thirdPartyLogoUrl = localStorage.getItem('thirdPartyLogoUrl');
  thirdPartyColor = localStorage.getItem('thirdPartyColor');
  thirdPartyMessage = localStorage.getItem('thirdPartyMessage');
  // Maximum size allowed per document
  maxBytes = 20866662.4;
  scriptsLoaded = false;
  // Collection of documents the user has added
  docs: any[] = [];
  clientId: string;
  filterMenuIsShowing = false;
  selectedCreateFolder = false;
  nameFolder: string = '';

  constructor(
    private router: Router,
    private fdService: FiledataService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private scriptService: ScriptsService,
    private paramsService: ParamsService,
    private documentService: DocumentosService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    
    window.onmessage= this.messageHandler; //Allows for cross domain messaging: working with add-in 
    this.scriptService.load('oneDrive').then(() => {
      this.scriptsLoaded = true;
    }).catch((error) => {
    });
    this.paramsService.OneDrive.subscribe((res: any) => {
      this.clientId = res;
    });  
    this.getFileFromLocal();    
    this.fdService.addAllFiles([]);
    this.fdService.addFilesConfig([]);
  }
 /** Event triggered when a message comes from other website. Only specific domains are allowed, for security reasons  */
  messageHandler(event) {
    //localStorage.setItem('hello', 'world');
    const domains = [
      "https://localhost:2000",
      "http://localhost",
      "https://mifirma.centralus.cloudapp.azure.com" //allow access to addin webapp
    ]
    if (!domains.includes(event.origin)){
      console.log('Unauthorized!');
      return;
    }      
    const { action, key, value } = event.data
    if (action == 'save'){
      if(key =='refresh'){
        window.location.href = '/main/documentos';
      } else {
        localStorage.setItem(key, value);
      }     
      
    } else if (action == 'get') {
      const dataItem = JSON.parse(window.localStorage.getItem(key))
      event.source.postMessage({
        action: 'returnData',
        key,
        dataItem
      }, '*')
    }
  }

 /**Checks if there is any content in localstorage. If there is, it will be added to the sign process  */
 async getFileFromLocal() { 
  
  let self = this;
  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

const b64Data = localStorage.getItem('word-document1');
   if (b64Data == "" || b64Data == undefined || b64Data == null) {
     return;
   }
const contentType = 'document/pdf';
const documentName = localStorage.getItem('word-document-name1') + '.pdf';
const blob = b64toBlob(b64Data, contentType);
var file = self.blobToFile(blob, documentName);
const reader = new FileReader();
reader.onloadend = (e: any) => {
  PDFDocument.load(new Uint8Array(e.target.result)).then(() => {  
    const base64 = self.arrayBufferToBase64(reader.result);
    self.documentService.docHaveSign(base64).subscribe((res: any) => {
      if (res.data.containsSign) {
        self.toastr.error('No se puede modificar un documento con firmas digitales');
      } else {
        self.docs.push(file);
      }
    });
  }).catch(() => {
    self.loaderService.stopLoading();
    //self.toastr.error('Este documento está protegido con una contraseña, no se puede firmar digitalmente!');
  });
};
reader.readAsArrayBuffer(file);

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
                      if(document.querySelector(".drop-box-cont")){
                        document.querySelector(".drop-box-cont").className = 'drop-box-cont3';
                      }
                      this.loaderService.stopLoading();
                    }
                  })
                }).catch(() => {
                  this.loaderService.stopLoading();
                  this.toastr.error('Este documento está protegido con una contraseña, no se puede firmar digitalmente!');
                });
              };
              reader.readAsArrayBuffer(file);
            } else {
              if (file.name.length > 100) {
                this.loaderService.stopLoading();
                this.toastr.error('El nombre del documento no puede ser mayor a 100 caracteres');
              } else {
                this.loaderService.stopLoading();
                this.toastr.error('El documento no es un PDF');
              }
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
  async continue(): Promise<void> {
    if (this.selectedCreateFolder) {
      let validDocs = this.docs.filter(x => x.selected === true);
      console.log(validDocs);
      if (this.nameFolder.trim() === '') {
        this.toastr.error('El nombre de carpeta no puede estar en blanco.');
        return;
      } else if (validDocs.length === 0) {
        this.toastr.error('Al menos un documento debe asociarse a la nueva carpeta.');
        return;
      } else {
        const envelopeId = await this.createFolder(this.nameFolder);
        this.docs.filter(x => x.selected === true).forEach(x => x.envelopeId = envelopeId);
      }
    }
    this.docs.filter(x => x.selected === undefined).forEach(x => x.selected = false);
    this.fdService.addFiles(this.docs);
    this.router.navigate(['main/agregarfirmantes']);
  }

  templates(){
    this.router.navigateByUrl('main/plantillas')
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
  
  oneDrive() {
    let self = this;
    const odOptions = {
      clientId: this.clientId,
      action: "download",
      multiSelect: true,
      advanced: {
        filter: "folder,.pdf"
      },
      success: function (files) {
        self.loaderService.startLoading();
        for (let index = 0; index < files.value.length; index++) {
          if (files.value[index].size <= self.maxBytes) {
            if (self.verifyPDF(files.value[index].name)) {
              self.fdService.getDocumentBlob(files.value[index]['@microsoft.graph.downloadUrl']).subscribe((res: any) => {
                var file = self.blobToFile(res, files.value[index].name)
                const reader = new FileReader();
                reader.onloadend = (e: any) => {
                  PDFDocument.load(new Uint8Array(e.target.result)).then(() => {  
                    const base64 = self.arrayBufferToBase64(reader.result);
                    self.documentService.docHaveSign(base64).subscribe((res: any) => {
                      if (res.data.containsSign) {
                        self.toastr.error('No se puede modificar un documento con firmas digitales');
                      } else {
                        self.docs.push(file);
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
              if (files.value[index].name.length > 100){
                self.loaderService.stopLoading();
                self.toastr.error('El nombre del documento no puede ser mayor a 100 caracteres');
              } else {
                self.loaderService.stopLoading();
                self.toastr.error('El documento no es un PDF');
              }
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
  /**
   * Returns true if the document is a PDF
   * @param name The name of the document - with the extension
   */
  verifyPDF(name: string): boolean {
    if (name.length > 100) {
      return false;
    }
    const arr = name.split('.');
    const pdf = 'pdf';
    let typeDocument = arr[arr.length - 1];
    typeDocument = typeDocument.toLowerCase();
    return typeDocument === pdf;
  }

  setSelectionDocs(selected: boolean): void {
    for (const doc of this.docs) {
        doc.selected = selected;
    }
  }

  toggleFilterSelection(e: MouseEvent): void {
    e.stopPropagation();
    this.filterMenuIsShowing = !this.filterMenuIsShowing;
  }

  isOneSelected(): boolean {
    for (const doc of this.docs) {
        if (doc.selected) {
            return true;
        }
    }
    return false;
  }

  checkDocs(): void {
    if (this.isOneSelected()) {
        this.setSelectionDocs(false);
    } else {
        this.setSelectionDocs(true);
    }
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (event.toElement.id !== 'tool-option') {
        this.filterMenuIsShowing = false;
    }
  }

  createFolder(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.documentService.createEnvelope(name).subscribe((Respuesta: any) => {
        if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
            this.toastr.success('Carpeta creada correctamente')
            resolve(Respuesta.data.envelopeId);
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
    });

  }

  showCheckDocuments() {
    if (!this.selectedCreateFolder) {
      for (const doc of this.docs) {
        doc.selected = false;
       }
    }

    return this.selectedCreateFolder;
  }

  ngOnDestroy(): void {
    this.toastr.clear();
  }
}
