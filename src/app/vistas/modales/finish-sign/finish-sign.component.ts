import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/servicios';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-finish-sign',
  templateUrl: './finish-sign.component.html',
  styleUrls: ['./finish-sign.component.css']
})
export class FinishSignComponent implements OnInit {
  isThirdParty = localStorage.getItem('isThirdParty') == 'true';
  thirdPartyColor = localStorage.getItem('thirdPartyColor');
  thirdPartyExpiration = localStorage.getItem('thirdPartyExpiration') == 'true';
  thirdPartyAutoReminders = localStorage.getItem('thirdPartyAutoReminders') == 'true';
  thirdPartyConfirmTitle = localStorage.getItem('thirdPartyConfirmTitle');
  
  @ViewChild('chipList', { static: false }) chipList;

  constructor(
    private activeModal : NgbActiveModal,
    private toastr : ToastrService,
    private documentosService: DocumentosService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  affair:string = ''
  emailBody:string = ''
  expDays:number = 0
  reminderDays:number = 0
  checkReminderDays:boolean = false;

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
    if (+this.expDays === 0 || this.expDays.toString() === '') {
      this.toastr.error('El campo de días de expiración tiene que ser mayor a 0 días.');
      return
    }

    if (this.checkReminderDays === true && (this.reminderDays === 0 || this.reminderDays > +this.expDays) || this.reminderDays.toString() === '') {
      this.toastr.error(`El campo de recordatorios automáticos tiene que ser mayor a 0 y menor o igual a ${this.expDays} días.`);
      return
    }

    if(this.emails.length > 0){
      if(+this.expDays == 0 || this.affair == '' || this.emailBody == ''){
        this.toastr.error('Complete todos los campos diferentes al campo de correos.');
        return
      }
    }

    const data = {
      expDays:this.expDays,
      affair:this.affair,
      emailBody:this.emailBody,
      emails:this.emails,
      reminderDays:+this.reminderDays,
    }
    this.activeModal.close(data)
  }

  close(){
    this.activeModal.close()
  }

  changeCheckReminderDays() {
    if ( !this.checkReminderDays ) {
      this.reminderDays = 0;
    }
  }

}
