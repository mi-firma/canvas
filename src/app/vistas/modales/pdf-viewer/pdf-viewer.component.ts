import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html'
})
export class AppPdfViewerComponent {

  @Input() pdfsrc;
  @Input() name;

  page = 1;
  totalPages: number;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  closePDF() {
    this.activeModal.close();
  }

  downloadPdf() {
    const linkSource = this.pdfsrc;
    const downloadLink = document.createElement('a');
    const name = this.name;
    downloadLink.href = linkSource;
    downloadLink.download = name;
    downloadLink.click();
  }
}
