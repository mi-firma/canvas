import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reject-sign',
  templateUrl: './reject-sign.component.html',
  styleUrls: ['./reject-sign.component.css']
})
export class RejectSignComponent implements OnInit {

  formRechazo = new FormGroup({
    comentario: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)])
  })

  get Comentario() {
    return this.formRechazo.get('comentario');
  }

  constructor(
    private modalService: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  Confirmar() {

    if (this.formRechazo.invalid) {
      this.showInputError();
      return;
    }

    this.modalService.close({
      success: true,
      comment: this.Comentario.value
    });
  }

  Cancelar() {
    this.modalService.close({
      success: false
    });
  }

  /**
   * Finds the first form control which has an error
   */
   showInputError(): void {
    for (const field in this.formRechazo.controls) {
      const control = this.formRechazo.get(field);
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }

}
