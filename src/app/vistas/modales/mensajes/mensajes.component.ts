import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  @Input() tittle: string;
  @Input() message: string;
  @Input() information: string;

  constructor(
    private modalService: NgbActiveModal) { }

  ngOnInit() {
  }

  Confirmar() {
    this.modalService.close(true);
  }

  Cancelar() {
    this.modalService.close(false);
  }
}
