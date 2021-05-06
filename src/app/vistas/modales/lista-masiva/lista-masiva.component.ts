import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FiledataService } from 'src/app/servicios/filedata.service';

@Component({
  selector: 'app-lista-masiva',
  templateUrl: './lista-masiva.component.html',
  styleUrls: ['./lista-masiva.component.css']
})
export class ListaMasivaComponent implements OnInit {

  @Input() dataLista;
  @Input() dataFile;

  listSignature = [];

  constructor(
    private fdService: FiledataService,
    private router: Router,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
  }

  confirm() {
    this.fdService.signMasiv(this.dataLista);
    this.router.navigateByUrl('main/firmador-pdftron');
    this.activeModal.close();
  }

  removeSign(rowData) {
    const index = this.dataLista.indexOf(rowData);
    this.dataLista.splice(index, 1);
  }

  dismissList(): void {
    this.activeModal.close();
  }

}
