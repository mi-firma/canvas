import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  @Input() update: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) { }

  nameFolder: string = '';

  ngOnInit() {
  }


  close() {
    this.activeModal.close();
  }

  myFunction(e) {
    var key = e.keyCode || e.which;
    if (key == 111 || key == 191 || key == 192) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }
    if (e.shiftKey && (key == 55 || key == 56 || key == 51 || key == 53 || key == 57 || key == 48 || key == 219 || key == 221)) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

  }
    create(){
      if (this.nameFolder == '') {
        this.toastr.error('El nombre de la carpeta no puede ser vacio')
        return
      }
      this.activeModal.close(this.nameFolder);
    }

  }
