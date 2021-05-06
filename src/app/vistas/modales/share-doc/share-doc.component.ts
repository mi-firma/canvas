import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { SessionService } from 'src/app/servicios';
import { Router } from '@angular/router';


@Component({
  selector: 'app-share-doc',
  templateUrl: './share-doc.component.html',
  styleUrls: ['./share-doc.component.css']
})
export class ShareDocComponent implements OnInit {

  @ViewChild('chipList', { static: false }) chipList;

  @Input() serialDoc :string

  constructor(
    private activeModal : NgbActiveModal,
    private toastr : ToastrService,
    private documentosService: DocumentosService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Array<string> = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if(!this.validateEmail(value.trim()) && value != ''){
      this.chipList.errorState = true;
      return
    }
    if ((value || '').trim()) {
      this.chipList.errorState = false;
      this.emails.push(value.trim());
    }

    if (input) {
      this.chipList.errorState = false;
      input.value = '';
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  validateEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }

  enviar(){
    if(this.emails.length <1){
      this.toastr.error('Debe agregar al menos un correo')
      return
    }
    this.documentosService.shareDocument(this.serialDoc, this.sessionService.username,this.emails).subscribe((Respuesta: any) => {
      if (Respuesta.status_code == 200 || Respuesta.status_code == 204 || Respuesta.status_code == 201) {
          this.toastr.success('Documento compartido correctamente')
          this.activeModal.close()
      } else if (Respuesta.status_code == 401) {
          this.sessionService.logout();
      } else {
          this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
      }
  });
    
    
  }

  close(){
    this.activeModal.close()
  }


}
