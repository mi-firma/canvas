import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-firmadorunico',
  templateUrl: './firmadorunico.component.html',
  styleUrls: ['./firmadorunico.component.css']
})
export class FirmadorUnicoComponent implements OnInit {
  @Input() firmantes: Array<any> = [];
  @Input() file: any;
  @ViewChild('formulario', { static: false }) formulario;
  newRow: any = { tipo: 'Enviar Copia' };

  constructor() {
  }

  ngOnInit() {
  }

  agregarCopia() {
    this.firmantes.push(this.newRow);
    this.newRow = { tipo: 'Enviar Copia' };
  }

  eliminarCopia(index) {
    this.firmantes.splice(index, 1);
  }

  validate() {
    this.formulario.nativeElement.reportValidity();

    return this.formulario.nativeElement.checkValidity();
  }
}
