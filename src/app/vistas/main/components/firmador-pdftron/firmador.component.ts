import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PinFirmadorComponent } from 'src/app/vistas/modales/pin-firmador/pin-firmador.component';
import * as Utils from 'src/app/Utilidades/utils';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { Destinatario } from 'src/app/modelos/destinatario.model';
import { Firma } from 'src/app/modelos/firma.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import * as Jimp from 'jimp';
import { TitleCasePipe } from '@angular/common';
import { SessionService } from 'src/app/servicios';
import { Point } from 'src/app/modelos/point.model';
import { Dimension } from 'src/app/modelos/dimension.model';
import { ParamsService } from 'src/app/servicios/params/params.service';
import WebViewer, { Annotations, CoreControls, WebViewerInstance } from '@pdftron/webviewer';
import { AnnotationType, IAnnotation, IDocument2 } from 'src/app/interfaces/Documents/document.interface';
import * as moment from 'moment-timezone';
import { FinishSignComponent } from 'src/app/vistas/modales/finish-sign/finish-sign.component';

const licenseKey = 'OLIMPIA IT SAS(olimpiait.com):OEM:MiFirma::B+:AMS(20211027):88B5E2D204D7380AB360B13AC9A2737860612FEDB9C3F535E57C699658E5832D8969BEF5C7';

@Component({
  selector: 'app-firmador',
  templateUrl: './firmador.component.html',
  styleUrls: ['./firmador.component.css']
})
export class FirmadorPDFTronComponent implements OnInit, AfterViewInit, OnDestroy {
  isThirdParty = localStorage.getItem('isThirdParty') == 'true';
  thirdPartyColor = localStorage.getItem('thirdPartyColor');
  wvInstance: WebViewerInstance;

  signingData: any = [];

  files: any[] = [];
  file: Uint8Array;
  filesPreview: any[] = [];
  filesConfig: any[] = [];

  signers: any[] = [];
  firmante: any;
  firmanteIndex: number;
  signatureSigner: string = '';
  contador: number = 1;

  otros: boolean;

  noIntoSign: boolean = true;

  indexConfiguredDocument = 0;

  isConfigured = false;

  colors: Array<string> = [
    'rgba(158,234,170, 0.5)', 'rgba(160,218,255, 0.5)', 'rgba(240, 240, 36, 0.5)',
    'rgba(158,38,125, 0.5)', 'rgba(227, 34, 63, 0.5)', 'rgba(227, 156, 34, 0.5)',
    'rgba(26, 219, 219, 0.5)', 'rgba(19, 111, 209, 0.5)', 'rgba(190, 78, 242, 0.5)',
  ];

  color: string;

  annotationType = AnnotationType;

  isSignaturesMenuShowing = false;
  showMobileMenu = false;

  largestHeight: number;
  largestWidth: number;

  signature = '';
  grafoGuid: string;

  signatureCount = 0;

  userIp: string;

  originalDimension: Dimension[] = [];

  mySubscription: Subscription;
  mySubscription2: Subscription;

  hasCamera: boolean;

  isTemplate = false;
  isMassive = false;

  massiveInfo = [];

  documentReady: boolean;

  stampWidth = 601;
  stampHeight = 155;

  hasSignYo: boolean = true;

  pagesDocument: number;
  timeZone: string;

  sendData: any = {}
  signInOrder: boolean = false

  currentDocumentIndex: number = 0

  constructor(
    private fdService: FiledataService,
    private router: Router,
    private modalService: NgbModal,
    private firmadorService: FirmadorService,
    private gatewayService: GatewayService,
    private paramService: ParamsService,
    public cargadorService: LoaderService,
    public toast: ToastrService,
    public titleCase: TitleCasePipe,
    public sessionService: SessionService,
    public detector: ChangeDetectorRef,
    public loadingService: LoaderService,
  ) { }

  ngOnInit(): void { }

  async ngAfterViewInit(): Promise<void> {
    this.cargadorService.startLoading();
    await this.init();
    await this.getFiles();
    await this.vwinit();
    if (this.isTemplate) {
      await this.loadAnnotations();
    }
    this.otros = this.getTipoFlujo() === 3;
    this.cargadorService.stopLoading();

    this.timeZone = `(UTC${moment().format('Z')}) (${moment.tz.guess()})`;
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe();
    this.mySubscription2.unsubscribe();
    this.modalService.dismissAll();
  }

  /**
   * Initializes signers, public ip, and camera properties.
   */
  async init(): Promise<void> {
    this.fdService.getIp().subscribe((respuesta: any) => {
      this.userIp = respuesta.ip;
    }, () => {
      this.userIp = '127.0.0.1';
    });

    if (this.getTipoFlujo() != 1) {
      this.fdService.inOrderListener$.subscribe(respuesta => {
        this.signInOrder = respuesta;
      })
    }

    this.mySubscription2 = this.fdService.firmantesListener$.subscribe(firmantes => {
      this.signers = firmantes;

      if (this.signers[0].annotations) {
        this.isTemplate = true;
      }

      this.chooseSigner(0);
    });

    this.fdService.infoMasivListener$.subscribe(firmantes => {
      if (firmantes.length != 0) {
        this.isMassive = true;
        this.massiveInfo = firmantes;
      }
    });

    if (window.innerWidth < 640) {
      this.largestHeight = 50;
      this.largestWidth = 150;
    } else {
      this.largestHeight = 110;
      this.largestWidth = 450;
    }

    this.hasCamera = await Utils.detectWebcam();
  }

  /**
   * Initializes the docviewer instance
   */
  async vwinit(): Promise<void> {
    const viewer = document.getElementById('viewer');

    this.wvInstance = await WebViewer({
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
        'linkButton',
        'annotationGroupButton',
        'textPopup'
      ]
    }, viewer);

    this.wvInstance.setLanguage('es');

    this.turnOffHotkeys();

    this.addCustomActions();

    const { annotManager, docViewer, Annotations } = this.wvInstance;

    await this.loadDocument(this.currentDocumentIndex)

    this.wvInstance.setFitMode((this.wvInstance as any).FitMode.FitWidth);

    annotManager.on('annotationChanged', (annotations, action) => {
      if (action === 'delete') {
        annotations.forEach(annot => {
          if (annot.getCustomData('type') === AnnotationType.SIGNATURE) {
            if (this.hasSignYo) {
              this.signatureCount--;
            }
          }
        });
        this.detector.detectChanges();
      }
    });

    annotManager.on('annotationSelected', (annotations, action) => {
      if (action === 'selected') {
        this.wvInstance.disableElements([
          'alignText'
        ]);
        annotations.forEach(annot => {
          if (annot instanceof Annotations.FreeTextAnnotation) {
            this.wvInstance.enableElements([
              'alignText'
            ]);
          }
        });

        if (window.innerWidth < 640) {
          this.wvInstance.enableElements([
            'annotationCommentButton'
          ]);
          annotations.forEach(annotation => {
            if (annotation instanceof Annotations.StampAnnotation) {
              this.wvInstance.disableElements([
                'annotationCommentButton'
              ]);
            }
          });
        }
      }
    });

    docViewer.on('documentLoaded', async () => {
      if (!this.isConfigured) {
        this.wvInstance.setFitMode((this.wvInstance as any).FitMode.FitWidth);
        this.documentReady = true;
        await this.loadAnnots(this.currentDocumentIndex)
      } else {
        if (this.indexConfiguredDocument + 1 <= this.files.length) {
          this.nextFile(this.indexConfiguredDocument);
        }
      }
    });

    if (this.files.length > 1) {
      await this.setFiles(this.files)
    }
  }

  loadDocument(index: number): Promise<void> {
    return new Promise<void>(resolve => {
      const document = this.files[index];
      if (document.document) {
        const blob = new Blob([document.document], { type: 'application/pdf' });
        this.wvInstance.loadDocument(blob, { filename: document.name });
        resolve();
      }
    });
  }

  async loadAnnots(index: number) {
    const document = this.files[index]
    const { annotManager } = this.wvInstance;
    if (document.anotaciones) {
      await annotManager.importAnnotations(document.anotaciones);
    }
  }

  /**
   * Disables hotkeys which won't be suppported in the application
   */
  turnOffHotkeys(): void {
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.CTRL_C);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.COMMAND_C);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.CTRL_V);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.COMMAND_V);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.CTRL_F);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.COMMAND_F);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.CTRL_0);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.COMMAND_0);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.CTRL_P);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.COMMAND_P);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.SPACE);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.A);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.C);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.E);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.F);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.I);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.L);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.N);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.O);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.R);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.T);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.S);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.G);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.H);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.K);
    (this.wvInstance.hotkeys as any).off(this.wvInstance.hotkeys.Keys.U);
  }

  addCustomActions(): void {

    const self = this;
    function changeAnnotationAlignment() {
      const { annotManager, Annotations } = self.wvInstance;
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

    this.wvInstance.annotationPopup.add([{
      type: 'actionButton',
      img: 'assets/icons/icon-menu-centre-align.svg',
      dataElement: 'alignText',
      onClick: changeAnnotationAlignment,
    }]);
  }

  /**
   * Loads annotations into the document if there are any
   */
  async loadAnnotations(): Promise<void> {
    this.wvInstance.docViewer.on('documentLoaded', async () => {
      const annotManager = this.wvInstance.annotManager;

      this.signers.forEach(async firmante => {
        await annotManager.importAnnotations(firmante.annotations);
      });

      const annotationsList = annotManager.getAnnotationsList().filter(annot => {
        return annot.getCustomData('MiFirma');
      });

      const deleteAnnot: Annotations.Annotation[] = [];
      let i = 0;
      const temp = [];
      this.colors = [];

      annotationsList.forEach((annot) => {
        if (!this.colors.includes(annot.CustomData.color)) {
          this.colors.push(annot.CustomData.color);
        }
        if (temp.length === 0) {
          temp.push(annot.getCustomData('rol'));
        } else {
          if (temp[temp.length - 1] !== annot.getCustomData('rol')) {
            temp.push(annot.getCustomData('rol'));
            i++;
          }
        }
        annot.setCustomData('index', i);
        annot.setCustomData('owner', this.signers[i].correo);
        annot.setCustomData('nombreFir', this.signers[i].nombre);
        if (annot.getCustomData('type') === AnnotationType.SIGNATURE) {
          deleteAnnot.push(annot);
        }
      });
      this.chooseSigner(0);

      for (const annot of deleteAnnot) {
        if (annot.CustomData.rol === 'Yo') {
          this.originalDimension.push(new Dimension(annot.getWidth(), annot.getHeight()));
        }
        annotManager.deleteAnnotation(annot);
        this.signatureCount++;
        const { Annotations } = this.wvInstance;
        const annotation = new Annotations.StampAnnotation();
        let signatureIcon;
        if (annot.CustomData.rol === 'Yo') {
          signatureIcon = await Jimp.read('/assets/img/clic-imagen2.png');
        } else {
          const fontOtherSigners = '/assets/fonts/open-sans-32-black.txt';
          signatureIcon = new Jimp(300, 40, annot.getCustomData('color'));
          const [name] = (annot.CustomData.nombreFir as string).split(' ');

          const font = await Jimp.loadFont(fontOtherSigners);
          signatureIcon.print(
            font, 0, 0,
            {
              text: `Firma ${name}`,
              alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            signatureIcon.bitmap.width,
            signatureIcon.bitmap.height
          );
          this.signatureCount++;
        }

        const signatureIconBase64 = await signatureIcon.getBase64Async(Jimp.MIME_PNG);

        annotation.PageNumber = annot.getPageNumber();
        annotation.X = annot.getX();
        annotation.Y = annot.getY();
        annotation.Width = annot.getWidth();
        annotation.Height = annot.getHeight();
        annotation.NoMove = true;
        annotation.NoResize = true;
        annotation.NoRotate = true;
        annotation.ImageData = signatureIconBase64;
        annotation.CustomData = annot.CustomData;

        annotManager.addAnnotation(annotation, false);

        annotManager.redrawAnnotation(annotation);
      }

      const annots = annotManager.getAnnotationsList().filter(annot => {
        return annot.getCustomData('MiFirma');
      });

      const annotations = this.wvInstance.Annotations;
      let hasSign = false;
      for (const annot of annots) {
        annot.NoMove = true;
        annot.NoResize = true;
        annot.NoRotate = true;
        if (annot.CustomData.rol === 'Yo') {
          annot.Locked = true;
          if (annot.CustomData.type === AnnotationType.SIGNATURE) {
            annot.NoResize = false;
            annot.Locked = false;
            hasSign = true;
          }
          (annot as any).FillColor = new annotations.Color(160, 218, 255, 0);
          (annot as any).StrokeColor = new annotations.Color(160, 218, 255, 0);
          this.setAnnotationContent(annot);
        } else {
          annot.ReadOnly = true;
        }
      }

      const me = this.signers.find(signer => signer.tipo === 'Yo');
      if (!hasSign && me) {
        this.signatureCount++;
        this.hasSignYo = false;
        this.isSignaturesMenuShowing = false;
      }

      this.detector.detectChanges();

    });
  }

  async shiftDocs(shiftBy: number): Promise<void> {
    const annotManager = this.wvInstance.docViewer.getAnnotationManager();
    const annots = annotManager.getAnnotationsList()

    let xfdfString = await annotManager.exportAnnotations({
      annotList: [...annots],
      widgets: true,
      links: true,
      fields: true
    });
    this.files[this.currentDocumentIndex].anotaciones = xfdfString
    this.files[this.currentDocumentIndex].annots = annots
    this.currentDocumentIndex = shiftBy;
    await this.loadDocument(this.currentDocumentIndex);
  }

  /**
   * Gets the files which will be processed
   */
  getFiles(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mySubscription = this.fdService.filesListener$.subscribe(async files => {
        this.files = files;
        this.filesPreview = await this.getAllFiles();
        this.filesConfig = await this.getFilesConfig();
        if (this.filesPreview.length === 0) {
          this.filesPreview = files;
          this.fdService.addAllFiles(files.slice());
        }

        if (this.isTemplate) {
          this.files[0].document = files[0].arrayBits;
          resolve();
        } else {
          await this.setFile(this.files[0]);
          resolve();
        }
      });
    });
  }

  /**
   * Initializes the current file as an array of bytes
   * @param file The object file to be converted to an array of bytes
   */
  async setFiles(files: Array<File>): Promise<void> {
    return new Promise((resolve, _) => {
      for (let i = 1; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = (e: any) => {
          this.files[i].document = new Uint8Array(e.target.result);
        };
        reader.readAsArrayBuffer(files[i]);
      }
      resolve()
    });
  }

  async setFile(file: File): Promise<void> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        this.files[0].document = new Uint8Array(e.target.result);
      };
      reader.readAsArrayBuffer(file);

      resolve()
    });
  }

  /**
   * Hides/Shows the signers menu
   * This function should only be used for mobile devices
   */
  toggleSignerMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  /**
   * Hides/Shows the list of signatures
   */
  toggleSignaturesList(): void {
    this.isSignaturesMenuShowing = !this.isSignaturesMenuShowing;
  }

  /**
   * Creates a new annotation which will be drawn on the docviewer.
   * Note that this method validates that there is only one annotation of type signature for each signer
   * @param type The type of annotation (Signature - Initials - Date - Text)
   */
  async createAnnot(type: AnnotationType): Promise<void> {
    const { Annotations, annotManager, docViewer } = this.wvInstance;

    if (!this.documentReady) {
      return;
    }

    // if (this.firmante.tipo === 'Yo' && type === AnnotationType.SIGNATURE && !this.signature) {
    //   return;
    // }

    // const annots = annotManager.getAnnotationsList().filter((annot: Annotations.Annotation) => {
    //   return annot.getCustomData('MiFirma') && annot.CustomData.index === this.firmanteIndex;
    // });

    // if ((type === AnnotationType.SIGNATURE)) {
    //   if (annots.some(annot => AnnotationType.SIGNATURE === annot.getCustomData('type'))) {
    //     return;
    //   }
    // }

    let annotation: any;
    let signatureIcon: any;

    if (type !== AnnotationType.SIGNATURE) {
      annotation = new Annotations.FreeTextAnnotation();
      annotation.setCustomData('index', this.firmanteIndex);
      annotation.setCustomData('MiFirma', true);
      annotation.setCustomData('type', type);
      annotation.setCustomData('owner', this.firmante.correo);
      annotation.setCustomData('rol', this.firmante.tipo);

      const [page, height] = this.getVerticalLocationWithOffset(docViewer, 100, 20);

      annotation.PageNumber = page;
      annotation.X = 100;
      annotation.Y = height;
      annotation.Width = 100;
      annotation.Height = 20;
      annotation.FillColor = new Annotations.Color(255, 255, 255, 0);
      annotation.TextColor = new Annotations.Color(0, 0, 0);
      annotation.FontSize = '12pt';
      annotation.TextAlign = 'center';
      annotation.StrokeThickness = 0;
      annotation.StrokeColor = new Annotations.Color(255, 255, 255, 0);
      annotation.setPadding(new Annotations.Rect(0, 0, 0, 0));
      annotation.Locked = false;
      annotation.ReadOnly = false;
      annotation.LockedContents = false;
      (annotation as Annotations.FreeTextAnnotation).NoMove = false;
      (annotation as Annotations.FreeTextAnnotation).NoResize = false;

      if (this.firmante.tipo !== 'Yo') {

        if (this.isTemplate) {

          const color = this.color;
          const [r, g, b] = [parseInt(color.slice(1, 3), 16),
          parseInt(color.slice(3, 5), 16),
          parseInt(color.slice(5, 7), 16)];

          annotation.FillColor = new Annotations.Color(r, g, b, 0.5);
        } else {
          const [r, g, b, a] = this.color.replace(/rgba\(|\)|\s/, '').split(',').map(c => parseFloat(c));
          annotation.FillColor = new Annotations.Color(r, g, b, a);
        }

        annotation.setContents(type === AnnotationType.INITIALS ? 'Iniciales' :
          type === AnnotationType.DATE ? 'Fecha' : 'Texto');
      } else {
        this.setAnnotationContent(annotation);
      }

    } else {
      this.signatureCount++;
      annotation = new Annotations.StampAnnotation();
      annotation.setCustomData('MiFirma', true);
      annotation.setCustomData('index', this.firmanteIndex);
      annotation.setCustomData('owner', this.firmante.correo);
      annotation.setCustomData('type', type);
      annotation.setCustomData('rol', this.firmante.tipo);
      if (this.firmante.tipo === 'Yo') {
        if (!this.hasSignYo && this.isTemplate) {
          this.signatureCount--;
        }
        signatureIcon = await Jimp.read(this.signature);
        signatureIcon.scan(0, 0, signatureIcon.bitmap.width, signatureIcon.bitmap.height, (x, y, i) => {
          if (signatureIcon.bitmap.data[i + 3] === 0) {
            signatureIcon.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 2), x, y);
          }
        });
      } else {
        const fontOtherSigners = '/assets/fonts/open-sans-32-black.txt';
        signatureIcon = new Jimp(300, 40, Utils.getHexColorFromRgba(this.color));
        const [name] = (this.firmante.nombre as string).split(' ');

        const font = await Jimp.loadFont(fontOtherSigners);
        signatureIcon.print(
          font, 0, 0,
          {
            text: `Firma ${name}`,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          },
          signatureIcon.bitmap.width,
          signatureIcon.bitmap.height
        );
      }

      const signatureIconBase64 = await signatureIcon.getBase64Async(Jimp.MIME_PNG);

      const [dimensions] = await this.scaleImageToFit(
        signatureIconBase64,
        new Point(100, 100),
        new Dimension(this.largestWidth, this.largestHeight));

      const [page, height] = this.getVerticalLocationWithOffset(docViewer, 100, 20);

      annotation.PageNumber = page;
      annotation.X = 100;
      annotation.Y = height;
      annotation.Width = dimensions.width;
      annotation.Height = dimensions.height;
      annotation.Locked = false;
      annotation.ReadOnly = false;
      annotation.LockedContents = false;

      annotation.ImageData = signatureIconBase64;
    }

    (annotManager as any).addAnnotation(annotation, {
      imported: false,
      isUndoRedo: false,
      autoFocus: false
    });
    annotManager.deselectAllAnnotations();
    annotManager.selectAnnotation(annotation);
    annotManager.redrawAnnotation(annotation);
  }

  /**
   * Returns the vertical position (page and y-coordinate) of the current viewer
   * in docViewer coordinates.
   *
   * Note that if the current page in the docviewer does not have enough space to allow for the
   * minimum margin bottom, the next page will be returned.
   *
   * @param docViewer The docViewer object
   * @param offset The y-offset to apply to the current viewer position
   * @param marginBottom The minimum margin bottom which can be permitted
   */
  getVerticalLocationWithOffset(docViewer: CoreControls.DocumentViewer, offset: number, marginBottom: number): [number, number] {
    const scrollY = docViewer.getScrollViewElement().scrollTop;

    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();

    const topLeft = displayMode.pageToWindow({ x: 0, y: 0 }, 1);

    let page = 1;
    let totalHeight = 0;

    for (const dy = scrollY + topLeft.y; page < docViewer.getPageCount() + 1; ++page) {
      totalHeight += docViewer.getPageHeight(page);
      const height = displayMode.pageToWindow({ x: 0, y: totalHeight }, 1).y;
      if (dy - height < 0) {
        break;
      }
    }

    let Y = displayMode.windowToPage({
      x: 0,
      y: scrollY + topLeft.y
    }, page).y;

    if (Y + offset > docViewer.getPageHeight(page) - marginBottom) {
      ++page;
      Y = offset;
    } else {
      Y += offset;
    }

    return [page, Y];
  }

  /**
   * Sets the annotation content depending on the type of annotation
   * @param annot The annotation whose content should be set
   */
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
      case AnnotationType.TEXT:
        annot.setContents('Texto');
    }
  }

  /**
   * Returns a new dimension for the image given the maximum allowed dimensions.
   * The aspect ratio of the image is preserved.
   * Note that this also returns a new point, which is centered with respect to the maximum allowed dimensions.
   * This point can be ignored if it does not need to be used.
   * @param uriImage The encoded image (Base64)
   * @param coordinates The original coordinates - If you do not need the new point, you can pass anything here.
   * @param maxDims The dimensions of the box constraint
   */
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

  /**
   * Event which triggers when a signature is selected.
   * This also triggers if the current selected signature is selected again.
   * @param base64 The encoded image (Base64)
   */
  async onSignatureUriChange(base64): Promise<void> {
    this.signature = base64;
    this.signatureSigner = base64;
    this.isSignaturesMenuShowing = false;

    const { annotManager } = this.wvInstance;
    let signatureAnnot
    signatureAnnot = annotManager.getAnnotationsList().filter((annot: any) => {
      const fromMiFirma = annot.getCustomData('MiFirma');
      const type = annot.getCustomData('type');
      const rol = annot.getCustomData('rol');
      return fromMiFirma && type === AnnotationType.SIGNATURE && rol === 'Yo';
    });
    if (signatureAnnot.length != 0) {
      for (let i = 0; i < signatureAnnot.length; i++) {
        const signatureIcon = await Jimp.read(this.signatureSigner);
        signatureIcon.scan(0, 0, signatureIcon.bitmap.width, signatureIcon.bitmap.height, (x, y, i) => {
          if (signatureIcon.bitmap.data[i + 3] === 0) {
            signatureIcon.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 2), x, y);
          }
        });
        const signatureIconBase64 = await signatureIcon.getBase64Async(Jimp.MIME_PNG);
        const [dimensions] = await this.scaleImageToFit(
          signatureIconBase64,
          new Point(signatureAnnot[i].getX(), signatureAnnot[i].getX()),
          this.isTemplate ? new Dimension(this.originalDimension[0].width, this.originalDimension[0].height) :
            new Dimension(this.largestWidth, this.largestHeight));
        signatureAnnot[i].Width = dimensions.width;
        signatureAnnot[i].Height = dimensions.height;
        (signatureAnnot[i] as Annotations.StampAnnotation).ImageData = signatureIconBase64;
        annotManager.redrawAnnotation(signatureAnnot[i]);
        annotManager.selectAnnotation(signatureAnnot[i]);
      }
      return;
    }

    this.createAnnot(AnnotationType.SIGNATURE);
  }

  /**
   * Event which triggers when a signature is selected
   * This also triggers if the current selected signature is selected again.
   * @param guidSignature The GUID identifier for the new signature
   */
  onSignatureGuidChange(guidSignature): void {
    if (this.isTemplate && !this.grafoGuid) {
      if (this.hasSignYo) {
        this.signatureCount++;
      }
    }
    this.grafoGuid = guidSignature;
  }

  /**
   * Selects a new signer.
   * @param i The index of the signer to be selected
   */
  chooseSigner(i: number): void {
    this.firmante = this.signers[i];
    this.firmanteIndex = i;
    this.color = this.colors[i % this.colors.length];
    this.isSignaturesMenuShowing = true;
    if (this.firmante.tipo !== 'Yo') {
      this.signature = '';
      this.isSignaturesMenuShowing = false;
    }
    if (this.signatureSigner != '') {
      this.isSignaturesMenuShowing = false;
    }
    this.showMobileMenu = false;
  }

  /**
   * Starts the signing process of the document
   */
  async continuar(): Promise<void> {
    await this.shiftDocs(this.currentDocumentIndex);
    if (this.wvInstance) {

      for (let i = 0; i < this.files.length; i++) {
        let annotations = this.files[i].annots
        if (annotations) {
          let countSignatureAnnot = 0;
          let rolAux = new Set()
          annotations.forEach(annot => {
            if (annot.CustomData.type == AnnotationType.SIGNATURE) {
              if (!rolAux.has(annot.CustomData.owner)) {
                countSignatureAnnot++;
                rolAux.add(annot.CustomData.owner);
              }
            }
          })
          if (countSignatureAnnot != this.signers.length) {
            this.toast.error('Cada firmante debe tener al menos un campo de firma en los documentos a firmar')
            return
          }
        } else {
          this.toast.error('Cada firmante debe tener al menos un campo de firma en los documentos a firmar')
          return
        }
      }
      if (this.getTipoFlujo() !== 1) {
        this.checkSend()
      } else {
        this.validateUser()
      }
    }
  }

  async prepareDocuments(pin?): Promise<void> {
    this.isConfigured = true;
    this.loadingService.startLoading();
    if (this.indexConfiguredDocument + 1 <= this.files.length) {
      const blob = new Blob([this.files[this.indexConfiguredDocument].document], { type: 'application/pdf' });
      this.wvInstance.loadDocument(blob, { extension: 'pdf' });
    } else {
      if (pin) {
        if (this.filesPreview.length > 1) {
          this.setUpConfigureEnvelope(pin)
        } else {
          if (this.isMassive) {
            this.setUpConfigureMassive(pin)
          } else {
            this.setUpConfigure(pin);
          }
        }
      } else {
        if (this.filesPreview.length > 1) {
          this.setUpConfigureEnvelope()
        } else {
          if (this.isMassive) {
            this.setUpConfigureMassive()
          } else {
            this.setUpConfigure();
          }
        }
      }
    }
  }


  checkSend() {
    const modalRef = this.modalService.open(FinishSignComponent, { size: 'xl', centered: true });
    modalRef.result.then((data) => {
      if (data) {
        this.sendData = data
        this.validateUser()
      }
    });
  }

  /**
   * Validates the user identity with one-time password authentication
   */
  validateUser(): void {
    const isMobile = window.innerWidth <= 640;
    const isTablet = !isMobile && window.innerWidth <= 800;
    const isDesktop = !isMobile && !isTablet;

    if (this.getTipoFlujo() !== 3) {
      const windowInfo = Utils.datosMaquina(window);
      this.gatewayService.validateUser(
        localStorage.getItem('correo'),
        '',
        this.userIp,
        windowInfo.browser,
        '',
        windowInfo.os,
        isMobile,
        isTablet,
        isDesktop,
        this.hasCamera,
        false,
        false,
        3
      ).subscribe((respuesta: any) => {
        if (respuesta.statusCode == 200 || respuesta.statusCode == 201 || respuesta.statusCode == 204) {
          if (respuesta.data.nextStep.process == 'OTP') {
            const modalRef = this.modalService.open(PinFirmadorComponent, { centered: true });
            modalRef.componentInstance.authId = respuesta.data.authId;
            modalRef.result.then(async (pin) => {
              if (pin) {
                this.prepareDocuments(pin)
              }
            });
          } else if (respuesta.data.nextStep.process == 'Firma') {
            this.prepareDocuments()
          }
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    }
    if (this.getTipoFlujo() == 3) {
      this.prepareDocuments()
      // this.uploadDoc()
    }
  }

  /**
   * Returns a list of recipients
   * This list is just a strong-typed list of every signer
   */
  getDestinatarios(): Array<Destinatario> {
    const destinatarios: Array<Destinatario> = [];

    for (const firmante of this.signers) {
      destinatarios.push(new Destinatario(firmante.nombre, firmante.correo));
    }
    return destinatarios;
  }

  /**
   * Returns a list of signatures
   * This list is just a strong-typed list of every signature
   */
  async getFirmas(x?: number): Promise<Array<Firma>> {
    const { annotManager, docViewer } = this.wvInstance;
    const doc = docViewer.getDocument();
    const firmas: Array<Firma> = [];
    this.pagesDocument = doc.getPageCount();

    let j = 0;
    let aux = 0;

    for (let i = 0; i < this.signers.length; ++i) {

      const annotations = [];
      if (this.isTemplate) {
        let annots = this.files[x].annots
        annots.filter(annot => {
          const fromMiFirma = annot.getCustomData('MiFirma');
          return fromMiFirma && this.signers[i].tipo == annot.CustomData.rol;
        }).forEach(annot => {
          const type = annot.getCustomData('type');

          if (type === AnnotationType.SIGNATURE) {
            const pdfCoords = doc.getPDFCoordinates(annot.getPageNumber(), annot.getX(), annot.getY());

            const X = Math.round(pdfCoords.x);
            const Y = Math.round(pdfCoords.y);
            const Height = Math.round(annot.getHeight());
            const Width = Math.round(annot.getWidth());
            const PageNumber = Math.round(annot.getPageNumber());

            firmas[j] = new Firma(i + 1, i + 1, false, false, '', 2, this.signers[i].nombre,
              this.signers[i].correo, 0, X, Y - Height, Height, Width, PageNumber - 1, true, this.sendData.reminderDays);
            j++
          } else {
            annotations.push(annot);
          }
        });
      } else {
        let annots = this.files[x].annots
        annots.filter(annot => {
          const fromMiFirma = annot.getCustomData('MiFirma');
          return fromMiFirma && annot.CustomData.index === i;
        }).forEach(annot => {
          const type = annot.getCustomData('type');

          if (type === AnnotationType.SIGNATURE) {
            const pdfCoords = doc.getPDFCoordinates(annot.getPageNumber(), annot.getX(), annot.getY());

            const X = Math.round(pdfCoords.x);
            const Y = Math.round(pdfCoords.y);
            const Height = Math.round(annot.getHeight());
            const Width = Math.round(annot.getWidth());
            const PageNumber = Math.round(annot.getPageNumber());

            firmas[j] = new Firma(i + 1, i + 1, false, false, '', 2, this.signers[i].nombre,
              this.signers[i].correo, 0, X, Y - Height, Height, Width, PageNumber - 1, true, this.sendData.reminderDays);
            j++
          } else {
            annotations.push(annot);
          }
        });
      }
      if (this.signers[i].tipo === 'Yo' || this.signers[i].tipo !== 'Yo') {
        const annotationsXFDF = await annotManager.exportAnnotations({ annotList: annotations });
        for (let x = aux; x < j; x++) {
          firmas[x].signatureAnnotations = annotationsXFDF;
        }
        aux = j;
      }
    }
    return firmas;
  }

  /**
   * Configures the document so that it can later be signed
   * @param pin The OTP which was used for authentication
   */
  async setUpConfigure(pin?: string): Promise<void> {

    const pdfOriBase64 = Utils.Uint8ArrayToStringBase64(this.files[0].document);

    const firmas = await this.getFirmas(0);

    let otherSigners = {}

    if (this.getTipoFlujo() !== 1) {
      let expDays: any = new Date(Date.now() + this.sendData.expDays * 24 * 60 * 60 * 1000);
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(expDays - tzoffset)).toISOString().slice(0, -1);
      otherSigners = {
        enableOrder: this.signInOrder,
        expirationDate: localISOTime,
        subject: this.sendData.affair,
        message: this.sendData.emailBody,
        recipients: this.sendData.emails
      }
    } else {
      otherSigners = null
    }

    const envelope = this.files[0].envelopeId === undefined ? null : this.files[0].envelopeId;

    const isMacro = true;
    const guidMacro = '00000000-0000-0000-0000-000000000000'
    const lastMacro = true;

    this.firmadorService.ConfigurarFirma4(pdfOriBase64,
      this.getTipoFlujo(),
      this.files[0].name,
      firmas,
      this.userIp,
      this.pagesDocument,
      this.timeZone,
      otherSigners,
      this.sessionService.emailUser,
      envelope,
      isMacro,
      guidMacro,
      lastMacro)
      .subscribe((Respuesta: any) => {
        if (
          Respuesta.message === 'Petición exitosa' &&
          Respuesta.data &&
          Respuesta.data.signatures
        ) {
          let guidFirma: string;

          for (const firma of Respuesta.data.signatures) {
            // 1 es el id del firmante principal
            if (firma.id === 1) {
              guidFirma = firma.signatureGuid;
            }
          }
          if (this.getTipoFlujo() !== 3) {
            this.firmarDocumentos(guidFirma, Respuesta.data.documentSerial, pin);
          } else {
            this.startOver();
            this.toast.success('Proceso Exitoso!');
          }
        } else if (Respuesta.status_code === 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
  }


  async setUpConfigureMassive(pin?: string): Promise<void> {


    const firmas = await this.getFirmas(0);

    let otherSigners = {}

    if (this.getTipoFlujo() !== 1) {
      let expDays: any = new Date(Date.now() + this.sendData.expDays * 24 * 60 * 60 * 1000);
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(expDays - tzoffset)).toISOString().slice(0, -1);
      otherSigners = {
        enableOrder: this.signInOrder,
        expirationDate: localISOTime,
        subject: this.sendData.affair,
        message: this.sendData.emailBody,
        recipients: this.sendData.emails
      }
    } else {
      otherSigners = null
    }

    let documents = []
    let firmasMassive = []
    for (let j = 0; j < this.massiveInfo.length; j++) {
      for (let i = 0; i < firmas.length; i++) {
        if (firmas[i].email == 'masivo@temp.com') {
          let firma = new Firma(firmas[i].id, firmas[i].order, firmas[i].requiresPassword, firmas[i].requiresSMS, firmas[i].password, firmas[i].notificationType, this.massiveInfo[j].name,
            this.massiveInfo[j].email, firmas[i].phoneNumber, firmas[i].x, firmas[i].y, firmas[i].height, firmas[i].width, firmas[i].page, firmas[i].requiresDigitalSignature, firmas[i].daysAutoReminder);
          firma.signatureAnnotations = '';
          firma.isAMassiveSignature = false;
          firmasMassive.push(firma)
        } else {
          firmas[i].isAMassiveSignature = true;
          firmas[i].signatureAnnotations = '';
          firmasMassive.push(firmas[i])
        }
      }
      const data = {
        serialDocument: this.massiveInfo[j].serial,
        othersSigners: otherSigners,
        signatures: firmasMassive
      }
      documents.push(data)
      firmasMassive = []
    }

    let signatureGuid = ''

    if (this.getTipoFlujo() == 3) {
      signatureGuid = null;
    } else {
      signatureGuid = this.signingData[0].signatureGUID
    }

    this.firmadorService.ConfigurarFirmaMasivo(signatureGuid,
      this.userIp,
      this.timeZone,
      this.getTipoFlujo(),
      documents)
      .subscribe((Respuesta: any) => {
        if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
          this.toast.success('Proceso Exitoso!');
          this.paramService.googleAnalytics.subscribe((enabled: boolean) => {
            if (enabled) {
              (window as any).dataLayer.push({
                event: 'firmaejecutada',
                tipoCliente: Respuesta.data.clientType,
              });
            }
            this.startOver();
          });
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


  async setUpConfigureEnvelope(pin?: string): Promise<void> {

    this.toast.info('Este proceso puede tardar segun la cantidad de documentos a firmar.')

    let otherSigners = {}

    if (this.getTipoFlujo() !== 1) {
      let expDays: any = new Date(Date.now() + this.sendData.expDays * 24 * 60 * 60 * 1000);
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(expDays - tzoffset)).toISOString().slice(0, -1);
      otherSigners = {
        enableOrder: this.signInOrder,
        expirationDate: localISOTime,
        subject: this.sendData.affair,
        message: this.sendData.emailBody,
        recipients: this.sendData.emails
      }
    } else {
      otherSigners = null
    }

    let guidMacro = '00000000-0000-0000-0000-000000000000'
    let index = 0;
    for (const fileConfig of this.filesConfig) {

      let Respuesta = await this.configurarFirmaEnvelope(fileConfig, otherSigners, guidMacro);

      if (
        Respuesta.message === 'Petición exitosa' &&
        Respuesta.data &&
        Respuesta.data.signatures
      ) {
        let guidFirma: string;
        guidMacro = Respuesta.data.processMacroGuid

        for (const firma of Respuesta.data.signatures) {
          // 1 es el id del firmante principal
          if (firma.id === 1) {
            guidFirma = firma.signatureGuid;
          }
        }
        if (this.getTipoFlujo() !== 3) {
          let resultado = await this.firmarDocumentosEnvelope(fileConfig.file, fileConfig.name, fileConfig.firmas, fileConfig.signingData, guidFirma, Respuesta.data.documentSerial, index, pin);
          if (
            resultado.message === 'Petición exitosa' &&
            resultado.status_code === 200
          ) {

            this.paramService.googleAnalytics.subscribe((enabled: boolean) => {
              if (enabled) {
                (window as any).dataLayer.push({
                  event: 'firmaejecutada',
                  tipoCliente: resultado.data.customerClasification,
                });
              }
              if (index >= (this.filesConfig.length - 1)) {
                this.toast.success('Proceso Exitoso!');
                this.startOver();
              } else {
                this.toast.info(`Documento ${index + 1} de ${this.filesConfig.length} firmado.`)
              }
            });
          } else if (resultado.status_code === 401) {
            this.sessionService.logout();
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }

        } else {
          if (index >= (this.filesConfig.length - 1)) {
            this.cargadorService.stopLoading();
            this.startOver();
            this.toast.success('Proceso Exitoso!');
          }
        }
      } else if (Respuesta.status_code === 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }

      index++;
    }
  }



  async uploadDoc(pin?: string) {
    const pdfOriBase64 = Utils.Uint8ArrayToStringBase64(this.file);
    this.firmadorService.uploadDoc(this.files[0].name, pdfOriBase64).subscribe((respuesta: any) => {
      if (respuesta.statusCode == 200 || respuesta.statusCode == 201) {
        this.setUpConfigure2(respuesta.data.documentId, pin);
      } else if (respuesta.statusCode == 401) {
        this.sessionService.logout();
      } else if (respuesta.statusCode == 204) {
        this.toast.info('Este documento ya existe, por favor cambie el nombre del documento');
        this.router.navigateByUrl('main/documentos');
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  getGuidFirma(info: string, pin?: string) {
    this.firmadorService.getToSign(info).subscribe((respuesta: any) => {
      if (respuesta.statusCode == 200 || respuesta.statusCode == 201) {
        if (this.getTipoFlujo() !== 3) {
          this.firmarDocumentos(respuesta.data.guidFirma, respuesta.data.documentSerial, pin);
        } else {
          this.startOver();
          this.toast.success('Proceso Exitoso!');
        }
      } else if (respuesta.statusCode == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  async setUpConfigure2(id: string, pin?: string): Promise<void> {

    const firmas = await this.getFirmas(0);

    this.firmadorService.ConfigurarFirma2(id,
      this.getDestinatarios(),
      firmas)
      .subscribe((Respuesta: any) => {
        if (Respuesta.statusCode == 200 || Respuesta.statusCode == 201) {
          this.getGuidFirma(Respuesta.data.processId, pin);
        } else if (Respuesta.statusCode == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
  }

  /**
   * Returns an encoded stamp image
   * @param pin The OTP which was used for authentication
   * @param guidSing the sign
   */
  async getESignatureStamp(pin?: string, guidSign?: string): Promise<string> {
    const fontOtherSigners = '/assets/fonts/open-sans-16-black.txt';
    const selloPathBase = '/assets/img/img-esign4x.png';
    const date = new Date();
    let aditionalData = '';
    if (guidSign) {
      aditionalData = `ID Firma: ${guidSign}`;
    } else {
      aditionalData = pin ? `OTP: ${pin} - ` : '';
      aditionalData += `Fecha: ${date.toLocaleDateString('es-CO')} - Hora: ${date.toLocaleTimeString('es-CO', { hour12: false })}`;
    }

    const sello = await Jimp.read(selloPathBase);
    const image = new Jimp(this.stampWidth, this.stampHeight);

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

  /**
   * Returns a stamp annotation whose image data is a stamp
   * @param pin The OTP which was used for authentication
   * @param guidSing the sign
   */
  async getStampAnnotation(pin?: string, guidSing?: string): Promise<Array<Annotations.Annotation>> {
    const { Annotations } = this.wvInstance;
    let stamps = []
    for (let i = 0; i < this.signingData.length; i++) {

      const annotation = new Annotations.StampAnnotation();

      const dims = new Dimension(this.signingData[i].width, this.signingData[i].height);

      const stampDims = new Dimension(dims.width, this.stampHeight * (dims.width / this.stampWidth));
      const stamp = await this.getESignatureStamp(pin, guidSing);

      annotation.PageNumber = this.signingData[i].pageNumber;
      annotation.X = this.signingData[i].x - (dims.width * 0.08);

      annotation.Y = this.signingData[i].y + (dims.height - stampDims.height);
      annotation.Width = stampDims.width;
      annotation.Height = stampDims.height;
      annotation.NoMove = true;
      annotation.NoResize = true;
      annotation.NoRotate = true;
      annotation.ImageData = stamp;
      stamps.push(annotation)
    }

    return stamps;
  }


  async getStampAnnotationEnvelope(signingData: any[], pin?: string, guidSing?: string): Promise<Array<Annotations.Annotation>> {
    return new Promise<Array<Annotations.Annotation>>(async (resolve, _) => {
      const { Annotations } = this.wvInstance;
      let stamps = []
      for (let i = 0; i < signingData.length; i++) {

        const annotation = new Annotations.StampAnnotation();

        const dims = new Dimension(signingData[i].width, signingData[i].height);

        const stampDims = new Dimension(dims.width, this.stampHeight * (dims.width / this.stampWidth));
        const stamp = await this.getESignatureStamp(pin, guidSing);

        annotation.PageNumber = signingData[i].pageNumber;
        annotation.X = signingData[i].x - (dims.width * 0.08);

        annotation.Y = signingData[i].y + (dims.height - stampDims.height);
        annotation.Width = stampDims.width;
        annotation.Height = stampDims.height;
        annotation.NoMove = true;
        annotation.NoResize = true;
        annotation.NoRotate = true;
        annotation.ImageData = stamp;
        stamps.push(annotation)
      }

      resolve(stamps);
    });
  }

  /**
   * Signs the document
   * This flattens the user annotations on the client side
   * @param guidFirma The signature identifier for this signer
   * @param serialDoc The document identifier
   * @param pin The OTP which was used for authentication
   */
  async firmarDocumentos(guidFirma: string, serialDoc: string, pin?: string): Promise<void> {
    const { annotManager, docViewer } = this.wvInstance;
    const doc = docViewer.getDocument();

    let annots = this.files[0].annots

    annots = annots.filter((annot: any) => {
      const rol = annot.getCustomData('rol');
      return rol === 'Yo';
    });

    const stampAnnotation = await this.getStampAnnotation(pin, guidFirma);

    const signatureType = Utils.getExtensionImageFromURI(this.signatureSigner);


    let xfdfString
    if (signatureType !== 'png') {
      xfdfString = await annotManager.exportAnnotations({
        annotList: [...annots, ...stampAnnotation],
        widgets: true,
        links: true,
        fields: true
      });
    } else {
      xfdfString = await annotManager.exportAnnotations({
        annotList: [...stampAnnotation, ...annots],
        widgets: true,
        links: true,
        fields: true
      });
    }

    const options = { xfdfString, flatten: true };
    const data = await doc.getFileData(options);
    const arr = new Uint8Array(data);

    this.firmadorService.EjecutarFirma(guidFirma,
      localStorage.getItem('personaNombre'),
      this.signingData[0].signatureGUID,
      Utils.Uint8ArrayToStringBase64(arr),
      serialDoc,
      this.userIp,
      this.timeZone,
      pin
    ).subscribe((Respuesta: any) => {
      if (
        Respuesta.message === 'Petición exitosa' &&
        Respuesta.status_code === 200
      ) {
        this.toast.success('Proceso Exitoso!');

        this.paramService.googleAnalytics.subscribe((enabled: boolean) => {
          if (enabled) {
            (window as any).dataLayer.push({
              event: 'firmaejecutada',
              tipoCliente: Respuesta.data.customerClasification,
            });
          }
          this.startOver();
        });
      } else if (Respuesta.status_code === 401) {
        this.sessionService.logout();
      } else {
        this.toast.error('No se pudo ejecutar la firma!');
        this.router.navigateByUrl('main/agregarfirmantes');
      }
    });
  }

  firmarDocumentosEnvelope(file, name, firmas, signingData: any[], guidFirma: string, serialDoc: string, index: number, pin?: string): Promise<any> {
    return new Promise<any>(async (resolve, _) => {
      this.cargadorService.startLoading();

      const blob = new Blob([file], { type: 'application/pdf' });
      this.wvInstance.loadDocument(blob, { filename: name });

      this.wvInstance.docViewer.one('documentLoaded', async () => {

        const { annotManager, docViewer } = this.wvInstance;
        const doc = docViewer.getDocument();
        let annots = annotManager.getAnnotationsList().filter((annot: any) => {
          const fromMiFirma = annot.getCustomData('MiFirma');
          const rol = annot.getCustomData('rol');
          return !fromMiFirma || rol === 'Yo';
        });
        annotManager.deleteAnnotations(annots)
        await this.loadAnnots(index);
        annots = annotManager.getAnnotationsList().filter((annot: any) => {
          const fromMiFirma = annot.getCustomData('MiFirma');
          const rol = annot.getCustomData('rol');
          return !fromMiFirma || rol === 'Yo';
        });

        const stampAnnotation = await this.getStampAnnotationEnvelope(signingData, pin, guidFirma);

        const signatureType = Utils.getExtensionImageFromURI(this.signatureSigner);


        let xfdfString
        if (signatureType !== 'png') {
          xfdfString = await annotManager.exportAnnotations({
            annotList: [...annots, ...stampAnnotation],
            widgets: true,
            links: true,
            fields: true
          });
        } else {
          xfdfString = await annotManager.exportAnnotations({
            annotList: [...stampAnnotation, ...annots],
            widgets: true,
            links: true,
            fields: true
          });
        }

        const options = { xfdfString, flatten: true };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);

        let Respuesta = await this.EjecutarFirmaEnvelope(guidFirma, signingData[0], arr, serialDoc, pin);
        this.cargadorService.stopLoading();
        resolve(Respuesta);
      })
    });
  }


  async loadAnnotationsEnvelope(firmas: any, sign: any): Promise<void> {

    return new Promise<void>(async (resolve, _) => {
      const annotManager = this.wvInstance.docViewer.getAnnotationManager();
      const docObject = this.wvInstance.docViewer.getDocument();
      const annotations = this.wvInstance.Annotations;

      for (let i = 0; i < sign.length; i++) {
        const document = sign[i];

        if (firmas[i].signatureAnnotations) {
          await annotManager.importAnnotations(firmas[i].signatureAnnotations);

          const annotationsList = annotManager.getAnnotationsList()
            .filter(annot => {
              return annot.getCustomData('MiFirma');
            });

          document.annotations = annotationsList.map((annot) =>
            ({ annotationObject: annot, configured: false })) as Array<IAnnotation>;


        }

        const signature = sign[i];

        const annotation = new annotations.StampAnnotation();

        const [dimensions, coordinates] = await this.scaleImageToFit(
          sign[i].image,
          new Point(signature.pdfCoordinates.x, signature.pdfCoordinates.y),
          new Dimension(signature.width, signature.height));

        annotation.PageNumber = firmas[i].page + 1;
        annotation.X = coordinates.x;
        annotation.Y = docObject.getPageInfo(firmas[i].page + 1).height - coordinates.y;
        annotation.Width = dimensions.width;
        annotation.Height = dimensions.height;
        annotation.NoMove = true;
        annotation.NoResize = false;
        annotation.NoRotate = true;
        annotation.ImageData = sign[i].image;
        annotation.CustomData = {
          type: AnnotationType.SIGNATURE
        };

        annotManager.addAnnotation(annotation, false);

        annotManager.redrawAnnotation(annotation);

        document.annotations = {
          annotationObject: annotation, configured: false
        };
      }
      resolve();
    });
  }

  /**
   * Starts a new process if there are pending documents to be signed.
   * Otherwise, it redirects the user to the list of documents
   */
  startOver(): void {
    this.fdService.addAllFiles([]);
    this.fdService.addFilesConfig([]);
    this.fdService.signMasiv([]);
    this.router.navigateByUrl('main/repositorio');
  }

  /**
   * Returns a number which represents the type of flow which is getting processed
   * Only me => 1
   * Me and others => 2
   * Others => 3
   */
  getTipoFlujo(): number {
    const me = this.signers.find(signer => signer.tipo === 'Yo');
    return (me && this.signers.length === 1) ? 1 : me ? 2 : 3;
  }

  async nextFile(j: number): Promise<void> {

    if (this.wvInstance && this.noIntoSign) {

      const { docViewer } = this.wvInstance;

      const doc = docViewer.getDocument();

      let signatureAnnot = this.files[j].annots

      signatureAnnot = signatureAnnot.filter((annot: any) => {
        const fromMiFirma = annot.getCustomData('MiFirma');
        const type = annot.getCustomData('type');
        const rol = annot.getCustomData('rol');
        return fromMiFirma && type === AnnotationType.SIGNATURE && rol === 'Yo';
      });

      let signData = []

      if (signatureAnnot.length != 0) {
        for (let i = 0; i < signatureAnnot.length; i++) {
          const x = signatureAnnot[i].getX();
          const y = signatureAnnot[i].getY();
          const width = signatureAnnot[i].getWidth();
          const height = signatureAnnot[i].getHeight();
          const pageNumber = signatureAnnot[i].getPageNumber();
          const image = (signatureAnnot[i] as Annotations.StampAnnotation).ImageData;
          const signerName = localStorage.getItem('personaNombre');

          const pdfCoordinates = doc.getPDFCoordinates(pageNumber, x, y);

          const data = {
            signerName,
            pageNumber,
            x,
            y,
            width,
            height,
            image,
            pdfCoordinates,
            signatureGUID: this.grafoGuid,
          };

          signData.push(data)
        }
      } else {
        if (this.isTemplate) {
          const { annotManager, docViewer } = this.wvInstance;
          const doc = docViewer.getDocument();

          const freeTextsWidgetAnnots = annotManager.getAnnotationsList().filter((annot: any) => {
            const fromMiFirma = annot.getCustomData('MiFirma');
            const rol = annot.getCustomData('rol');
            return fromMiFirma && rol === 'Yo';
          });

          const xfdfString = await annotManager.exportAnnotations({ annotList: [...freeTextsWidgetAnnots] });
          const options = { xfdfString, flatten: true };
          const data = await doc.getFileData(options);
          this.files[0].document = new Uint8Array(data);
          if (this.getTipoFlujo() !== 3) {
            this.signers.shift();
          }
        }
      }

      const dataConfig = {
        firmas: await this.getFirmas(j),
        pagesDocument: this.pagesDocument,
        envelope: this.files[j].envelopeId === undefined ? null : this.files[j].envelopeId,
        name: this.files[j].name,
        wvInstance: this.wvInstance,
        signingData: signData,
        file: this.files[j].document,
        isMacro: true,
        lastMacro: j + 1 === this.files.length ? true : false
      };


      this.signingData = signData;
      this.filesConfig.push(dataConfig);
      this.indexConfiguredDocument += 1;
      this.prepareDocuments();
    }
  }

  getAllFiles(): Promise<any[]> {
    return new Promise<any[]>((resolve, _) => {
      this.fdService.allFilesListener$.subscribe(files => {
        resolve(files);
      })
    });
  }

  getFilesConfig(): Promise<any[]> {
    return new Promise<any[]>((resolve, _) => {
      this.fdService.allFilesConfigListener$.subscribe(files => {
        resolve(files);
      });
    });
  }

  configurarFirmaEnvelope(fileConfig: any, otherSigners: any, guidMacro: string): Promise<any> {
    return new Promise<any>((resolve, _) => {

      this.firmadorService.ConfigurarFirma4(Utils.Uint8ArrayToStringBase64(fileConfig.file),
        this.getTipoFlujo(),
        fileConfig.name,
        fileConfig.firmas,
        this.userIp,
        fileConfig.pagesDocument,
        this.timeZone,
        otherSigners,
        this.sessionService.emailUser,
        fileConfig.envelope,
        fileConfig.isMacro,
        guidMacro,
        fileConfig.lastMacro)
        .subscribe((Respuesta: any) => {
          resolve(Respuesta);
        });

    });
  }

  EjecutarFirmaEnvelope(guidFirma: string, signingData: any, arr: Uint8Array, serialDoc: string, pin: string): Promise<any> {
    return new Promise<any>((resolve, _) => {
      this.firmadorService.EjecutarFirma(guidFirma,
        localStorage.getItem('personaNombre'),
        signingData.signatureGUID,
        Utils.Uint8ArrayToStringBase64(arr),
        serialDoc,
        this.userIp,
        this.timeZone,
        pin
      ).subscribe((Respuesta: any) => {
        resolve(Respuesta);
      });
    });
  }

  async getAnnot(): Promise<any> {
    const { annotManager, docViewer } = this.wvInstance;
    const doc = docViewer.getDocument();

    const data = await doc.getFileData();
    return new Uint8Array(data);
  }
}
