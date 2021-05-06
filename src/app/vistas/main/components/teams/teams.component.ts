import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { RolesService } from 'src/app/servicios/roles.service';
import { CreateTeamComponent } from 'src/app/vistas/modales/create-team/create-team.component';
import { ListCompanyUsersComponent } from 'src/app/vistas/modales/list-company-users/list-company-users.component';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  constructor(
    private rolesServices: RolesService,
    private sessionService: SessionService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  teams = []
  lastIndexMenuOpen = -1
  companyId: string


  ngOnInit() {
    this.rolesServices.getIdCompanyByUser(this.sessionService.emailUser).subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
        this.companyId = Respuesta.data.companies[0].idCompany
        this.workGroups()
      } else if (Respuesta.status_code == 401) {
        this.sessionService.logout();
      } else if (Respuesta.status_code == 403) {
        this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
        this.router.navigateByUrl('main/menu')
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    }, (response: any) => {
      console.log(response)
      if (response.error && response.error.status_Code === 401) {
        this.sessionService.logout();
      } else if (response.error && response.error.status_code == 403) {
        this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
        this.router.navigateByUrl('main/menu')  
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  menuOptionTeams(i: number, e: MouseEvent) {
    e.stopPropagation();
    if (this.lastIndexMenuOpen !== -1 && this.teams[i] !== this.teams[this.lastIndexMenuOpen]) {
      this.teams[this.lastIndexMenuOpen].menuOpen = false;
    }
    this.teams[i].menuOpen = !this.teams[i].menuOpen;
    this.lastIndexMenuOpen = i;
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.lastIndexMenuOpen !== -1) {
      this.teams[this.lastIndexMenuOpen].menuOpen = false;
    }

  }

  workGroups() {
    this.lastIndexMenuOpen = -1;
    this.rolesServices.getWorkGroups(this.companyId).subscribe((respuesta: any) => {
      if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
        this.teams = respuesta.data
        for (const team of this.teams) {
          team.menuOpen = false;
        }
      } else if (respuesta.status_code == 401) {
        this.sessionService.logout();
      } else if (respuesta.status_code == 403) {
        this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
        this.router.navigateByUrl('main/menu')
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    }, (response: any) => {
      if (response.error && response.error.status_Code === 401) {
        this.sessionService.logout();
      } else if (response.error && response.error.status_code == 403) {
        this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
        this.router.navigateByUrl('main/menu')
      } else {
        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
    });
  }

  createTeam() {
    const modalRef = this.modalService.open(CreateTeamComponent, { centered: true });
    modalRef.result.then((name) => {
      if (name) {
        this.rolesServices.addWorkGroup(+this.companyId, name).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.toastr.success('Equipo creado correctamente')
            this.workGroups()
          } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
          } else if (Respuesta.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        }, (response: any) => {
          if (response.error && response.error.status_Code === 401) {
            this.sessionService.logout();
          } else if (response.error && response.error.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      }
    });
  }

  inviteUser(groupId: number) {
    const modalRef = this.modalService.open(ListCompanyUsersComponent, { centered: true ,size:'lg'});
    modalRef.componentInstance.idCompany = +this.companyId
    modalRef.componentInstance.idWorkGroup = groupId
  }

  editTeam(id: number) {
    const modalRef = this.modalService.open(CreateTeamComponent, { centered: true });
    modalRef.componentInstance.update = true;
    modalRef.result.then((name) => {
      if (name) {
        this.rolesServices.editWorkGroup(id, name, +this.companyId).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            this.toastr.success('Equipo actualizado correctamente')
            this.workGroups()
          } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
          } else if (Respuesta.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        }, (response: any) => {
          if (response.error && response.error.status_Code === 401) {
            this.sessionService.logout();
          } else if (response.error && response.error.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      }
    });

  }

  openTeam(idGroup: string, name: string) {
    this.router.navigateByUrl('main/equipo/' + name + '/' + this.companyId + '/' + idGroup)
  }

  goBack(){
    this.router.navigateByUrl('main/configuracion')
  }

  deleteTeam(id: number) {
    const modalRef = this.modalService.open(MensajesComponent, { centered: true });
    modalRef.componentInstance.tittle = 'Eliminar Equipo';
    modalRef.componentInstance.message = '¿Está seguro que desea eliminar este equipo?';
    modalRef.result.then((result) => {
      if (result) {
        this.rolesServices.deleteWorkGroup(+this.companyId, id).subscribe((Respuesta: any) => {
          if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
            if(Respuesta.message == 'No se a encontrado la entidad a borrar o a ocurrido un fallo al intentar borrar'){
              this.toastr.error('No se puede eliminar un equipo que contenga usuarios.')
            }else{
              this.toastr.success('Equipo eliminado')
              this.workGroups()
            }
          } else if (Respuesta.status_code == 401) {
            this.sessionService.logout();
          } else if (Respuesta.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        }, (response: any) => {
          if (response.error && response.error.status_Code === 401) {
            this.sessionService.logout();
          } else if (response.error && response.error.status_code == 403) {
            this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
            this.router.navigateByUrl('main/menu')
          } else {
            this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          }
        });
      }
    }, (error: any) => { });
  }

}
