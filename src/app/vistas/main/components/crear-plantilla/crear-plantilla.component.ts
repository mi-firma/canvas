import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FiledataService } from 'src/app/servicios/filedata.service';
import WebViewer, {
  CoreControls as _CoreControls,
  Annotations as _Annotations,
  Tools as _Tools,
  WebViewerInstance
} from '@pdftron/webviewer';
import { ToastrService } from 'ngx-toastr';
import { TemplatesService } from 'src/app/servicios/templates.service';
import { IRoles } from 'src/app/interfaces/Templates/roles.interface';
import { AnnotationType } from 'src/app/interfaces/Documents/document.interface';
import * as Utils from 'src/app/Utilidades/utils';
import { SessionService } from 'src/app/servicios';
import { Console } from 'console';

const licenseKey = 'OLIMPIA IT SAS(olimpiait.com):OEM:MiFirma::B+:AMS(20211027):88B5E2D204D7380AB360B13AC9A2737860612FEDB9C3F535E57C699658E5832D8969BEF5C7';

@Component({
  selector: 'app-crear-plantilla',
  templateUrl: './crear-plantilla.component.html',
  styleUrls: ['./crear-plantilla.component.css']
})
export class CrearPlantillaComponent implements AfterViewInit, OnInit, OnDestroy {

  webViewerInstance: WebViewerInstance;

  constructor(
    private fdService: FiledataService,
    private router: Router,
    private toastr: ToastrService,
    private templateService: TemplatesService,
    public activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    public detector: ChangeDetectorRef
  ) { }

  colors = ['#A0DAFF', '#F5CD9D', '#9EEAAA', '#f0f024', '#9e267d', '#e3223f', '#1adbdb', '#136fd1', '#be4ef2'];

  mySubscription: Subscription;

  file: Uint8Array;
  fileName: string = '';
  showMobileMenu = false;
  activeProperties = true;

  currentFont: number = 0

  fonts = ['Times-Roman', 'Helvetica', 'Courier']

  annotationType = AnnotationType;

  isEdit = false;

  currentRequired: boolean;
  currentTextAnnot: string;

  annotCount: number = 0;

  roles: IRoles[] = [{
    name: 'Yo',
    color: this.colors[0],
    xfdfData: null,
    required: false,
    deleted: false,
    id: 0,
  }];

  currentRole = 0;
  roleName = '';

  editIdTemplate;
  annots = [];


  ngOnInit(): void {
    this.editIdTemplate = this.activatedRoute.snapshot.paramMap.get('id');
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initWebViewer();
    if (this.editIdTemplate != null) {
      this.isEdit = true;
      await this.getEditFile();
      await this.init2();
      this.initEdit();
    } else {
      await this.getFiles();
      this.init();
    }
  }

  async initWebViewer(): Promise<void> {
    this.webViewerInstance = await WebViewer({
      licenseKey,
      path: '/assets/webviewer',
      css: '/assets/webviewer/custom/styles.css',
      disabledElements: [
        'header',
        'toolsHeader',
        'pageNavOverlay',
        //'annotationPopup',
        'richTextPopup',
        'contextMenuPopup',
        'linkButton',
        'annotationGroupButton'
      ],
      enableFilePicker: false,
    }, document.getElementById('viewer'));

    this.webViewerInstance.setLanguage('es')

    this.webViewerInstance.disableFeatures([
      this.webViewerInstance.Feature.Ribbons,
      this.webViewerInstance.Feature.TextSelection,
      this.webViewerInstance.Feature.NotesPanel,
      this.webViewerInstance.Feature.FilePicker,
      this.webViewerInstance.Feature.Print,
      this.webViewerInstance.Feature.Download,
    ]);

    this.addCustomActions();
    this.turnOffHotkeys();

    const { annotManager } = this.webViewerInstance;

    this.webViewerInstance.setFitMode(this.webViewerInstance.FitMode.FitWidth);

    annotManager.on('annotationChanged', (annotations, action) => {
      if (action === 'delete') {
        annotations.forEach(annot => {
          this.annotCount--;
        });
        this.detector.detectChanges();
      }
    });

    annotManager.on('annotationSelected', (annotations, action) => {
      if (action === 'selected') {
        const { annotManager } = this.webViewerInstance;
        annotManager.getSelectedAnnotations().forEach(annot => {
          if (annot.CustomData.required) {
            this.currentRequired = true;
          } else {
            this.currentRequired = false;
          }
          this.currentTextAnnot = annot.getContents()
        });
        this.activeProperties = false;
      }
      if (action === 'deselected') {
        this.activeProperties = true;
        this.currentTextAnnot = ''
      }
      this.detector.detectChanges();
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

    function duplicateAnnot(): void {

      const { annotManager, Annotations } = self.webViewerInstance;

      annotManager.getSelectedAnnotations().forEach(annot => {
        const copy = annotManager.getAnnotationCopy(annot);

        const role = self.roles[copy.CustomData.roleId];

        const [r, g, b] = [parseInt(role.color.slice(1, 3), 16),
        parseInt(role.color.slice(3, 5), 16),
        parseInt(role.color.slice(5, 7), 16)];

        (copy as _Annotations.FreeTextAnnotation).FillColor = new Annotations.Color(r, g, b, 0.5);

        (annotManager as any).addAnnotation(copy, {
          imported: false,
          isUndoRedo: false,
          autoFocus: false
        });

        annotManager.redrawAnnotation(copy);
      });

    }

    function changeAnnotationFont() {
      const { annotManager, Annotations } = self.webViewerInstance;
      const annots = annotManager.getSelectedAnnotations();

      annots.forEach(annot => {
        if (annot instanceof Annotations.FreeTextAnnotation) {
          annot.Font = self.fonts[self.currentFont]
          self.currentFont++
          if (self.currentFont == 3) {
            self.currentFont = 0
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
      img: 'assets/icons/gLgowh.svg',
      dataElement: 'duplicateAnnot',
      onClick: duplicateAnnot,
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
    const blob = new Blob([this.file], { type: 'application/pdf' });
    this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });
  }

  initEdit() {
    const blob = new Blob([this.file], { type: 'application/pdf' });
    this.webViewerInstance.loadDocument(blob, { extension: 'pdf' });

    this.webViewerInstance.docViewer.on('documentLoaded', async () => {
      const annotManager = this.webViewerInstance.annotManager;


      this.annots.forEach(async firmante => {
        await annotManager.importAnnotations(firmante.xfdfData);
      });
      this.roles = [];
      const roles = [];
      annotManager.getAnnotationsList().forEach(annot => {
        const data = {
          name: annot.CustomData.rol,
          color: annot.CustomData.color,
          xfdfData: null,
          required: false,
          deleted: false,
          id: annot.CustomData.roleId
        };
        if (!roles.includes(annot.CustomData.rol)) {
          roles.push(annot.CustomData.rol);
          this.roles.push(data);
        }
      });

    });
  }

  async init2(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.templateService.getAllParameters(this.editIdTemplate).subscribe((respuesta: any) => {
        if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
          this.annots = respuesta.data;
          resolve();
        } else if (respuesta.status_code == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    });
  }

  getFiles = () => {
    return new Promise<void>((resolve) => {
      this.mySubscription = this.fdService.filesListener$.subscribe(async files => {
        if (files.length === 0) {
          this.router.navigateByUrl('main/plantillas');
          return;
        }
        this.fileName = files[0].name;
        await this.setFile(files[0]);
        resolve();
      });
    });
  }

  getEditFile = () => {
    return new Promise<void>((resolve, reject) => {
      this.templateService.getTemplate(this.editIdTemplate).subscribe((respuesta: any) => {
        if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
          this.file = Utils.stringToUint(respuesta.data.base64File)
          resolve();
        } else if (respuesta.status_code == 401) {
          this.sessionService.logout();
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
        }
      });
    });
  }

  async setFile(file: File): Promise<void> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        this.file = new Uint8Array(e.target.result);
        resolve();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  getVerticalLocationWithOffset(docViewer: _CoreControls.DocumentViewer, offset: number, marginBottom: number): [number, number] {
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

  isEmpty() {
    return !this.roles.some(rol => { return !rol.deleted })
  }

  createAnnot(content: string, typeAnnot: AnnotationType): void {

    const isRol = this.roles.some(rol => {
      return !rol.deleted
    })

    if (!isRol) {
      return
    }

    const { Annotations, annotManager, docViewer } = this.webViewerInstance;

    const textAnnot = new Annotations.FreeTextAnnotation();

    // const annots = annotManager.getAnnotationsList().filter(annot => {
    //   return annot.CustomData.rol == this.roles[this.currentRole].name;
    // });
    // let hasSignature = false;
    // annots.forEach(annot =>{
    //   if(annot.CustomData.type == AnnotationType.SIGNATURE && typeAnnot == AnnotationType.SIGNATURE){
    //     hasSignature = true
    //   }
    // })

    // if(hasSignature){
    //   return
    // }

    annotManager.deselectAllAnnotations()

    const [page, height] = this.getVerticalLocationWithOffset(docViewer, 100, 20);

    textAnnot.PageNumber = page;
    textAnnot.X = 100;
    textAnnot.Y = height;
    textAnnot.Width = 100;
    textAnnot.Height = 20;

    textAnnot.setContents(content);
    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));

    const color = this.roles[this.currentRole].color;

    const [r, g, b] = [parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16)];

    textAnnot.FillColor = new Annotations.Color(r, g, b, 0.5);
    textAnnot.TextColor = new Annotations.Color(0, 0, 0);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(r, g, b, 1);
    textAnnot.TextAlign = 'center';
    textAnnot.FontSize = '12pt';

    textAnnot.setCustomData('roleId', this.currentRole);
    textAnnot.setCustomData('type', typeAnnot);
    textAnnot.setCustomData('color', this.roles[this.currentRole].color);
    textAnnot.setCustomData('rol', this.roles[this.currentRole].name);
    textAnnot.setCustomData('required', false);
    textAnnot.setCustomData('MiFirma', true);
    if (typeAnnot == AnnotationType.SIGNATURE) {
      textAnnot.setCustomData('signature', 'yes');
    } else {
      textAnnot.setCustomData('signature', 'no');
    }

    (annotManager as any).addAnnotation(textAnnot, {
      imported: false,
      isUndoRedo: false,
      autoFocus: false
    });
    annotManager.redrawAnnotation(textAnnot);
    annotManager.selectAnnotation(textAnnot);
    this.annotCount++;
  }

  changeContent(content: string): void {

    const { annotManager } = this.webViewerInstance;

    annotManager.getSelectedAnnotations().forEach(annot => {
      annot.setContents(content);
    });
  }

  setRequiredAnnot(required: boolean): void {

    const { annotManager } = this.webViewerInstance;

    annotManager.getSelectedAnnotations().forEach(annot => {
      annot.setCustomData('required', required);
    });
  }

  duplicateAnnot(): void {

    const { annotManager, Annotations } = this.webViewerInstance;

    annotManager.getSelectedAnnotations().forEach(annot => {
      const copy = annotManager.getAnnotationCopy(annot);

      const role = this.roles[copy.CustomData.roleId];

      const [r, g, b] = [parseInt(role.color.slice(1, 3), 16),
      parseInt(role.color.slice(3, 5), 16),
      parseInt(role.color.slice(5, 7), 16)];

      (copy as _Annotations.FreeTextAnnotation).FillColor = new Annotations.Color(r, g, b, 0.5);

      (annotManager as any).addAnnotation(copy, {
        imported: false,
        isUndoRedo: false,
        autoFocus: false
      });

      annotManager.redrawAnnotation(copy);
    });

  }

  deleteAnnot(byRole: boolean, roleId?: number): void {

    const { annotManager } = this.webViewerInstance;

    if (byRole) {

      annotManager.deleteAnnotations(annotManager.getAnnotationsList().filter(annot => {
        return annot.CustomData.roleId === roleId;
      }));
    } else {
      annotManager.deleteAnnotations(annotManager.getSelectedAnnotations());
    }

  }

  updatesIds() {

  }

  toggleSignerMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeRole(i: number, event) {
    if (event.isUserInput) {
      this.currentRole = i;
    }
  }

  searchColor() {
    const temp = {}
    for (let j = 0; j < this.colors.length; j++) {
      temp[this.colors[j]] = 0
    }
    for (let j = 0; j < this.roles.length; j++) {
      if (!this.roles[j].deleted) {
        temp[this.roles[j].color]++
      }
    }
    const keysSorted = Object.keys(temp).sort(function (a, b) { return temp[a] - temp[b] })
    return keysSorted[0]


  }

  addRole(): void {
    let repeatRol = false
    for (const rol of this.roles) {
      let rolName = this.roleName.trim()
      if (rolName.toLowerCase() == rol.name.toLowerCase()) {
        console.log(rol, this.roleName)
        if (rol.deleted) {
          repeatRol = false
        } else {
          repeatRol = true
        }
      }
    }
    if (this.roleName.trim() !== '' && !repeatRol) {
      this.roles.push({
        color: this.searchColor(),
        name: this.roleName.charAt(0).toUpperCase() + this.roleName.slice(1),
        required: true,
        xfdfData: null,
        deleted: false,
        id: this.roles.length,
      });
      const e = {
        isUserInput: true
      }
      this.changeRole(this.roles.length - 1, e)
    } else {
      if (repeatRol) {
        this.toastr.error('El rol no puede ser igual a los que ya existen.');
      } else {
        this.toastr.error('El rol no puede estar vacio.');
      }

    }
    this.roleName = '';
  }

  deleteRole(i: number): void {
    this.deleteAnnot(true, this.roles[i].id);
    this.roles[i].deleted = true;
    for (let j = 0; j < this.roles.length; j++) {
      if (!this.roles[j].deleted) {
        const e = {
          isUserInput: true
        }
        this.changeRole(j, e)
        break;
      }
    }
  }

  async createTemplate(): Promise<void> {
    const { annotManager } = this.webViewerInstance;
    let yoActive = false
    let activeRol = 0
    for (const rol of this.roles) {
      if (!rol.deleted && rol.name != 'Yo') {
        activeRol++
      }
    }

    if (activeRol == 0) {
      for (const rol of this.roles) {
        if (!rol.deleted && rol.name == 'Yo') {
          activeRol++
          yoActive = true
        }
      }
    }

    const annotations = annotManager.getAnnotationsList()
    let countSignatureAnnot = 0;
    let rolAux = new Set()
    annotations.forEach(annot => {
      if (annot.CustomData.type == AnnotationType.SIGNATURE && annot.CustomData.rol != 'Yo') {
        if (!rolAux.has(annot.CustomData.rol)) {
          countSignatureAnnot++;
          rolAux.add(annot.CustomData.rol);
        }
      }
    })

    if (countSignatureAnnot == 0 && yoActive) {
      annotations.forEach(annot => {
        if (annot.CustomData.type == AnnotationType.SIGNATURE && annot.CustomData.rol == 'Yo') {
          countSignatureAnnot++;
          return;
        }
      })
    }

    if (countSignatureAnnot < activeRol) {
      this.toastr.info("Debe existir una anotación 'Firma' por cada rol diferente a 'Yo'. Si 'Yo' es el único rol debe contener la anotación 'Firma'")
      return
    }

    let contentAnotsInvalid = false

    for (let i = 0; i < this.roles.length; i++) {
      let anots = annotManager.getAnnotationsList().filter(annot => {
        return annot.CustomData.rol === this.roles[i].name;
      });

      let contentAnots = new Set()
      anots.forEach(annot => {
        if(annot.CustomData.type != AnnotationType.SIGNATURE){
          if (!contentAnots.has(annot.getContents())) {
            contentAnots.add(annot.getContents());
          }else{
            contentAnotsInvalid = true
          }
        }
      })
    }

    if(contentAnotsInvalid){
      this.toastr.info('Las anotaciones para un mismo rol no pueden tener el mismo nombre.')
      return
    }

    const annots: _Annotations.Annotation[][] = [];

    for (const _ of this.roles) {
      annots.push([]);
    }

    annotManager.getAnnotationsList().filter(annot => {
      return annot.CustomData.MiFirma;
    }).forEach(annot => {
      annots[annot.CustomData.roleId].push(annot);
    });

    const xfdfData: any[] = [];

    annots.forEach(async (annot: _Annotations.Annotation[]) => {
      if (annot.length != 0) {
        xfdfData.push(
          {
            isRequired: true,
            xfdfData: await annotManager.exportAnnotations({
              annotList: annot
            })
          }
        );
      }
    });


    const pdfOriBase64 = Utils.Uint8ArrayToStringBase64(this.file);

    this.templateService.createTemplate(this.fileName, pdfOriBase64).subscribe((respuesta: any) => {
      const message = respuesta.messagge.split('.');
      if (message[0] == 'The specified blob already exists') {
        this.toastr.info('El documento usado ya existe, cambie el nombre del documento para poder volver a usarlo.');
        this.router.navigateByUrl('main/plantillas');
      }
      if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
        this.templateService.associateAnots(xfdfData, respuesta.data.templateId).subscribe((res: any) => {
          if (res.status_code == 200 || res.status_code == 204 || res.status_code == 201) {
            this.toastr.success('Plantilla creada correctamente');
            this.router.navigateByUrl('main/plantillas');
          } else if (res.status_code == 401) {
            this.sessionService.logout();
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      } else if (respuesta.status_code == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  editTemplate() {
    const { annotManager } = this.webViewerInstance;
    let yoActive = false
    let activeRol = 0
    for (const rol of this.roles) {
      if (!rol.deleted && rol.name != 'Yo') {
        activeRol++
      }
    }

    if (activeRol == 0) {
      for (const rol of this.roles) {
        if (!rol.deleted && rol.name == 'Yo') {
          activeRol++
          yoActive = true;
        }
      }
    }

    const annotations = annotManager.getAnnotationsList()
    let countSignatureAnnot = 0;
    let rolAux = new Set()
    annotations.forEach(annot => {
      if (annot.CustomData.type == AnnotationType.SIGNATURE && annot.CustomData.rol != 'Yo') {
        if (!rolAux.has(annot.CustomData.rol)) {
          countSignatureAnnot++;
          rolAux.add(annot.CustomData.rol);
        }
      }
    })

    if (countSignatureAnnot == 0 && yoActive) {
      annotations.forEach(annot => {
        if (annot.CustomData.type == AnnotationType.SIGNATURE && annot.CustomData.rol == 'Yo') {
          countSignatureAnnot++;
        }
      })
    }

    if (countSignatureAnnot < activeRol) {
      this.toastr.info("Debe existir una anotación 'Firma' por cada rol diferente a 'Yo'. Si 'Yo' es el único rol debe contener la anotación 'Firma'")
      return
    }

    let contentAnotsInvalid = false

    for (let i = 0; i < this.roles.length; i++) {
      let anots = annotManager.getAnnotationsList().filter(annot => {
        return annot.CustomData.rol === this.roles[i].name;
      });

      let contentAnots = new Set()
      anots.forEach(annot => {
        if(annot.CustomData.type != AnnotationType.SIGNATURE){
          if (!contentAnots.has(annot.getContents())) {
            contentAnots.add(annot.getContents());
          }else{
            contentAnotsInvalid = true
          }
        }
      })
    }

    if(contentAnotsInvalid){
      this.toastr.info('Las anotaciones para un mismo rol no pueden tener el mismo nombre.')
      return
    }

    const annots: _Annotations.Annotation[][] = [];

    for (const _ of this.roles) {
      annots.push([]);
    }


    for (let i = 0; i < this.roles.length; i++) {
      annotManager.getAnnotationsList().filter(annot => {
        return annot.CustomData.MiFirma && annot.CustomData.rol == this.roles[i].name;
      }).forEach(annot => {
        annots[i].push(annot);
      });
    }

    const xfdfData: any[] = [];

    annots.forEach(async (annot: _Annotations.Annotation[]) => {
      if (annot.length != 0) {
        xfdfData.push(
          {
            isRequired: true,
            xfdfData: await annotManager.exportAnnotations({
              annotList: annot
            })
          }
        );
      }
    });

    const disAnnots = [];

    for (let index = 0; index < this.annots.length; index++) {
      disAnnots.push(this.annots[index].parameterId);
    }

    this.templateService.disassociateAnots(disAnnots).subscribe((respuesta: any) => {
      if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
        this.templateService.associateAnots(xfdfData, +this.editIdTemplate).subscribe((res: any) => {
          if (res.status_code == 200 || res.status_code == 204 || res.status_code == 201) {
            this.toastr.success('Plantilla actualizada correctamente');
            this.router.navigateByUrl('main/plantillas');
          } else if (res.status_code == 401) {
            this.sessionService.logout();
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      } else if (respuesta.status_code == 401) {
        this.sessionService.logout();
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
