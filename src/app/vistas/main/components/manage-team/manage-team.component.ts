import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { RolesService } from 'src/app/servicios/roles.service';
import { ListCompanyUsersComponent } from 'src/app/vistas/modales/list-company-users/list-company-users.component';
import { MensajesComponent } from 'src/app/vistas/modales/mensajes/mensajes.component';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})
export class ManageTeamComponent implements OnInit {

  constructor(
    private rolesServices: RolesService,
    private sessionService: SessionService,
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  users = []
  lastIndexMenuOpen = -1
  wordSearch = ''
  idWorkGroup: string;
  companyId: string;
  groupName: string;
  roles = [
    { id: 8, name: 'Usuario' },
    { id: 6, name: 'Administrador' },
    { id: 7, name: 'Manager' }
  ]

  ngOnInit() {
    this.idWorkGroup = this.activatedRoute.snapshot.paramMap.get('id');
    this.companyId = this.activatedRoute.snapshot.paramMap.get('idC');
    this.groupName = this.activatedRoute.snapshot.paramMap.get('name');
    this.searchUsers()
  }

  menuOptionTeams(i: number, e: MouseEvent) {
    e.stopPropagation();
    if (this.lastIndexMenuOpen !== -1 && this.users[i] !== this.users[this.lastIndexMenuOpen]) {
      this.users[this.lastIndexMenuOpen].menuOpen = false;
    }
    this.users[i].menuOpen = !this.users[i].menuOpen;
    this.lastIndexMenuOpen = i;
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.lastIndexMenuOpen !== -1) {
      this.users[this.lastIndexMenuOpen].menuOpen = false;
    }

  }

  searchUsers() {
    this.lastIndexMenuOpen = -1;
    this.rolesServices.getUsersByWorkGroup(this.idWorkGroup, this.wordSearch).subscribe((respuesta: any) => {
      if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
        this.users = respuesta.data
        if (respuesta.data != null && respuesta.data.length > 0) {
          for (const user of this.users) {
            user.menuOpen = false;
            user.updateRole = false;
            for (const rol of this.roles) {
              if (user.role.idRole == rol.id) {
                user.rol = rol.name
              }
            }
          }
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

  searchAllUser() {
    this.wordSearch = ''
    this.lastIndexMenuOpen = -1;
    this.searchUsers()
  }

  changeUserRol(idUser: number, role: string) {
    let idRole = 0;
    for (const rol of this.roles) {
      if (role == rol.name) {
        idRole = rol.id
      }
    }
    this.rolesServices.changeRoleToUser(idUser, idRole, +this.idWorkGroup).subscribe((respuesta: any) => {
      if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
        this.toastr.success('Rol cambiado correctamente')
        this.searchAllUser()
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

  changeRole(i: number, role: string) {
    this.users[i].updateRole = true;
    this.users[i].rol = role;
  }

  inviteUser() {
    const modalRef = this.modalService.open(ListCompanyUsersComponent, { centered: true });
    modalRef.componentInstance.idCompany = +this.companyId
    modalRef.componentInstance.idWorkGroup = +this.idWorkGroup
  }

  goBack() {
    this.router.navigateByUrl('main/equipos')
  }

  deleteUser(idUser: number,role:string) {
    const modalRef = this.modalService.open(MensajesComponent, { centered: true });
    modalRef.componentInstance.tittle = 'Eliminar Usuario';
    modalRef.componentInstance.message = '¿Está seguro que desea eliminar este usuario?';
    modalRef.result.then((result) => {
      if (result) {
        let idRole = 0;
        for (const rol of this.roles) {
          if (role == rol.name) {
            idRole = rol.id
          }
        }
        this.rolesServices.deleteUserByWorkGroup(idUser,idRole,+this.idWorkGroup).subscribe((respuesta: any) => {
          if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
            this.toastr.success('Usuario eliminado correctamente')
            this.searchAllUser();
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
    }, (error: any) => { });
  }

}