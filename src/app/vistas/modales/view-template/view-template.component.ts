import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import WebViewer, {
  CoreControls as _CoreControls,
  Annotations as _Annotations,
  Tools as _Tools,
  WebViewerInstance
} from '@pdftron/webviewer';
import { SessionService } from 'src/app/servicios';
import { TemplatesService } from 'src/app/servicios/templates.service';
import * as Utils from 'src/app/Utilidades/utils';


const licenseKey = 'OLIMPIA IT SAS(olimpiait.com):OEM:MiFirma::B+:AMS(20211027):88B5E2D204D7380AB360B13AC9A2737860612FEDB9C3F535E57C699658E5832D8969BEF5C7';

@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.css']
})
export class ViewTemplateComponent implements OnInit {
  @Input() idTemplate;
  constructor(
    private templateService: TemplatesService,
    private router: Router,
    private activeModal: NgbActiveModal,
    private sessionService: SessionService,
  ) { }

  webViewerInstance: WebViewerInstance;

  annotations = []

  file: Uint8Array;

  ngOnInit(){

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
          this.annotations = respuesta.data
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
    this.webViewerInstance.disableFeatures([
      this.webViewerInstance.Feature.Ribbons,
      this.webViewerInstance.Feature.TextSelection,
      this.webViewerInstance.Feature.NotesPanel,
      this.webViewerInstance.Feature.FilePicker,
      this.webViewerInstance.Feature.Print,
      this.webViewerInstance.Feature.Download,
    ]);

    const blob = new Blob([this.file], { type: 'application/pdf' });
    this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });

    this.webViewerInstance.docViewer.on('documentLoaded', async () => {
      const annotManager = this.webViewerInstance.annotManager;


      this.annotations.forEach(async firmante => {
        await annotManager.importAnnotations(firmante.xfdfData);
      });

      const annotationsList = annotManager.getAnnotationsList();


      for (const annot of annotationsList) {
        annot.NoMove = true;
        annot.NoResize = true;
        annot.NoRotate = true;
      }

    });
  }

  closePDF() {
    this.activeModal.close();
  }

}
