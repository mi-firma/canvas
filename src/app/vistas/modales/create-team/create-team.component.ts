import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {

  @Input() update: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) { }

  nameArea: string = '';

  ngOnInit() {
  }


  close() {
    this.activeModal.close();
  }

  myFunction(e) {
    var key = e.keyCode || e.which;
    if (key == 111 || key == 191) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }
    if (e.shiftKey && (key == 55 || key == 56 || key == 51 || key == 53 || key == 57)) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

  }
  create() {
    if (this.nameArea == '') {
      this.toastr.error('El nombre de la carpeta no puede ser vacio')
      return
    }
    this.activeModal.close(this.nameArea);
  }

}


