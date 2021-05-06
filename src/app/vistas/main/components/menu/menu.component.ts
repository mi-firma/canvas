import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/servicios';
import { FirmadorService } from 'src/app/servicios/firmador.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import EnjoyHint from 'xbs-enjoyhint/src/enjoyhint';
import { RolesService } from 'src/app/servicios/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewInit {
  userName: string;

  mainOptions: any[] = [
    { name: 'Firmar un Documento', icon: 'icon-signature-doc', url: '/main/documentos', showSignatures: true, id: 'btnFirmarDocumento', disabled: false },
    { name: 'Mi Carpeta Personal', icon: 'icon-my-folder', url: '/main/repositorio', id: 'btnCarpetaPersonal', disabled: false },
    { name: 'Personalizar Firma', icon: 'icon-edit-signature', url: '/main/miFirma', id: 'btnPersonalizarFirma', disabled: false },
    { name: 'Administración de plantillas', icon: 'icon-create-template', url: '/main/plantillas', id: 'btnCrearPlantillas', disabled: false },
    //{ name: 'Recargar Mi Cuenta', icon: 'icon-buy-signatures', url: '/main/plan', id: 'btnRecargarCuenta', disabled: false },
  ];

  otherOptions: any[] = [
    { name: 'Comprar un plan', icon: 'icon-buy-signatures', url: '/main/menu' },
    //{ name: 'Generar una plantilla', icon: 'icon-create-template', url: '/main/plantillas' },
    { name: 'Comprar una plantilla', icon: 'icon-buy-template', url: '/main/menu' },
    { name: '¿Necesitas algo? o no lo encuentras', icon: 'icon-ask', url: '/main/menu' },
    { name: 'Ver más', icon: 'icon-more', url: '/main/menu' },
  ];

  availableSignatures: number;

  enjoyHint: EnjoyHint;

  isTourRunning: boolean;

  constructor(
    public sessionService: SessionService,
    public firmadorSerivce: FirmadorService,
    private router: Router,
    private rolesService: RolesService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.sessionService.IsFirstSession(localStorage.getItem('correo')).subscribe(((response: any) => {
      if (response.status === 'OK' && response.status_code === 200) {
        if (response.data.isFirstSession) {
          this.enjoyHint = new EnjoyHint({
            onStart: () => {
              this.isTourRunning = true;
            },
            onSkip: () => {
              this.isTourRunning = false;
            },
            onEnd: () => {
              this.isTourRunning = false;
            }
          });
          const rest = {
            showPrev: false,
            skipButton: { className: 'omitir-btn', text: 'Omitir' },
            nextButton: { className: 'next-btn', text: ' ' },
          };
          const steps = [
            { 'next #btnFirmarDocumento': 'Firmar Un Documento: \nAquí puedes firmar tus documentos en formato PDF y con validez jurídica.', ...rest },
            { 'next #btnCarpetaPersonal': 'Mi Carpeta Personal: Aquí encontrarás todos los documentos gestionados y firmados en la plataforma.', ...rest },
            { 'next #btnPersonalizarFirma': 'Personalizar Mi Firma: Escribe, dibuja o carga la representación visual del grafo de tu firma.', ...rest },
            { 'next #btnCrearPlantillas': 'Generar una Plantilla: Aqui puedes crear y administrar plantillas a tu gusto.', ...rest },
            //{ "next #btnRecargarCuenta": "Comprar Un Plan: Saca el mejor provecho de la plataforma, adquiriendo el plan que mejor se ajuste a tus necesidades.", ...rest },
          ];
          this.enjoyHint.set(steps);
          this.enjoyHint.run();
        }
      }
    }));
  }

  ngOnInit() {
    this.userName = this.sessionService.username;
    if (localStorage.getItem('firma') !== null) {
      const url = encodeURIComponent(localStorage.getItem('firma'));
      this.router.navigateByUrl('/otros-firmantes/' + url);
      localStorage.removeItem('firma');
    }

    const helper = new JwtHelperService();

    if (localStorage.getItem('token') == null) {
      this.sessionService.logout();
    } else {
      const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
      if (isExpired) {
        this.sessionService.logout();
      }
    }

    if (localStorage.getItem('idWorkGroup') !== null && localStorage.getItem('idCompany') !== null && localStorage.getItem('token') !== null) {
      const idWorkGroup = localStorage.getItem('idWorkGroup');
      const idCompany = localStorage.getItem('idCompany');
      this.rolesService.addRoleToUser(+this.sessionService.userId, 13).subscribe((res1: any) => {
        if (res1.status_code == 200 || res1.status_code == 204 || res1.status_code == 201) {
          const idHasRole = res1.data.idCustomerHasRole;
          this.rolesService.addUserToCompany(idHasRole, +idCompany).subscribe((res2: any) => {
            if (res2.status_code == 200 || res2.status_code == 204 || res2.status_code == 201) {
              this.rolesService.addUserToWorkGroup(+this.sessionService.userId, +idWorkGroup).subscribe((respuesta: any) => {
                if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
                  if (respuesta.message != 'El ususario ya se encuentra agregado al grupo de trabajo.') {
                    this.toastr.success('Usuario agregado a un equipo')
                    localStorage.removeItem('idWorkGroup');
                    localStorage.removeItem('idCompany')
                  } else {
                    this.toastr.info('Este usuario ya hace parte del equipo.')
                    localStorage.removeItem('idWorkGroup');
                    localStorage.removeItem('idCompany')
                  }
                } else if (respuesta.status_code == 401) {
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
            } else if (res2.status_code == 401) {
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
        } else if (res1.status_code == 401) {
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
  }

  goTo(url: string): void {
    if (this.isTourRunning) {
      return;
    }
    this.router.navigateByUrl(url);
  }
}
