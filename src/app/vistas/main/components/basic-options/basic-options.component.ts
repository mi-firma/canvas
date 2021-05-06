import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { GatewayService } from 'src/app/servicios/gateway.service';
import { ParamsService } from 'src/app/servicios/params/params.service';

@Component({
  selector: 'app-basic-options',
  templateUrl: './basic-options.component.html',
  styleUrls: ['./basic-options.component.css']
})
export class BasicOptionsComponent implements OnInit {

  constructor(
    private toatsr: ToastrService,
    public gatewayService: GatewayService,
    private router: Router,
    public paramsService: ParamsService,
    private sessionService: SessionService
  ) { }

  checkReminderDays : boolean
  checkRemindeLastDay: boolean
  checkRepeatReminder: boolean
  checkReminderPeriodicity : boolean
  expDays: number = 0
  reminderDays : number = 0
  reminderPeridicity : string
  periodicitys = ['Diario','Semanal','Mensual']
  signatures=[{
    product:'Firma PKCS10',
    name:'Latin SAS',
    type:'Persona Juridica',
    generation:'16-07-2020',
    expiration:'16-07-2022',
    state: false,
    menuOpen: false
  }]
  lastIndexMenuOpen = -1
  choice: number;

  Options: any[] = [
    { label: 'Google Drive', value: 1, icon: 'google-logo', disabled: false },
    { label: 'Amazon', value: 2, icon: 'aws-logo', disabled: false },
    { label: 'MS Azure', value: 3, icon: 'azure-logo', disabled: false }
  ];

  url: string;
  urlDev: string;

  ngOnInit() {
    this.paramsService.paramsApi.subscribe((respuesta: any) => {
      this.url = respuesta.urlAPI;
      this.urlDev = respuesta.urlDev;
    });

    this.choice = 1;
  }

  menuOption(i: number, e: MouseEvent) {
    e.stopPropagation();
    if (this.lastIndexMenuOpen !== -1 && this.signatures[i] !== this.signatures[this.lastIndexMenuOpen]) {
        this.signatures[this.lastIndexMenuOpen].menuOpen = false;
    }
    this.signatures[i].menuOpen = !this.signatures[i].menuOpen;
    this.lastIndexMenuOpen = i;
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.lastIndexMenuOpen !== -1) {
      this.signatures[this.lastIndexMenuOpen].menuOpen = false;
    }

  }

  changeOption(code: number) {
    this.choice = code;
  }

  copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toatsr.success('Texto Copiado');
  }

  changeCheckReminderDays(){

  }

}
