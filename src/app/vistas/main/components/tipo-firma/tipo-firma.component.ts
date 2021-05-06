import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tipo-firma',
  templateUrl: './tipo-firma.component.html',
  styleUrls: ['./tipo-firma.component.css']
})
export class TipoFirmaComponent implements OnInit {

  constructor() { }


  options: any[] = [
    { name: 'Firma Electrónica', description:"¡Firma YA!, gestiona y envia tus documentos desde cualquier dispositivo.", icon: 'icon-FE', url: '/main/documentos', id: 'btnFirmaElectronica' ,hover:"Úsala para firmar de forma ágil y segura empleando métodos de autenticación e integridad que garantizan la validez jurídica de tus documentos.", disabled:false},
    { name: 'Firma Avanzada', description: "Valida tu identidad y firma de forma ágil y segura.", icon: 'icon-FD', url: '/main/tipo/firma', id: 'btnFirmaAvanzada' ,hover:"Úsala para procesos de firma más exigentes que involucren documentos públicos o con exigencias de entidades oficiales, garantiza el cumplimento de requisitos legales especiales.", disabled:true},
  ];

  ngOnInit() {
  }

}
