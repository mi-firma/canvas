import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { RolesService } from 'src/app/servicios/roles.service';

@Component({
  selector: 'app-list-company-users',
  templateUrl: './list-company-users.component.html',
  styleUrls: ['./list-company-users.component.css']
})
export class ListCompanyUsersComponent implements OnInit {

  @Input() idCompany:number
  @Input() idWorkGroup:number
  users: Array<any> = [];
  @ViewChild('formulario', { static: false }) formulario;
  newRow: any = {};
  userId: string = '';
  statusRaiz: boolean = false;
  signersForm: FormGroup;

  constructor(
    private rolesService: RolesService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    this.signersForm = this.formBuilder.group({
      signersArray: this.formBuilder.array([])
    });
  }

  signersItems: {
    nombre: string;
    correo: string;
    cedula: string;
    tipo: string;
  }[];

  ngOnInit() {
    this.agregarCopia()
    this.signersItems = [];
  }

  agregarCopia() {
    this.users.push(this.newRow);
    this.newRow = {};
  }

  eliminarCopia(index) {
    if (this.users.length > 1) {
      this.users.splice(index, 1);
    }
  }

  validate() {
    this.formulario.nativeElement.reportValidity();
    const valid = this.formulario.nativeElement.checkValidity();
    if(valid){
      this.rolesService.inviteUsers(this.sessionService.username,this.idWorkGroup,this.idCompany,this.users).subscribe((respuesta:any)=>{
        if (respuesta.status_code == 200 || respuesta.status_code == 204 || respuesta.status_code == 201) {
          this.toastr.success('Invitaciones enviadas')
          this.activeModal.close()
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
        } else if (response.error && response.status_code == 403) {
          this.toastr.error('Este usuario no tiene los permisos para acceder a esta funcionalidad')
          this.router.navigateByUrl('main/menu')
        } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
          this.activeModal.close()
        }
      });
    }
  }

  close() {
    this.activeModal.close()
  }

}
