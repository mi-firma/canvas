import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FiledataService } from 'src/app/servicios/filedata.service';

@Component({
    selector: 'app-firmadorlargo',
    templateUrl: './firmadorlargo.component.html',
    styleUrls: ['./firmadorlargo.component.css']
})
export class FirmadorLargoComponent implements OnInit {
    @Input() firmantes: Array<any> = [];
    @Input() file: any;
    @ViewChild('formulario', { static: false }) formulario;
    newRow: any = {};

    tipos: Array<any> = [
        { value: 'Firmar como Representante legal' },
        { value: 'Firmar como Persona Natural' },
        { value: 'Enviar Copia' }
    ];

    testForm: FormGroup = new FormGroup({
        nombre: new FormControl(null, Validators.required)
    });

    signersForm: FormGroup;

    inOrder: boolean = false;

    signersItems: {
        nombre: string;
        correo: string;
        cedula: string;
        tipo: string;
    }[];

    constructor(
        private dragulaService: DragulaService,
        private formBuilder: FormBuilder,
        private fsService: FiledataService
    ) {
        this.signersForm = this.formBuilder.group({
            signersArray: this.formBuilder.array([])
        });

        this.dragulaService.dropModel("ordFirmantes").subscribe(args => {

        });
    }

    ngOnInit() {
        this.signersItems = [];

        this.dragulaService.createGroup("ordFirmantes", {
            // ...
        });
    }

    agregarCopia() {
        this.firmantes.push(this.newRow);
        this.newRow = {};
    }

    eliminarCopia(index) {
        if (this.firmantes.length > 1) {
            this.firmantes.splice(index, 1);
        }
    }

    validate() {
        this.formulario.nativeElement.reportValidity();
        this.fsService.signInOrder(this.inOrder);
        return this.formulario.nativeElement.checkValidity();
    }

    ngOnDestroy() {
        this.dragulaService.destroy("ordFirmantes");
        this.dragulaService.removeModel("ordFirmantes");
        this.dragulaService.out("ordFirmantes");
    }
}
