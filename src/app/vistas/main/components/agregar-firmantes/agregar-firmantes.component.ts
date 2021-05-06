import { Component, OnInit, ViewChild } from '@angular/core';
import { FiledataService } from 'src/app/servicios/filedata.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICertificate } from 'src/app/interfaces';
import { SessionService } from 'src/app/servicios';
import { FirmadorService } from 'src/app/servicios/firmador.service';

@Component({
    selector: 'app-agregar-firmantes',
    templateUrl: './agregar-firmantes.component.html',
    styleUrls: ['./agregar-firmantes.component.css']
})
export class AgregarFirmantesComponent implements OnInit {
    isThirdParty = localStorage.getItem('isThirdParty') == 'true';
    thirdPartyColor = localStorage.getItem('thirdPartyColor');
    signerOptions: any[] = [
        { label: 'Solo yo', value: 1, icon: 'person' , disabled: false },
        { label: 'Otros y yo', value: 2, icon: 'friends', disabled: false },
        { label: 'Otros', value: 3, icon: 'group', disabled: false }
    ];

    @ViewChild('formularioUnico', { static: false }) formulario;
    @ViewChild('formularioLargo', { static: false }) formularioLargo;

    isSimple: boolean;
    choice: number;

    _firmantes: Array<any> = [];

    activeCertificate: ICertificate;

    certificados: Array<any>;
    certificadosCarrusel: Array<Array<any>> = [];

    constructor(
        private fdService: FiledataService,
        private firmadorService: FirmadorService,
        private sessionService: SessionService,
        private toastr: ToastrService,
        private router: Router,
    ) {
        this.isSimple = true;
        this.choice = 1;
    }

    ngOnInit() { }

    /**
     * Update chooseCertificado variable with
     * certificaetsSlider emmited value.
     */
    updateCertificate(newValue: ICertificate) {
        this.activeCertificate = newValue;
    }

    // code es 1 para unicos firmantes, 2 para otros firmantes y yo, y 3 para otros firmantes
    cambiarFirmante(code: number) {
        // se utiliza para limpiar el arreglo en caso de haber hecho otra seleccion
        if (this.choice !== code) {
            this._firmantes.splice(0, this._firmantes.length);
            if (code !== 1) {
                this._firmantes.push({});
            }
        }
        this.choice = code;
        this.isSimple = code === 1;
    }

    private getUserData(firmantes: Array<any>) {
        const user: any = {};
        user.nombre = this.sessionService.username;
        user.correo = this.sessionService.emailUser;
        user.cedula = this.sessionService.documentUser;
        user.tipo = 'Yo';

        firmantes.unshift(user);
    }

    async continuar(pdftron?: boolean) {
        const firmantes: Array<any> = []; // Este arreglo es el que se manda a las otras vistas
        // Se hace asi para evitar un efecto visual no deseado

        if (this.choice === 1 && this.formulario.validate()) {
            // const canSign = await this.hasSignaturesAvailable();

            // if (!canSign) {
            //     return;
            // }

            // Deep copy
            for (let i = 0; i < this._firmantes.length; ++i) {
                firmantes.push(this._firmantes[i]);
            }

            this.getUserData(firmantes);
            this.fdService.addFirmantes(firmantes);
            //this.fdService.addCertificado(this.activeCertificate);
            if (pdftron) {
                this.router.navigateByUrl('main/firmador-pdftron');
            } else {
                this.router.navigateByUrl('main/firmador');
            }
        } else if ((this.choice === 2 || this.choice === 3) && this.formularioLargo.validate()) {
            const tempCorreo = new Set();
            for (let i = 0; i < this.formularioLargo.firmantes.length; ++i) {
                // if(tempCorreo.has(this.formularioLargo.firmantes[i].correo.trim().toUpperCase())){
                //     this.toastr.warning("Todos los correos debes ser distintos");
                //     return;
                // }
                tempCorreo.add(this.formularioLargo.firmantes[i].correo.trim().toUpperCase())
                this.formularioLargo.firmantes[i].correo.trim();
                if (this.formularioLargo.firmantes[i].correo.toLowerCase() == this.sessionService.emailUser.toLowerCase()) {
                    if (this.choice === 2) {
                        this.toastr.warning('Usted ya es firmante del documento, por favor elimínese de la lista');

                    } else {
                        this.toastr.warning('Para ser parte de la firma del documento debe hacer uso de la opción otros y yo');
                    }
                    return;
                }
                firmantes.push(this.formularioLargo.firmantes[i]);
            }

            if (this.choice === 2) {
                // const canSign = await this.hasSignaturesAvailable();

                // if (!canSign) {
                //     return;
                // }

                this.getUserData(firmantes);
            }

            this.fdService.addFirmantes(firmantes);
            //this.fdService.addCertificado(this.activeCertificate);
            if (pdftron) {
                this.router.navigateByUrl('main/firmador-pdftron');
            } else {
                this.router.navigateByUrl('main/firmador');
            }
        }
    }

    async hasSignaturesAvailable(): Promise<boolean> {
        return new Promise(resolve => {
            this.firmadorService.ObtenerFirmasDisponibles(this.sessionService.documentUser).subscribe((Response: any) => {
                if (Response.success) {
                    if (Response.data.consumoFirmaCantidadRestante > 0) {
                        resolve(true);
                    } else {
                        this.toastr.warning('No tienes firmas disponibles!');
                        this.router.navigateByUrl('main/plan');
                        resolve(false);
                    }
                } else {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                    resolve(false);
                }
            }, (error: any) => {
                this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                resolve(false);
            });
        });
    }

    /**
     * Update isSimple variable to boolean opposite
     */
    updateSelectedValue(): void {
        this.isSimple = !this.isSimple;
    }

    /**
     * Update choice variable by new value.
     * @param value => Option value
     */
    selectSignerOption(value: number): void {
        this.choice = value;
    }
}
