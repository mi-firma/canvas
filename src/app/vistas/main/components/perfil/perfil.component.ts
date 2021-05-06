import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AdministracionService } from 'src/app/servicios/administracion.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  tipoDocumentos: Array<string> = ['Cédula de ciudadania', 'Cédula de extranjeria', 'Pasaporte'];
  departamentos: Array<string> = ['Cundinamarca', 'Valle del cauca', 'Antioquia'];
  ciudades: Array<string> = ['Bogota', 'Cali', 'Medellin'];
  cedula: string;
  user: string;

  Usuario = new FormGroup({
    Direccion: new FormControl({ value: '', disabled: true }),
    Celular: new FormControl({ value: '', disabled: true }),
    Correo: new FormControl({ value: '', disabled: true }),
    Departamento: new FormControl({ value: '', disabled: true }),
    Ciudad: new FormControl({ value: '', disabled: true })
  });

  constructor(
    public administracionService: AdministracionService,
    public sessionService: SessionService,
    public toastr: ToastrService,
    public router: Router
  ) { }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.cedula = this.sessionService.documentUser;
    this.user = this.sessionService.username;
    this.Usuario.get('Celular').setValue(this.sessionService.phoneUser2);
    this.Usuario.get('Correo').setValue(this.sessionService.emailUser);
  }

  ngOnDestroy(): void {
    this.toastr.clear();
  }
}
