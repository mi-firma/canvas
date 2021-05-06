import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ToastrService } from 'ngx-toastr';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { TitleCasePipe } from '@angular/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/servicios';
import * as Jimp from 'jimp';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-customize-signature',
    templateUrl: './customize-signature.component.html',
    styleUrls: ['./customize-signature.component.css']
})
export class CustomizeSignatureComponent implements OnInit, AfterViewInit, OnDestroy {
    // Emits the uri of the generated signature image - base64
    @Output() saveEvent = new EventEmitter<string>();

    // The width of the signature pad container
    @Input() signaturePadWidth: number;

    // Refernce to the signature pad DOM object
    @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

    // Uploaded image
    uploadImageAsset: any = '/assets/img/img-drag-drop-firma.png';

    uploadImageAsset2: any = '/assets/img/img-drag-drop-firma.png';

    // URL of selected font
    font = '';

    // Uri of the generated signature image - base64
    capturedImage;

    // Text written signature component
    textSignature: string;

    // Name of the file that has been uploaded
    fileNameUpload = '';

    // Upload files HTML content component
    uploadImage: HTMLCollection;

    // List of font families
    fonts = [
        { font: 'Dancing Script', url: '/assets/fonts/dancingScript2.txt' },
        { font: 'Caveat', url: '/assets/fonts/caveat2.txt' },
        { font: 'Great Vibes', url: '/assets/fonts/greatVibes2.txt' },
        { font: 'Sofia', url: '/assets/fonts/sofia5.txt' }
    ];

    // Name of selected font family
    fontValue: string = this.fonts[0].font;

    // Signature pad configuration attributes
    signaturePadOptions: object;

    // Subscriptions
    addSignatureSubscription: Subscription;

    constructor(
        public toast: ToastrService,
        public firmadorService: FirmadorService,
        public titleCase: TitleCasePipe,
        public cargadorService: LoaderService,
        public sessionService: SessionService,
        public router: Router
    ) { }

    /**
     * Sets the default written signature text equal to the user name
     */
    ngOnInit(): void {
        this.textSignature = this.titleCase.transform(this.sessionService.username);
        this.signaturePadOptions = {
            'canvasHeight': 150,
            'canvasWidth': this.signaturePadWidth
        };
    }

    /**
     * Finds an element reference
     */
    ngAfterViewInit(): void {
        this.uploadImage = document.getElementsByClassName('drop-box-cont2');
    }

    /**
     * Generates an image for the written signature
     */
    async saveNameSignature(): Promise<void> {
        this.cargadorService.startLoading();
        this.findUrl();

        const font = await Jimp.loadFont(this.font);
        const lengthText = Jimp.measureText(font, this.textSignature);
        const heightText = Jimp.measureTextHeight(font, this.textSignature, lengthText * 2);
        const horizontalPadding = 20;
        const verticalPadding = 5;
        const image = await new Jimp(lengthText + horizontalPadding * 2, heightText + verticalPadding * 2);

        image.print(
            font, 0, 0,
            {
                text: this.textSignature,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            image.bitmap.width,
            image.bitmap.height,
        );
        this.capturedImage = await image.getBase64Async(Jimp.MIME_PNG);
        this.save('png');
    }

    /**
     * Finds the url of the selected font family
     */
    findUrl(): void {
        for (const fontObj of this.fonts) {
            if (fontObj.font === this.fontValue) {
                this.font = fontObj.url;
                break;
            }
        }
    }

    /**
     * Event that triggers when a signature has been drawn
     * @param data Uri Base64 drawn image
     */
    saveDrawSignature(): void {
        this.cargadorService.startLoading();
        this.findPixelsInImage(this.signaturePad.toDataURL('image/png'));
    }

    /**
     * Finds the leftmost and the rightmost pixels in the image that contain information about the drawn signature
     * @param uriImage Uri Base64 drawn image
     */
    findPixelsInImage(uriImage: string): void {
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            let leftmost = -1;
            let rightmost = -1;
            let uppermost = 10e10;
            let lowermost = -1;

            for (let x = 0; x < imageData.width; ++x) {
                for (let y = 0; y < imageData.height; ++y) {
                    const index = (y * imageData.width + x) * 4;

                    // If the alpha channel is greater than zero, then that pixel is not entirely transparent
                    if (leftmost === -1 && imageData.data[index + 3] > 0) {
                        leftmost = x;
                    }
                    if (imageData.data[index + 3] > 0) {
                        rightmost = x;
                        uppermost = Math.min(uppermost, y);
                        lowermost = Math.max(lowermost, y);
                    }
                }
            }
            if (leftmost === -1) {
                this.toast.warning('No se puede guardar una firma manuscrita vacía');
                this.cargadorService.stopLoading();
            } else {
                this.cropImage(uriImage, leftmost, rightmost, uppermost, lowermost);
            }
        };
        image.src = uriImage;
    }

    /**
     * Crops an image in such a way that it removes any transparent space to the left and to the right
     * @param uriImage Uri Base64 image
     * @param leftmost The x coordinate of the leftmost non-transparent pixel in the image
     * @param rightmost The x coordinate of the rightmost non-transparent pixel in the image
     * @param uppermost The y coordinate of the uppermost non-transparent pixel in the image
     * @param lowermost The y coordinate of the lowermost non-transparent pixel in the image
     */
    cropImage(uriImage: string, leftmost: number, rightmost: number, uppermost: number, lowermost: number): void {
        const buffer = Buffer.from(uriImage.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
        Jimp.read(buffer).then(image => {
            const padding = 20;
            image.crop(Math.max(leftmost - padding, 0),
                Math.max(uppermost - padding, 0),
                Math.min(rightmost + padding, image.bitmap.width - 1) - Math.max(leftmost - padding, 0),
                Math.min(lowermost + padding, image.bitmap.height - 1) - Math.max(uppermost - padding, 0));
            image.getBase64Async(Jimp.MIME_PNG).then((uri: string) => {
                this.capturedImage = uri;
                this.save('png');
            });
        });
    }

    /**
     * Cleans the signature pad panel
     */
    cleanSignaturePad(): void {
        this.signaturePad.clear();
    }

    /**
     * Event that triggers when an image signature has been uploaded
     */
    saveUploadSignature(): void {
        this.save(this.getExtension(this.fileNameUpload));
    }

    /**
     * Returns the extension of a file
     * @param name The file name
     */
    getExtension(name: string): string {
        const arr = name.split('.');
        return arr[arr.length - 1].toLowerCase();
    }

    /**
     * Event that triggers when a file is dropped or chosen
     * @param files Collection of entry files
     */
    dropped(files: NgxFileDropEntry[]) {
        const droppedFile = files[0];

        if (droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                const reader = new FileReader();
                const extension = this.getExtension(file.name);
                if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
                    reader.readAsDataURL(file);
                    this.fileNameUpload = file.name;
                    reader.onload = () => {
                        this.capturedImage = reader.result;
                        this.uploadImageAsset = reader.result;
                        this.uploadImage[0].setAttribute('style', 'background-image: url(' + this.uploadImageAsset + '); background-size: contain;');
                    };
                } else {
                    this.toast.error('Solo se aceptan imágenes PNG y JPG');
                }
            });
        }
    }

    /**
     * Saves a signature
     * @param tipo File extension
     */
    save(tipo: string) {
        const image = this.capturedImage.replace(/^data:image\/[a-z]+;base64,/, '');
        this.addSignatureSubscription = this.firmadorService.AdicionarGrafo(
            image, this.sessionService.username, tipo).subscribe((Respuesta: any) => {
                if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
                    this.saveEvent.emit(this.capturedImage);
                    this.capturedImage = '';
                    this.cleanSignaturePad();
                    this.uploadImage[0].setAttribute('style', 'background-image: url(' + this.uploadImageAsset2 + ');');
                } else if (Respuesta.status_code == 401) {
                    this.sessionService.logout();
                } else {
                    this.saveEvent.emit(null);
                    this.capturedImage = '';
                    this.cleanSignaturePad();
                    this.uploadImage[0].setAttribute('style', 'background-image: url(' + this.uploadImageAsset2 + ');');
                }
            }, (response: any) => {
                if (response.error && response.error.status_code === 401) {
                    this.sessionService.logout();
                } else {
                    this.saveEvent.emit(null);
                    this.capturedImage = '';
                    this.cleanSignaturePad();
                    this.uploadImage[0].setAttribute('style', 'background-image: url(' + this.uploadImageAsset2 + ');');
                }
            });
    }

    ngOnDestroy(): void {
        this.toast.clear();
        if (this.addSignatureSubscription) {
            this.addSignatureSubscription.unsubscribe();
        }
    }
}
