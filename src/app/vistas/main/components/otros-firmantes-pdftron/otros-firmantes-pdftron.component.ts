import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import WebViewer, { Annotations, CoreControls, WebViewerInstance } from '@pdftron/webviewer';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnnotationType, IAnnotation, IDocument } from 'src/app/interfaces/Documents/document.interface';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { APIResponse, APIResponse2 } from 'src/app/modelos/Base/response.model';
import { map } from 'rxjs/operators';
import * as Jimp from 'jimp';
import * as Utils from 'src/app/Utilidades/utils';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PinFirmadorComponent } from 'src/app/vistas/modales/pin-firmador/pin-firmador.component';
import { Dimension } from 'src/app/modelos/dimension.model';
import { Point } from 'src/app/modelos/point.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment-timezone';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';
import { RejectSignComponent } from 'src/app/vistas/modales/reject-sign/reject-sign.component';

const licenseKey = 'OLIMPIA IT SAS(olimpiait.com):OEM:MiFirma::B+:AMS(20211027):88B5E2D204D7380AB360B13AC9A2737860612FEDB9C3F535E57C699658E5832D8969BEF5C7';

export let browserRefresh = false;

@Component({
  selector: 'app-otros-firmantes',
  templateUrl: './otros-firmantes-pdftron.component.html',
  styleUrls: ['./otros-firmantes-pdftron.component.css']
})
export class OtrosFirmantesPDFTRONComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('viewer', { static: false }) viewer: ElementRef;

  @ViewChild('viewerScroll', { static: false }) viewerScroll: ElementRef;

  interval

  noTimeOut: boolean = true

  fieldSignConfigured: boolean = false;

  webViewerInstance: WebViewerInstance;

  signatureProcessEncoded: string;

  documents: Array<IDocument> = [];

  currentDocumentIndex = 0;

  modalIsShowing = true;

  currentFont = 0;

  secondToUnlock: number

  fonts = ['Times-Roman', 'Helvetica', 'Courier']

  isConfigured = false;

  signaturesListIsShowing = false;

  hasSignedDocuments = false;

  indexConfiguredDocument = 0;

  initContentAnnots = [];

  OTP: string;

  subscriptions: Array<Subscription> = [];

  userIp: string;

  timeZone: string;

  tempSubscriptiuon: Subscription;

  optionsIsShowing = false;

  isAssignatureMassive: boolean = false;

  hasRejectedDisabled = false;

  documentOriginator: any = {};

  constructor(
    public signerService: FirmadorService,
    public documentsService: DocumentosService,
    public gatewayService: GatewayService,
    public fdService: FiledataService,
    public sessionService: SessionService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public loadingService: LoaderService,
    public detector: ChangeDetectorRef,
  ) {
    this.tempSubscriptiuon = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    })
  }

  ngOnInit(): void {
    this.signatureProcessEncoded = this.activatedRoute.snapshot.paramMap.get('guid');

    const helper = new JwtHelperService();

    if (localStorage.getItem('token') == null) {
      localStorage.setItem('firma', this.signatureProcessEncoded);
      this.router.navigate(['']);
      return;
    } else {
      const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
      if (isExpired) {
        localStorage.setItem('firma', this.signatureProcessEncoded);
        this.sessionService.logout();
      }
    }
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initWebViewer();
    this.init();
    this.timeZone = `(UTC${moment().format('Z')}) (${moment.tz.guess()})`;
  }

  async initWebViewer(): Promise<void> {
    this.webViewerInstance = await WebViewer({
      licenseKey,
      path: '/assets/webviewer',
      css: '/assets/webviewer/custom/styles.css',
      enableFilePicker: false,
      fullAPI: true,
      disabledElements: [
        //'header',
        'toolsHeader',
        //'pageNavOverlay',
        'documentControl',
        'ribbons',
        'toggleNotesButton',
        'menuButton',
        'outlinesPanelButton',
        'thumbnailControl',
        'viewControlsDivider1',
        'rotateHeader',
        'rotateClockwiseButton',
        'rotateCounterClockwiseButton',
        'contextMenuPopup',
        'annotationCommentButton',
        'annotationDeleteButton',
        'richTextPopup',
        'linkButton',
        'annotationGroupButton',
        'textPopup'
      ]
    }, this.viewer.nativeElement);

    this.webViewerInstance.disableFeatures([
      this.webViewerInstance.Feature.Ribbons,
      this.webViewerInstance.Feature.TextSelection,
      this.webViewerInstance.Feature.FilePicker,
      this.webViewerInstance.Feature.Print,
      this.webViewerInstance.Feature.Download
    ]);

    this.turnOffHotkeys();

    this.addCustomActions();

    const { annotManager, Annotations } = this.webViewerInstance;

    annotManager.on('annotationChanged', (annotations, action) => {
      if (action === 'delete') {
        annotations.forEach(annot => {
          (annotManager as any).addAnnotation(annot, {
            imported: false,
            isUndoRedo: false,
            autoFocus: false
          });

          annotManager.redrawAnnotation(annot);
        });
      }
    });

    annotManager.on('annotationSelected', (annotations, action) => {

      if (action === 'selected') {
        const annot = annotations[0];
        switch (annot.CustomData.type) {
          case AnnotationType.DATE:
            break;
          case AnnotationType.INITIALS:
            break;
          case AnnotationType.SIGNATURE:
            this.signaturesListIsShowing = true;
            this.detector.detectChanges();
        }

        if (window.innerWidth < 640) {
          this.webViewerInstance.enableElements([
            'annotationCommentButton'
          ]);
          annotations.forEach(annotation => {
            if (annotation instanceof Annotations.StampAnnotation) {
              this.webViewerInstance.disableElements([
                'annotationCommentButton'
              ]);
            }
          });
        }
      }
    });

    this.webViewerInstance.docViewer.on('documentLoaded', async () => {
      if (!this.isConfigured) {
        this.webViewerInstance.setFitMode((this.webViewerInstance as any).FitMode.FitWidth);
        await this.loadAnnotations(this.currentDocumentIndex);
      } else {
        if (this.indexConfiguredDocument + 1 <= this.documents.length) {
          this.prepareDocument(this.documents[this.indexConfiguredDocument]);
        }
      }

    });
  }

  addCustomActions(): void {

    const self = this;
    function changeAnnotationAlignment() {
      const { annotManager, Annotations } = self.webViewerInstance;
      const annots = annotManager.getSelectedAnnotations();

      annots.forEach(annot => {
        if (annot instanceof Annotations.FreeTextAnnotation) {
          if (annot.TextAlign === 'center') {
            annot.TextAlign = 'left';
          } else {
            annot.TextAlign = 'center';
          }
          annotManager.redrawAnnotation(annot);
        }
      });
    }

    function changeAnnotationFont() {
      const { annotManager, Annotations } = self.webViewerInstance;
      const annots = annotManager.getSelectedAnnotations();

      annots.forEach(annot => {
        if (annot instanceof Annotations.FreeTextAnnotation) {
          annot.Font = self.fonts[self.currentFont];
          self.currentFont++;
          if (self.currentFont == 3) {
            self.currentFont = 0;
          }
          annotManager.redrawAnnotation(annot);
        }
      });
    }

    this.webViewerInstance.annotationPopup.add([{
      type: 'actionButton',
      img: 'assets/icons/icon-menu-centre-align.svg',
      dataElement: 'alignText',
      onClick: changeAnnotationAlignment,
    }]);

    this.webViewerInstance.annotationPopup.add([{
      type: 'actionButton',
      img: 'assets/icons/icon-tool-text-free-text.svg',
      dataElement: 'changeFont',
      onClick: changeAnnotationFont,
    }]);
  }

  turnOffHotkeys(): void {
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.CTRL_C);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.COMMAND_C);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.CTRL_V);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.COMMAND_V);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.CTRL_F);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.COMMAND_F);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.CTRL_0);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.COMMAND_0);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.CTRL_P);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.COMMAND_P);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.SPACE);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.A);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.C);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.E);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.F);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.I);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.L);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.N);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.O);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.R);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.T);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.S);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.G);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.H);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.K);
    (this.webViewerInstance.hotkeys as any).off(this.webViewerInstance.hotkeys.Keys.U);
  }

  init(): void {
    this.signatureProcessEncoded = this.activatedRoute.snapshot.paramMap.get('guid');

    this.fdService.getIp().subscribe((respuesta: any) => {
      this.userIp = respuesta.ip;
    }, () => {
      this.userIp = '127.0.0.1';
    });

    if (localStorage.getItem('token') == null) {
      localStorage.setItem('firma', this.signatureProcessEncoded);
      this.router.navigate(['']);
      return;
    }

    this.subscriptions.push(this.signerService.ObtenerDocumentoV2(this.signatureProcessEncoded)
      .pipe(map((response: APIResponse2<any>) => new APIResponse2<any>(response)))
      .subscribe((response: APIResponse2<any>) => {
        if (!response.isSuccesful) {
          switch (response.status_code) {
            case 401:
              this.sessionService.logout(this.signatureProcessEncoded);
              this.router.navigate(['']);
              break;
            case 404:
              if (response.message === 'El solicitudFirmaGuid no tiene documentos asignados') {
                this.router.navigateByUrl('main/firmar/procesado', { skipLocationChange: true });

              } else if (response.message === 'The document is blocked') {
                this.toastr.info('El documento se encuentra en uso')
                this.router.navigateByUrl('main/repositorio');
              } else {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
              }
              break;
            case 440:
              this.toastr.error('El documento no pertenece a este usuario');
              this.router.navigateByUrl('main/menu');
              break;
            default:
              this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        } else {
          this.documents = response.data.documents;
          this.secondToUnlock = response.data.expireMinutes * 60;
          this.isAssignatureMassive = response.data.isAMassiveSignature;
          this.startCountdown()
          if (this.documents.length === 0) {
            this.router.navigateByUrl('main/firmar/procesado', { skipLocationChange: true });
          }

          this.loadDocument(this.currentDocumentIndex);
        }
      }, (response: any) => {
        if (response.error && response.error.status_code === 401) {
          this.sessionService.logout();
        } else if (response.error && response.error.status_code === 404) {
          if (response.error.message === 'El solicitudFirmaGuid no tiene documentos asignados') {
            this.router.navigateByUrl('main/firmar/procesado', { skipLocationChange: true });
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        } else if (response.error && response.error.status_code === 440) {
          this.toastr.error('El documento no pertenece a este usuario');
          this.router.navigateByUrl('main/menu');
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      }));
  }

  toggleModalVisibility(): void {
    this.modalIsShowing = !this.modalIsShowing;
  }

  toggleSignaturesListVisibility(): void {
    this.signaturesListIsShowing = !this.signaturesListIsShowing;
  }

  async shiftDocs(shiftBy: number): Promise<void> {
    this.currentDocumentIndex += shiftBy;
    await this.loadDocument(this.currentDocumentIndex);
  }

  loadDocument(index: number): Promise<void> {
    return new Promise<void>(resolve => {
      const document = this.documents[index];
      if (document.status === 'Rechazado') {
        this.documentOriginator = document.documentOriginator;
        this.hasRejectedDisabled = true;
        this.modalIsShowing = false;
        return;
      }
      if (document.document) {
        const blob = new Blob([document.document], { type: 'application/pdf' });
        this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });
        resolve();
        return;
      }

      this.subscriptions.push(this.documentsService.recuperarDocumento(document.serialDocument)
        .pipe(map((response: APIResponse<any>) => new APIResponse<any>(response)))
        .subscribe((response: APIResponse<any>) => {
          if (!response.isSuccesful) {
            switch (response.statusCode) {
              case 401:
                this.sessionService.logout();
                this.router.navigate(['']);
                break;
              default:
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
            }
          } else {
            this.documents[index].document = Utils.stringToUint(response.data.fileBase64);
            const blob = new Blob([document.document], { type: 'application/pdf' });
            this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });
            resolve();
          }
        }));
    });
  }

  async loadAnnotations(index: number): Promise<void> {
    const document = this.documents[index];

    const annotManager = this.webViewerInstance.docViewer.getAnnotationManager();

    const docObject = this.webViewerInstance.docViewer.getDocument();

    if (document.annotations) {
      const xfdfString = await annotManager.exportAnnotations({
        annotList: document.annotations.map((annot) => (annot.annotationObject))
      });
      await annotManager.importAnnotations(xfdfString);
      const annotationsList = annotManager.getAnnotationsList();
      const wasConfigured = document.annotations[0].configured;
      document.annotations = annotationsList.map((annot) =>
        ({ annotationObject: annot, configured: false })) as Array<IAnnotation>;
      if (wasConfigured) {
        document.annotations[0].configured = true;
      }
      return;
    }

    document.annotations = new Array<IAnnotation>(document.signs.length);
    const annotations = this.webViewerInstance.Annotations;
    if (document.signs[0].annotation) {
      await annotManager.importAnnotations(document.signs[0].annotation);

      const annotationsList = annotManager.getAnnotationsList()
        .filter(annot => {
          return annot.getCustomData('MiFirma');
        });

      for (const annot of annotationsList) {
        this.initContentAnnots.push(annot.getContents());
        annot.NoMove = true;
        annot.NoRotate = true;
        annot.ReadOnly = false;
        (annot as Annotations.FreeTextAnnotation).FillColor = new annotations.Color(160, 218, 255, 1);
        (annot as Annotations.FreeTextAnnotation).StrokeColor = new annotations.Color(75, 75, 75, 0);
        this.setAnnotationContent(annot);
      }

      document.annotations = annotationsList.map((annot) =>
        ({ annotationObject: annot, configured: false })) as Array<IAnnotation>;

      for (let i = 0; i < document.signs.length; i++) {
        document.annotations.unshift(undefined);
      }
    }

    const signature = document.signs;

    for (let i = 0; i < signature.length; i++) {
      const annotation = new annotations.StampAnnotation();

      const signatureIcon = await Jimp.read('/assets/img/clic-imagen2.png');

      const signatureIconBase64 = await signatureIcon.getBase64Async(Jimp.MIME_PNG);

      const [dimensions, coordinates] = await this.scaleImageToFit(
        signatureIconBase64,
        new Point(signature[i].x, signature[i].y),
        new Dimension(signature[i].width, signature[i].height));

      annotation.PageNumber = signature[i].page + 1;
      annotation.X = coordinates.x;
      annotation.Y = docObject.getPageInfo(signature[i].page + 1).height - coordinates.y - dimensions.height;
      annotation.Width = dimensions.width;
      annotation.Height = dimensions.height;
      annotation.NoMove = true;
      annotation.NoResize = false;
      annotation.NoRotate = true;
      annotation.ImageData = signatureIconBase64;
      annotation.CustomData = {
        type: AnnotationType.SIGNATURE
      };

      annotManager.addAnnotation(annotation, false);

      annotManager.redrawAnnotation(annotation);

      document.annotations[i] = {
        annotationObject: annotation, configured: false
      };
    }

  }

  setAnnotationContent(annot: Annotations.Annotation): void {
    switch (annot.CustomData.type) {
      case AnnotationType.DATE:
        annot.setContents(`${new Date().toLocaleDateString('es-CO')}`);
        break;
      case AnnotationType.INITIALS:
        annot.setContents(`${this.sessionService.username
          .trim()
          .split(/\s+/)
          .reduce((previous: string, current: string) => {
            return previous + current[0];
          }, '')
          .toUpperCase()}`);
        break;
    }
  }

  async getStampAnotation(document: IDocument, docObject: CoreControls.Document): Promise<Array<Annotations.Annotation>> {

    const annotations = this.webViewerInstance.Annotations;
    let stamps = []
    for (let i = 0; i < document.signs.length; i++) {
      const annotation = new annotations.StampAnnotation();
      const point = new Point(document.signs[i].x, document.signs[i].y);
      const dims = new Dimension(document.signs[i].width, document.signs[i].height);

      const imgDims = new Dimension(dims.width, dims.width / 4);
      const sealPoint = new Point(point.x - (dims.width * 0.08), point.y);

      annotation.PageNumber = document.signs[i].page + 1;
      annotation.X = sealPoint.x;
      annotation.Y = docObject.getPageInfo(document.signs[i].page + 1).height - sealPoint.y - imgDims.height;
      annotation.Width = imgDims.width;
      annotation.Height = imgDims.height;
      annotation.NoMove = true;
      annotation.NoResize = true;
      annotation.NoRotate = true;
      annotation.ImageData = document.docStamp[i];
      annotation.CustomData = {
        type: AnnotationType.SIGNATURE
      };

      stamps.push(annotation)
    }


    return stamps;
  }

  async scaleImageToFit(uriImage: string, coordinates: Point, maxDims: Dimension): Promise<[Dimension, Point]> {

    const img = await Jimp.read(uriImage);
    const dimensions = new Dimension(img.getWidth(), img.getHeight());

    if (img.getWidth() > maxDims.width) {
      const scale = maxDims.width / img.getWidth();
      dimensions.width *= scale;
      dimensions.height *= scale;
    }

    if (dimensions.height > maxDims.height) {
      const scale = maxDims.height / dimensions.height;
      dimensions.width *= scale;
      dimensions.height *= scale;
    }

    const moveX = (maxDims.width) - (dimensions.width);
    const moveY = (maxDims.height) - (dimensions.height);

    coordinates.translate(moveX / 2, - moveY / 2);

    return [dimensions, coordinates];
  }

  async onSignatureSelected(base64: string): Promise<void> {

    this.toggleSignaturesListVisibility();

    const document = this.documents[this.currentDocumentIndex];

    for (let i = 0; i < document.signs.length; i++) {
      document.signs[i].signatureBase64 = base64;

      document.signs[i].signatureType = Utils.getExtensionImageFromURI(base64);

      document.signs[i].signatureImageEncoded = base64.replace(/^data:image\/[a-z]+;base64,/, '');

      const signature = document.signs[i];

      const [dimensions, coordinates] = await this.scaleImageToFit(
        base64,
        new Point(signature.x, signature.y),
        new Dimension(signature.width, signature.height));

      const annotManager = this.webViewerInstance.docViewer.getAnnotationManager();

      const docObject = this.webViewerInstance.docViewer.getDocument();

      const signatureAnnotation = document.annotations[i].annotationObject as Annotations.StampAnnotation;

      if (!document.annotations[i].configured) {
        signatureAnnotation.PageNumber = signature.page + 1;
        signatureAnnotation.X = coordinates.x;
        signatureAnnotation.Y = docObject.getPageInfo(signature.page + 1).height - coordinates.y - signature.height;
        signatureAnnotation.Width = dimensions.width;
        signatureAnnotation.Height = dimensions.height;
        signatureAnnotation.ImageData = base64;

        annotManager.redrawAnnotation(signatureAnnotation);
        document.annotations[i].configured = true;

      } else {

        signatureAnnotation.X = coordinates.x;
        signatureAnnotation.Y = docObject.getPageInfo(signature.page + 1).height - coordinates.y - signature.height;
        signatureAnnotation.Width = dimensions.width;
        signatureAnnotation.Height = dimensions.height;
        signatureAnnotation.ImageData = base64;
        annotManager.redrawAnnotation(document.annotations[0].annotationObject);
      }

    }


  }

  onSignatureGuidChange(signatureGuid: string): void {
    if (this.documents[this.currentDocumentIndex]) {
      for (let i = 0; i < this.documents[this.currentDocumentIndex].signs.length; i++) {
        this.documents[this.currentDocumentIndex].signs[i].signatureGuid = signatureGuid;
      }
    }
  }

  async continue(checkAnots?: boolean): Promise<void> {
    if (this.canSign(checkAnots)) {
      const isAuthenticated = await this.IsUserAuthenticated();

      if (isAuthenticated) {
        this.prepareDocuments();
      }
    } else {
      if (this.fieldSignConfigured) {
        const modalRef = this.modalService.open(MensajesComponent, { centered: true });
        modalRef.componentInstance.tittle = 'Anotaciones';
        modalRef.componentInstance.message = 'Tiene anotaciones sin configurar';
        modalRef.componentInstance.information = '¿Desea continuar de todas formas?';
        modalRef.result.then((result) => {
          if (result) {
            this.continue(true)
          }
        }, (error: any) => { });
      } else {
        this.toastr.info('Completa el(los) campo(s) de firma.');
      }
    }
  }

  sign(): void {
    this.signSynchronously()
    // if (this.documents.length > 1) {
    //   this.signAsync();
    // } else {
    //   this.signSynchronously();
    // }
  }

  canSign(checkAnots?: boolean): boolean {
    let isValid = true;
    // TODO This can be done faster -> O(1) time, just keep track of every document as annotations are modified
    const { Annotations } = this.webViewerInstance;
    for (const doc of this.documents) {
      if (!doc.document) {
        this.fieldSignConfigured = false;
        isValid = false;
        // return false
      }
      if (doc.annotations) {
        for (const annotation of doc.annotations) {
          const { annotationObject } = annotation;
          if (annotation.annotationObject.CustomData.type !== AnnotationType.SIGNATURE) {
            annotation.configured = !this.initContentAnnots.includes(annotationObject.getContents());
          }
          if (annotation.configured && annotation.annotationObject.CustomData.type === AnnotationType.SIGNATURE) {
            this.fieldSignConfigured = true;
          }
          if (!annotation.configured && annotation.annotationObject.CustomData.type === AnnotationType.SIGNATURE) {
            this.fieldSignConfigured = false;
            isValid = false;
            // return false;
          }
          if (!checkAnots) {
            if (!annotation.configured) {
              isValid = false;
              // return false;
            }
          }
          (annotationObject as Annotations.FreeTextAnnotation).FillColor = new Annotations.Color(255, 255, 255, 0);
          (annotationObject as Annotations.FreeTextAnnotation).StrokeColor = new Annotations.Color(255, 255, 255, 0);
        }
      } else {
        isValid = false;
        // return false;
      }
    }
    if (isValid) {
      return true
    } else {
      return false
    }
  }

  async prepareDocument(doc: IDocument): Promise<void> {
    const annotManager = this.webViewerInstance.docViewer.getAnnotationManager();
    const docObj = this.webViewerInstance.docViewer.getDocument();
    doc.docStamp = []
    for (let i = 0; i < doc.signs.length; i++) {
      let stamp = await this.addESignatureStamp(this.OTP, doc.solicitudFirmaToken)
      doc.docStamp.push(stamp);
    }

    const stampBase = await this.getStampAnotation(doc, docObj);

    for (let i = 0; i < doc.signs.length; i++) {
      const stamp = { annotationObject: stampBase[i], configured: true };
      if (doc.signs[i].signatureType !== 'png') {
        doc.annotations.push(stamp);
      } else {
        doc.annotations.unshift(stamp);
      }
    }

    const annots = annotManager.getAnnotationsList().filter(annot => {
      const fromMiFirma = annot.getCustomData('MiFirma');
      return !fromMiFirma;
    });

    const xfdfString = await annotManager.exportAnnotations({
      annotList: doc.annotations.map((annot) => (annot.annotationObject)),
      widgets: true,
      links: true,
      fields: true
    });

    const data = await docObj.getFileData({
      xfdfString,
      flatten: true
    });

    doc.document = new Uint8Array(data);
    this.indexConfiguredDocument += 1;

    this.prepareDocuments();
  }

  async prepareDocuments(): Promise<void> {
    this.isConfigured = true;
    this.loadingService.startLoading();
    if (this.indexConfiguredDocument + 1 <= this.documents.length) {
      const blob = new Blob([this.documents[this.indexConfiguredDocument].document], { type: 'application/pdf' });
      this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });
    } else {
      this.sign();
    }
  }

  async addESignatureStamp(otp?: string, guidSign?: string): Promise<string> {
    const fontOtherSigners = '/assets/fonts/open-sans-16-black.txt';
    const selloPath = '/assets/img/img-esign4x.png';
    const date = new Date();
    let aditionalData = '';
    if (guidSign) {
      aditionalData = `ID Firma: ${guidSign}`;
    } else {
      aditionalData = otp ? `OTP: ${otp} - ` : '';
      aditionalData += `Fecha: ${date.toLocaleDateString('es-CO')} - Hora: ${date.toLocaleTimeString('es-CO', { hour12: false })}`;
    }

    const sello = await Jimp.read(selloPath);
    const image = new Jimp(600, 150);

    image.opacity(0.3);
    const font = await Jimp.loadFont(fontOtherSigners);
    image.print(
      font, 0, 0,
      {
        text: aditionalData,
        alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
      },
      image.bitmap.width,
      image.bitmap.height
    );

    sello.composite(image, 0, 0);

    return await sello.getBase64Async(Jimp.MIME_PNG);
  }

  async IsUserAuthenticated(): Promise<boolean> {

    const publicIp = await this.getPublicIp();

    const windowInfo = Utils.datosMaquina(window);

    const isMobile = window.innerWidth <= 640;
    const isTablet = !isMobile && window.innerWidth <= 800;
    const isDesktop = !isMobile && !isTablet;

    const SignProcessCode = 3;

    return new Promise(resolve => {
      this.subscriptions.push(
        this.gatewayService.validateUser(
          this.sessionService.emailUser,
          this.sessionService.phoneUser2,
          publicIp,
          windowInfo.browser,
          '',
          windowInfo.os,
          isMobile,
          isTablet,
          isDesktop,
          true,
          false,
          false,
          SignProcessCode
        )
          .pipe(map((response: APIResponse<any>) => new APIResponse<any>(response)))
          .subscribe((response: APIResponse<any>) => {
            if (!response.isSuccesful) {
              switch (response.statusCode) {
                case 401:
                  this.sessionService.logout();
                  this.router.navigate(['']);
                  break;
                default:
                  this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
              }
            } else {
              this.authenticateUser(response.data.authId, response.data.nextStep.process)
                .then(isAuthenticated => {
                  resolve(isAuthenticated);
                });
            }
          }));
    });
  }

  async authenticateUser(authId: string, processName: string): Promise<boolean> {
    switch (processName) {
      case 'OTP':
        const ok = await this.authenticateUserOTP(authId);

        // This should not be a global variable
        this.OTP = ok;

        if (!ok) {
          return false;
        }
        // TODO This should not be hardcoded. Instead just consume the method validate
        return this.authenticateUser(authId, 'Firma');
      case 'Firma':
        return true;
      default:
        console.error(`Process with name ${processName} is not yet supported!`);
        return false;
    }
  }

  async authenticateUserOTP(authId: string): Promise<string> {
    const modalRef = this.modalService.open(PinFirmadorComponent, { centered: true });

    modalRef.componentInstance.authId = authId;
    modalRef.componentInstance.phoneUser = this.sessionService.phoneUser2;
    return await modalRef.result;
  }

  async signSynchronously(): Promise<void> {
    this.toastr.info('Este proceso puede tardar segun la cantidad de documentos a firmar.')
    let index = 0
    for (const doc of this.documents) {
      let signatureGuids = []
      for (let i = 0; i < doc.signs.length; i++) {
        signatureGuids.push(doc.signs[i].signatureGuid)
      }
      let resultado = await this.firmarDocumentos(doc, signatureGuids);
      if (
        resultado.message === 'Petición exitosa' &&
        resultado.status_code === 200
      ) {
        if (index >= (this.documents.length - 1)) {
          this.hasSignedDocuments = true;
          localStorage.removeItem('firma');
        } else {
          this.toastr.info(`Documento ${index + 1} de ${this.documents.length} firmado.`)
        }
      } else if (resultado.status_code === 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
      index++
    }
  }

  firmarDocumentos(doc:IDocument,signatureGuids:Array<any>): Promise<any> {
    return new Promise<any>((resolve, _) => {
      this.subscriptions.push(this.signerService.EjecutarFirma(
        this.signatureProcessEncoded,
        this.sessionService.username,
        signatureGuids[0],
        Utils.Uint8ArrayToStringBase64(doc.document),
        doc.serialDocument,
        this.userIp,
        this.timeZone,
        this.OTP,
        this.isAssignatureMassive
      ).subscribe((Respuesta: any) => {
        resolve(Respuesta);
      }));
    });
  }

  signAsync(): void {

    const payload = [];

    for (const document of this.documents) {
      payload.push({
        signId: document.signGuid,
        graphId: document.signs[0].signatureGuid
      });
    }

    this.subscriptions.push(this.signerService.changeStateSign(payload)
      .pipe(map((response: APIResponse2<any>) => new APIResponse2<any>(response)))
      .subscribe((response: APIResponse2<any>) => {
        if (!response.isSuccesful) {
          switch (response.status_code) {
            case 401:
              this.sessionService.logout();
              this.router.navigate(['']);
              break;
            default:
              this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        } else {
          this.toastr.info('Tus documentos están siendo firmados');
          localStorage.removeItem('firma');
          this.router.navigateByUrl('main/repositorio');
        }
      }));
  }

  getPublicIp(): Promise<string> {
    return new Promise(resolve => {
      this.subscriptions.push(this.fdService.getIp().subscribe((response: any) => {
        resolve(response.ip);
      }, () => {
        resolve('127.0.0.1');
      }));
    });
  }

  /**
     * Toggles the filter menu
     * @param e The mouse event information
     */
  toggleOptionsSelection(e: MouseEvent): void {
    e.stopPropagation();
    this.optionsIsShowing = !this.optionsIsShowing;
  }

  startCountdown() {

    this.interval = setInterval(() => {
      this.secondToUnlock--;
      if (this.secondToUnlock < 0) {
        let guids = []
        clearInterval(this.interval);
        for (const doc of this.documents) {
          guids.push(doc.serialDocument)
        }
        this.documentsService.unlockDocuments(guids).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.noTimeOut = false;
            this.toastr.info('Superaste el tiempo limite con el documento en uso')
            this.router.navigateByUrl('main/repositorio')
          } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        })
      }
    }, 1000);
  }

  modalRejectSign() {
    this.optionsIsShowing = false;
    const modalRef = this.modalService.open(RejectSignComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result.success) {
        console.log(this.documents[this.currentDocumentIndex].serialDocument);
        let serial = this.documents[this.currentDocumentIndex].serialDocument;

        this.documentsService.rejectSign(serial, result.comment).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.router.navigateByUrl('main/firmar/rechazado', { skipLocationChange: true })
            localStorage.removeItem('firma');
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

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (event.toElement.id !== 'tool-option') {
      this.optionsIsShowing = false;
    }
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    if (this.noTimeOut) {
      let guids = []
      clearInterval(this.interval);
      for (const doc of this.documents) {
        guids.push(doc.serialDocument)
      }

      await this.documentsService.unlockDocuments(guids).toPromise();
      // await this.documentsService.unlockDocuments(guids).subscribe((Respuesta: any) => {
      //   if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
      //   } else if (Respuesta.status_code == 401) {
      //     this.sessionService.logout();
      //   } else {
      //     this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      //   }
      // })
    }
  }
}
