import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  configurationOptions: any[] = [
    { name: 'Opciones básicas', icon: 'opciones', url: '/main/configurar/usuarios' },
    { name: 'Facturación', icon: 'facturacion', url: '/main/configurar/usuarios' },
    { name: "API'S", icon: 'icon-api', url: '/main/api' },
    { name: 'Equipos de trabajo', icon: 'Usuarios', url: '/main/equipos' },
    { name: 'Personalizar Mi Firma', icon: 'browser', url: '/main/miFirma' },
    { name: "Personalizar correos", icon: 'personalizar', url: '/main/customMailTemplate' },
    { name: "Auditoría", icon: 'auditoria', url: '/main/configurar/usuarios' },
    { name: "Reportes", icon: 'reportes', url: '/main/configurar/usuarios' },
  ];

  isGrid: boolean = true;

  constructor() { }

  ngOnInit() {
  }
}
