import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { AppPdfViewerComponent } from 'src/app/vistas/modales/pdf-viewer/pdf-viewer.component';
import * as JSZip from 'jszip';
import FileSaver from 'file-saver';
import { SessionService } from 'src/app/servicios';
import * as Utils from 'src/app/Utilidades/utils';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateFolderComponent } from 'src/app/vistas/modales/create-folder/create-folder.component';
import { ListFoldersComponent } from 'src/app/vistas/modales/list-folders/list-folders.component';
import { ShareDocComponent } from 'src/app/vistas/modales/share-doc/share-doc.component';
import { MatOptionSelectionChange } from '@angular/material';
import { folder } from 'jszip';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';

@Component({
    selector: 'app-repositorio',
    templateUrl: './repositorio.component.html',
    styleUrls: ['./repositorio.component.css']
})
export class RepositorioComponent implements OnInit, OnDestroy {
    isThirdParty = localStorage.getItem('isThirdParty') == 'true';
    docs: Array<any> = [];
    folders: Array<any> = [];
    rihtArrow: boolean = true;
    page = 1;
    pageLoaded = [0]
    pageLength = []
    pageSizes = [10, 30, 50]
    maxPerPage: number
    pageSize = 10;
    lastIndexMenuOpen = -1;
    lastIndexMenuOpenFolders = -1;
    filterMenuIsShowing = false;
    documentsSubscription: Subscription;
    retrieveDocumentSubscription: Subscription;
    retrieveDocumentViewSubscription: Subscription;
    isDownloading: boolean = false;
    isDownloadingFolder: boolean = false;
    wordSearch: string = '';

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private documentosService: DocumentosService,
        private sessionService: SessionService,
        private toastr: ToastrService,
        public detector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getDocuments()
    }

    getDocuments() {
        this.documentsSubscription = this.documentosService.listarDocumentos2(this.page, this.pageSize).subscribe((Respuesta: any) => {
            if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                if (Respuesta.data.documents.length >= 0) {
                    this.maxPerPage = Respuesta.data.documents.length;
                    this.pageLength.push(this.maxPerPage)
                    this.docs = Respuesta.data.documents;
                    for (const doc of this.docs) {
                        doc.selected = false;
                        doc.menuOpen = false;
                    }
                    this.pageLoaded[this.page - 1] = 1
                    this.pageLoaded.push(0)
                }
                if (Respuesta.data.envelopes.length >= 0) {
                    this.folders = Respuesta.data.envelopes;
                    for (const folder of this.folders) {
                        folder.selected = false;
                        folder.menuOpen = false;
                    }
                }
            } else if (Respuesta.status_code == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });
    }

    changeSizePage(event) {
        this.searchAllDocuments()
    }

    searchAllDocuments() {
        this.lastIndexMenuOpenFolders = -1;
        this.lastIndexMenuOpen = -1;
        this.wordSearch = '';
        this.searchDocuments()
    }

    searchDocuments() {
        this.page = 1;
        this.pageLoaded = [0]
        this.pageLength = []
        if (this.wordSearch == '') {
            this.getDocuments()
        } else {
            this.documentsSubscription = this.documentosService.listarDocumentos2(this.page, this.pageSize, this.wordSearch).subscribe((Respuesta: any) => {
                if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                    if (Respuesta.data.documents.length >= 0) {
                        this.docs = Respuesta.data.documents;
                        this.maxPerPage = Respuesta.data.documents.length;
                        this.pageLength.push(this.maxPerPage)
                        for (const doc of this.docs) {
                            doc.selected = false;
                            doc.menuOpen = false;
                        }
                        this.pageLoaded[this.page - 1] = 1
                        this.pageLoaded.push(0)
                    }
                    if (Respuesta.data.envelopes.length >= 0) {
                        this.folders = [];
                        for (const folder of this.folders) {
                            folder.selected = false;
                            folder.menuOpen = false;
                        }
                    }
                } else if (Respuesta.status_code == 401) {
                    this.sessionService.logout();
                } else {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                }
            });
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
        this.documentosService.createEnvelope(name).subscribe((Respuesta: any) => {
            if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
                this.toastr.success('Carpeta creada correctamente')
                this.searchAllDocuments()
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

    modalUpdateFolder(id:string){
        const modalRef = this.modalService.open(CreateFolderComponent, { centered: true });
        modalRef.componentInstance.update = true;
        modalRef.result.then((name) => {
            if (name) {
                this.updateFolder(name,id)
            }
        });
    }

    updateFolder(name:string,id:string){
        this.documentosService.updateEnvelope(name,id).subscribe((Respuesta: any) => {
            if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
                this.toastr.success('Nombre cambiado correctamente')
                this.searchAllDocuments()
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

    modalDeleteDocument(serial:string){
        const modalRef = this.modalService.open(MensajesComponent, { centered: true });
        modalRef.componentInstance.tittle = 'Eliminar Documento';
        modalRef.componentInstance.message = '¿Está seguro que desea eliminar este documento?';
        modalRef.componentInstance.information = 'El documento no podrá ser recuperado';
        modalRef.result.then((result) => {
            if (result) {
                this.documentosService.deleteDocument(serial).subscribe((Respuesta: any) => {
                    if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                        this.toastr.success('Documento eliminado')
                        this.searchAllDocuments()
                    } else if (Respuesta.status_code == 401) {
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
        }, (error: any) => { });
    }

    modalMoveFile(documentId: string,documentsArr?:Array<any>) {
        const modalRef = this.modalService.open(ListFoldersComponent, { centered: true });
        modalRef.componentInstance.raiz = false;
        modalRef.result.then((folderId) => {
            if (folderId) {
                this.moveFile(folderId, documentId,documentsArr)
            }
        });
    }

    moveFile(folderId: string, documentId: string,documentsArr?:Array<any>) {
        let arrayDocs = []
        if(documentsArr){
            arrayDocs = documentsArr;
        }else{
            arrayDocs.push(documentId)
        }
        this.documentosService.associateFile(folderId, arrayDocs).subscribe((Respuesta: any) => {
            if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
                this.toastr.success('Documento movido correctamente')
                this.searchAllDocuments()
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

    shareFile(serialDoc: string) {
        const modalRef = this.modalService.open(ShareDocComponent, { centered: true });
        modalRef.componentInstance.serialDoc = serialDoc;
    }

    openFolder(id: string, name: string) {
        this.router.navigateByUrl('main/repositorio/' + name + '/' + id)
    }

    deleteFolder(name: string) {
        this.documentosService.deleteEnvelope(name, this.sessionService.emailUser).subscribe((Respuesta: any) => {
            if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                this.toastr.success('Carpeta eliminada correctamente')
                this.searchAllDocuments()
            } else if (Respuesta.status_code == 400 && Respuesta.message == "The envelope is associated with one or more files") {
                this.toastr.error('Desasocie todo los documentos de esta carpeta antes de eliminarla.')
            } else if (Respuesta.status_code == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        }, (response: any) => {
            if (response.error && response.error.status_code === 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });
    }

    nextPage() {
        this.page++;
        if (this.pageLoaded[this.page - 1] == 0) {
            this.documentsSubscription = this.documentosService.listarDocumentos2(this.page, this.pageSize, this.wordSearch).subscribe((Respuesta: any) => {
                if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                    if (Respuesta.data.documents.length >= 0) {
                        this.maxPerPage = Respuesta.data.documents.length;
                        this.pageLength.push(this.maxPerPage)
                        for (const doc of Respuesta.data.documents) {
                            doc.selected = false;
                            doc.menuOpen = false;
                            this.docs.push(doc);
                        }
                        this.pageLoaded[this.page - 1] = 1
                        this.pageLoaded.push(0)
                    }
                } else if (Respuesta.status_code == 401) {
                    this.sessionService.logout();
                } else {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                }
            });
        }
    }

    prevPage() {
        this.maxPerPage = 10
        this.page--;
    }

    expediente(idFile: string) {
        this.router.navigateByUrl('main/expediente/' + idFile)
    }


    @HostListener('document:click', ['$event'])
    documentClick(event: any): void {
        if (this.lastIndexMenuOpen !== -1) {
            this.docs[this.lastIndexMenuOpen].menuOpen = false;
        }
        if (this.lastIndexMenuOpenFolders !== -1) {
            this.folders[this.lastIndexMenuOpenFolders].menuOpen = false;
        }
        if (event.toElement.id !== 'tool-option') {
            this.filterMenuIsShowing = false;
        }
    }

    /**
     * Returns whether or not the current width and height represent a mobile device.
     */
    get detectMob(): boolean {
        return ((window.innerWidth <= 640) && (window.innerHeight <= 600));
    }

    /**
     * Returns true if at least one document is selected
     */
    isOneSelected(): boolean {
        for (const doc of this.docs) {
            if (doc.selected) {
                return true;
            }
        }
        return false;
    }

    /**
     * Goes to the detail page of the document
     * @param doc the selected document
     */
    infoDocumento(doc: any) {
        this.router.navigate([`main/info-documento/${doc.fileSerial}/${doc.fileName}/${doc.signatureProcessStatusName}/${doc.requestType}`]);
    }

    /**
     * Downloads a document
     * @param guid An unique identifier of the document
     * @param nombre The name of the document
     */
    descargar(guid: string, nombre: string) {
        this.retrieveDocumentSubscription = this.documentosService.recuperarDocumento(guid).subscribe((Respuesta: any) => {
            if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
                const linkSource = `data:application/pdf;base64,${Respuesta.data.fileBase64}`;
                const downloadLink = document.createElement('a');
                const name = nombre;
                downloadLink.href = linkSource;
                downloadLink.download = name;
                downloadLink.click();
                //this.isDownloading = true;
            } else if (Respuesta.statusCode == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });
    }

    /**
     * Selects/Deselects all documents
     */
    checkDocs(): void {
        if (this.isOneSelected()) {
            this.setSelectionDocs(false);
        } else {
            this.setSelectionDocs(true);
        }
    }

    /**
     * Sets the selected status of all buttons
     * @param selected The new status
     */
    setSelectionDocs(selected: boolean): void {
        for (const doc of this.docs) {
            doc.selected = selected;
        }
    }

    setSelectionFolders(selected: boolean): void {
        for (const folder of this.folders) {
            folder.selected = selected;
        }
    }

    /**
     * Inserts a document name to the hashset
     * @param docs Hashset of file names
     * @param docName file name to be inserted
     * @param suffix the current suffix value to append
     */
    appendDocName(docs: object, docName: string, suffix: number): string {
        const docNameAltered = this.transformName(docName, suffix);
        if (docs[docNameAltered] === undefined) {
            docs[docNameAltered] = true;
            return docNameAltered;
        } else {
            return this.appendDocName(docs, docName, suffix + 1);
        }
    }

    /**
     * Transform a file name according to the number of ocurrences of that file name
     */
    transformName(docName: string, suffix: number): string {
        if (suffix === 0) {
            return docName;
        }
        return docName + '(' + suffix + ')';
    }


    modalDownloadDocs() {
        let atLeastOne = false;
        for (const doc of this.docs) {
            if (doc.selected) {
                atLeastOne = true;
            }
        }

        if (atLeastOne) {
            this.isDownloading = true;
        } else {
            this.toastr.warning('Por favor seleccione al menos un documento!');
        }
    }

    /**
     * Downloads all documents that have been selected
     */

    async downloadAll() {
        const zip = new JSZip();
        // Hashtable used for storing the file names and perform efficent searches
        const nombres: object = {};

        let atLeastOne = false;

        // This is done sequentially because the algorithm used is designed as such
        for (const doc of this.docs) {
            if (doc.selected) {
                const base64: any = await this.documentosService.recuperarDocumento(doc.fileSerial).toPromise();
                if (base64.statusCode == 200 || base64.statusCcode == 204 || base64.statusCode == 201) {
                    const blob = Utils.b64toBlob(`data:application/pdf;base64,${base64.data.fileBase64}`);
                    const docName = this.appendDocName(nombres, doc.fileName.substr(0, doc.fileName.length - 4), 0);
                    zip.file(docName + '.pdf', blob);
                    atLeastOne = true;
                } else if (base64.statusCode == 401) {
                    this.sessionService.logout();
                } else {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                }
            }
        }

        if (atLeastOne) {
            zip.generateAsync({ type: 'blob' }).then((content) => {
                FileSaver.saveAs(content, 'Documentos.zip');
            });

            this.setSelectionDocs(false);
        } else {
            this.toastr.warning('Por favor seleccione al menos un documento!');
        }
    }

    moveDocuments() {
        for (const folder of this.folders) {
            if (folder.selected) {
                this.toastr.warning('No puede mover carpetas')
                return
            }
        }
        let atLeastOne = false;
        let docs = []
        for (const doc of this.docs) {
            if (doc.selected) {
                atLeastOne = true;
                docs.push(doc.fileSerial)
            }
        }

        if (atLeastOne) {
            this.modalMoveFile('',docs)
        } else {
            this.toastr.warning('Por favor seleccione al menos un documento!');
        }
    }

    /**
     * Shows a PDF document
     * @param guid An unique identifier of the document
     * @param nombre The name of the document
     */
    verPDF(guid: string, nombre: string) {
        this.retrieveDocumentViewSubscription = this.documentosService.recuperarDocumento(guid).subscribe((Respuesta: any) => {
            if (Respuesta.statusCode == 200 || Respuesta.statusCode == 204 || Respuesta.statusCode == 201) {
                const modalRef = this.modalService.open(AppPdfViewerComponent, { size: 'lg' });
                modalRef.componentInstance.name = nombre;
                modalRef.componentInstance.pdfsrc = `data:application/pdf;base64,${Respuesta.data.fileBase64}`;
            } else if (Respuesta.statusCode == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });
    }

    /**
     * Toggles the selected menu
     * @param doc The index of the document associated with the selected menu
     */
    menuOption(i: number, e: MouseEvent) {
        e.stopPropagation();
        if (this.lastIndexMenuOpen !== -1 && this.docs[i] !== this.docs[this.lastIndexMenuOpen]) {
            this.docs[this.lastIndexMenuOpen].menuOpen = false;
        }
        this.docs[i].menuOpen = !this.docs[i].menuOpen;
        this.lastIndexMenuOpen = i;
    }

    menuOptionFolders(i: number, e: MouseEvent) {
        e.stopPropagation();
        if (this.lastIndexMenuOpenFolders !== -1 && this.folders[i] !== this.folders[this.lastIndexMenuOpenFolders]) {
            this.folders[this.lastIndexMenuOpenFolders].menuOpen = false;
        }
        this.folders[i].menuOpen = !this.folders[i].menuOpen;
        this.lastIndexMenuOpenFolders = i;
    }

    /**
     * @param solicitudfirma Identifier
     */
    FirmarDocumento(solicitudfirma: string) {
        this.router.navigateByUrl('/otros-firmantes/' + solicitudfirma);
    }

    checkDownload() {
        let docs = false;
        let folders = false;
        let repeatFolder = false
        for (const doc of this.docs) {
            if (doc.selected) {
                docs = true;
            }
        }

        for (const folder of this.folders) {
            if (folder.selected) {
                folders = true
            }
        }
        let count = 0

        for (const folder of this.folders) {
            if (folder.selected) {
                count++
                if (count > 1) {
                    repeatFolder = true;
                }
            }
        }

        if (docs && folders) {
            this.toastr.error('No puede descargar carpetas y documentos juntos.')
        } else if (docs && !folders) {
            this.modalDownloadDocs()
        } else if (!docs && folders && !repeatFolder) {
            this.isDownloadingFolder = true;
        } else if (!docs && folders && repeatFolder) {
            this.toastr.warning('Solo puede descargar una carpeta al tiempo.')
        } else if (!docs && !folders) {
            this.toastr.warning('Por favor seleccione al menos un documento o una carpeta! ')
        }



    }

    async downloadFolder(docs: Array<any>) {
        const zip = new JSZip();
        // Hashtable used for storing the file names and perform efficent searches
        const nombres: object = {};

        let atLeastOne = false;

        // This is done sequentially because the algorithm used is designed as such
        for (const doc of docs) {

            const base64: any = await this.documentosService.recuperarDocumento(doc).toPromise();
            if (base64.statusCode == 200 || base64.statusCcode == 204 || base64.statusCode == 201) {
                const blob = Utils.b64toBlob(`data:application/pdf;base64,${base64.data.fileBase64}`);
                const docName = this.appendDocName(nombres, base64.data.fileName.substr(0, base64.data.fileName.length - 4), 0);
                zip.file(docName + '.pdf', blob);
                atLeastOne = true;
            } else if (base64.statusCode == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }

        }
        let nameFolder = ''
        for (const folder of this.folders) {
            if (folder.selected) {
                nameFolder = folder.sobreNombre
            }
        }
        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, nameFolder);
        });

        this.setSelectionFolders(false);
    }

    descargarCarpeta(j: number) {
        this.folders[j].selected = true;
        this.isDownloadingFolder = true;
    }


    /**
     * Toggles the filter menu
     * @param e The mouse event information
     */
    toggleFilterSelection(e: MouseEvent): void {
        e.stopPropagation();
        this.filterMenuIsShowing = !this.filterMenuIsShowing;
    }

    closeModal() {
        this.isDownloading = !this.isDownloading;
        this.downloadAll()
    }

    closeModalFolder() {
        this.isDownloadingFolder = !this.isDownloadingFolder;
        let idFolder = ''
        for (const folder of this.folders) {
            if (folder.selected) {
                idFolder = folder.sobreIdentificador
            }
        }
        let Serialdocs = []
        this.documentosService.downloadFolder(idFolder, this.sessionService.emailUser).subscribe((Respuesta: any) => {
            if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                Serialdocs = Respuesta.data.Documents
                if (Serialdocs.length > 0) {
                    this.downloadFolder(Serialdocs)
                } else {
                    this.toastr.error('Esta carpeta no contiene documentos');
                }
            } else if (Respuesta.status_code == 401) {
                this.sessionService.logout();
            } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
        });

    }


    ngOnDestroy(): void {
        this.modalService.dismissAll();
        this.toastr.clear();

        if (this.documentsSubscription) {
            this.documentsSubscription.unsubscribe();
        }
        if (this.retrieveDocumentSubscription) {
            this.retrieveDocumentSubscription.unsubscribe();
        }
        if (this.retrieveDocumentViewSubscription) {
            this.retrieveDocumentViewSubscription.unsubscribe();
        }
    }
}
