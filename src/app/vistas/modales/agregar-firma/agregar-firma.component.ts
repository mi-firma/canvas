import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-agregar-firma',
    templateUrl: './agregar-firma.component.html'
})
export class AgregarFirmaComponent implements OnInit {
    // Emits a value when a signature is correctly configured
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() { }

    /**
     * Event that triggers when a signature is saved
     */
    onSave(image: string): void {
        this.passEntry.emit(image);
        this.activeModal.close(image);
    }

    /**
     * Returns the width of the signature pad
     */
    getSignaturePadWidth(): number {
        const windowWidth = window.innerWidth;

        if (windowWidth > 991) {
            return 800 - 24 * 2 - 10 * 2;
        }

        if (windowWidth > 576) {
            return 500 - 24 * 2 - 10 * 2;
        }

        return windowWidth - 8 * 2 - 10 * 2 - 24 * 2;
    }

    /**
     * Closes the modal window
     */
    close(): void {
        this.activeModal.close();
    }
}
