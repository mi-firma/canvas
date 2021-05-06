import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import WebViewer, {
  CoreControls as _CoreControls,
  Annotations as _Annotations,
  Tools as _Tools,
  WebViewerInstance
} from '@pdftron/webviewer';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { TemplatesService } from 'src/app/servicios/templates.service';
import * as Utils from 'src/app/Utilidades/utils';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ListaMasivaComponent } from 'src/app/vistas/modales/lista-masiva/lista-masiva.component';
import { AnnotationType } from 'src/app/interfaces/Documents/document.interface';


const licenseKey = 'OLIMPIA IT SAS(olimpiait.com):OEM:MiFirma::B+:AMS(20211027):88B5E2D204D7380AB360B13AC9A2737860612FEDB9C3F535E57C699658E5832D8969BEF5C7';

@Component({
  selector: 'app-firmantes-template',
  templateUrl: './firmantes-template.component.html',
  styleUrls: ['./firmantes-template.component.css']
})
export class FirmantesTemplateComponent implements OnInit, AfterViewInit {
  @Input() idTemplate;
  @ViewChild('formulario', { static: false }) formulario;

  constructor(
    private templateService: TemplatesService,
    private router: Router,
    private activeModal: NgbActiveModal,
    private fdService: FiledataService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    public detector: ChangeDetectorRef,
    private loaderService: LoaderService,
    private modalService: NgbModal,
  ) { }

  webViewerInstance: WebViewerInstance;

  firmantes = [];
  roles = [];
  colors = [];
  auxiliarData: Array<any> = [];

  massive: boolean = true;

  fileName: string;

  file: Uint8Array;
  maxBytes = 20866662.4;
  annotationType = AnnotationType;

  containMe: boolean = false;

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.init();
    await this.init2();
    await this.initWebViewer();
  }

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.templateService.getAllParameters(this.idTemplate).subscribe((respuesta: any) => {
        if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
          this.firmantes = respuesta.data
          for (const temp of this.firmantes) {
            temp.color = '#FFFFFF';
            temp.enabled = false;
          }
          resolve();
        } else if (respuesta.status_code == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    });

  }

  async init2(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.templateService.getTemplate(this.idTemplate).subscribe((respuesta: any) => {
        if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
          this.file = Utils.stringToUint(respuesta.data.base64File);
          this.fileName = respuesta.data.name
          this.auxiliarData = respuesta.data.parameters
          resolve();
        } else if (respuesta.status_code == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    });
  }

  async initWebViewer(): Promise<void> {
    this.webViewerInstance = await WebViewer({
      licenseKey,
      path: '/assets/webviewer',
      disabledElements: [
        'header',
        'toolsHeader',
        'pageNavOverlay',
        'annotationPopup',
        'richTextPopup',
        'contextMenuPopup'
      ],
      enableFilePicker: false,
    }, document.getElementById('viewer'));

    const blob = new Blob([this.file], { type: 'application/pdf' });
    this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });

    this.webViewerInstance.docViewer.on('documentLoaded', async () => {
      const annotManager = this.webViewerInstance.annotManager;


      this.firmantes.forEach(async firmante => {
        await annotManager.importAnnotations(firmante.xfdfData);
      });

      annotManager.getAnnotationsList().forEach(annot => {
        if (!this.roles.includes(annot.CustomData.rol)) {
          this.roles.push(annot.CustomData.rol);
          this.colors.push(annot.CustomData.color);
          if (annot.CustomData.rol == 'Yo') {
            this.containMe = true;
          }
        }
      });
      for (let i = 0; i < this.firmantes.length; i++) {
        this.firmantes[i].color = this.colors[i];
        this.firmantes[i].tipo = this.roles[i];
        if (this.firmantes[i].tipo == 'Yo') {
          this.firmantes[i].nombre = localStorage.getItem('personaNombre');
          this.firmantes[i].correo = localStorage.getItem('correo');
          this.firmantes[i].enabled = true;
        } else {
          this.firmantes[i].nombre = '';
          this.firmantes[i].correo = '';
          this.firmantes[i].enabled = false;
        }
        this.detector.detectChanges();

        let annots = annotManager.getAnnotationsList().filter(annot => {
          return annot.CustomData.rol == this.firmantes[i].tipo
        });
        let signAnnot = 0;
        let textAnnot = 0;
        let dateAnnot = 0;
        let initAnnot = 0;
        for (const annot of annots) {
          if (annot.CustomData.type == AnnotationType.SIGNATURE) {
            signAnnot++;
          }
          if (annot.CustomData.type == AnnotationType.INITIALS) {
            initAnnot++;
          }
          if (annot.CustomData.type == AnnotationType.DATE) {
            dateAnnot++;
          }
          if (annot.CustomData.type == AnnotationType.TEXT) {
            textAnnot++;
          }
        }
        if (signAnnot >= 2 || initAnnot >= 2 || dateAnnot >= 2 || textAnnot >= 2) {
          this.massive = false
        }
      }
    });
  }

  changeRole(j: number, i: number, rol: string, event) {
    if (event.isUserInput) {
      this.firmantes[i].color = this.colors[j];
      if (rol == 'Yo') {
        this.firmantes[i].nombre = localStorage.getItem('personaNombre');
        this.firmantes[i].correo = localStorage.getItem('correo');
        this.firmantes[i].enabled = true;
      } else {
        this.firmantes[i].nombre = '';
        this.firmantes[i].correo = '';
        this.firmantes[i].enabled = false;
      }
    }
  }

  close(): void {
    this.activeModal.close();
  }

  formValidate() {
    this.formulario.nativeElement.reportValidity();
    return this.formulario.nativeElement.checkValidity();
  }

  continuar() {
    if (this.formValidate()) {
      const temp = new Set();
      const tempCorreo = new Set();

      const firmantes = []
      for (let index = 0; index < this.firmantes.length; index++) {
        if (temp.has(this.firmantes[index].tipo)) {
          this.toastr.warning('Todos los roles deben ser distintos');
          return;
        }
        temp.add(this.firmantes[index].tipo);
        if (this.firmantes[index].tipo != 'Yo' && this.firmantes[index].correo == this.sessionService.emailUser) {
          this.toastr.error("Para ser parte del documento usa el rol 'Yo' en tus plantillas.");
          return;
        }
        if (tempCorreo.has(this.firmantes[index].correo.trim().toUpperCase())) {
          this.toastr.warning('Todos los correos deben ser distintos');
          return;
        }
        tempCorreo.add(this.firmantes[index].correo.trim().toUpperCase());
        let data;

        for (let i = 0; i < this.auxiliarData.length; i++) {
          if (this.auxiliarData[i].annotationParameters[0].rol == this.firmantes[index].tipo) {
            data = {
              correo: this.firmantes[index].correo,
              nombre: this.firmantes[index].nombre,
              tipo: this.firmantes[index].tipo,
              annotations: this.firmantes[i].xfdfData,
            };
          }
        }

        firmantes.push(data);

      }
      const dataFile = {
        arrayBits: this.file,
        name: this.fileName
      };
      this.fdService.addFiles([dataFile]);
      this.fdService.addFirmantes(firmantes);
      this.router.navigateByUrl('main/firmador-pdftron');
      this.activeModal.close();
    }
  }

  checkInfoMassive() {
    let isValid = true
    for (let i = 0; i < this.firmantes.length - 1; i++) {
      if (this.firmantes[i].nombre == '' || !this.validateEmail(this.firmantes[i].correo.trim()) || this.firmantes[i].correo.trim() == '') {
        this.toastr.error(`Para usar la opcion de lista masiva los campos de los firmantes deben estar completos y correctos, sin contar el firmante ${this.firmantes.length}.`)
        isValid = false
      }
    }
    if (isValid) {
      return true
    } else {
      return false
    }
  }

  checkInfoMassive2() {
    let isValid = true
    for (let i = 0; i < this.firmantes.length - 1; i++) {
      if (this.firmantes[i].nombre == '' || !this.validateEmail(this.firmantes[i].correo) || this.firmantes[i].correo == '') {
        isValid = false
      }
    }
    if (isValid) {
      return true
    } else {
      return false
    }
  }

  descargarFormato() {
    this.templateService.getCsvTemplate(this.idTemplate).subscribe((data: any) => {
      const linkSource = `data:application/csv;base64,${data.data}`;
      const downloadLink = document.createElement('a');
      const name = 'formato.csv';
      downloadLink.href = linkSource;
      downloadLink.download = name;
      downloadLink.click();
    });
  }

  uploadListMasive(files: File[]): void {
    this.loaderService.startLoading();
    for (const file of files) {
      if (file.size > this.maxBytes) {
        this.loaderService.stopLoading();
        this.toastr.error('El formato ' + file.name + ' pesa mas de 19.9MB');
        return;
      }
      if (!this.verifyCSV(file.name)) {
        this.loaderService.stopLoading();
        this.toastr.error('El documento no es un CSV');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.templateService.uploadFileMassive((reader.result as string).split(',')[1], this.idTemplate)
          .subscribe((respuesta: any) => {
            if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
              this.useListaMasiva(respuesta.data);
              this.activeModal.close();
              this.loaderService.stopLoading();
            } else if (respuesta.status_code == 401) {
              this.sessionService.logout();
            } else if (respuesta.status_code == 400 && respuesta.messagge == 'No se logro obtener firmantes correctamente') {
              this.toastr.error('Asegurate que el excel corresponda a la plantilla utilizada y/o este bien diligenciado')
            } else {
              this.activeModal.close();
              this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
          }, (response: any) => {
            if (response.error && response.error.status_Code === 401) {
              this.sessionService.logout();
            } else if (response.error.status_code == 400 && response.error.messagge == 'No se logro obtener firmantes correctamente') {
              this.toastr.error('Asegurate que el excel corresponda a la plantilla utilizada y/o este bien diligenciado.')
            } else {
              this.activeModal.close();
              this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
          });
      }
    }
  }

  /**
 * Returns true if the document is a PDF
 * @param name The name of the document - with the extension
 */
  verifyCSV(name: string): boolean {
    const arr = name.split('.');
    const csv = 'csv';
    let typeDocument = arr[arr.length - 1];
    typeDocument = typeDocument.toLowerCase();
    return typeDocument === csv;
  }

  validateEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }

  useListaMasiva(data: any): void {
    this.firmantes[this.firmantes.length - 1].correo = 'masivo@temp.com'
    this.firmantes[this.firmantes.length - 1].nombre = 'Masivo'
    const firmantes = []
    for (let index = 0; index < this.firmantes.length; index++) {
      let data;
      for (let i = 0; i < this.auxiliarData.length; i++) {
        if (this.auxiliarData[i].annotationParameters[0].rol == this.firmantes[index].tipo) {
          data = {
            correo: this.firmantes[index].correo,
            nombre: this.firmantes[index].nombre,
            tipo: this.firmantes[index].tipo,
            annotations: this.firmantes[i].xfdfData,
          };
        }
      }

      firmantes.push(data);
    }
    const dataFile = {
      arrayBits: this.file,
      name: this.fileName
    };
    this.fdService.addFiles([dataFile]);
    this.fdService.addFirmantes(firmantes);
    const modalRef = this.modalService.open(ListaMasivaComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.dataLista = data;
    modalRef.componentInstance.dataFile = dataFile;
  }
}
