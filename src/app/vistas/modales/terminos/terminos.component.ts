import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, AfterViewInit, Input, HostListener } from '@angular/core';

@Component({
    selector: 'app-terminos',
    templateUrl: './terminos.component.html',
    styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit, AfterViewInit {

    @Input() template: string;


    containerRef: HTMLElement;
    enableButton = false;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.containerRef = document.getElementById('terms');
            document.getElementById("termino").innerHTML = this.template;
            this.containerRef.scrollTop = 0;
        });
    }

    @HostListener('scroll',['$event'])
    hasScrolledToBottom (e:any) {
        if (!this.containerRef) {
            return;
        }
        if (this.enableButton) {
            return;
        }
        if (Math.abs(this.containerRef.scrollHeight - (this.containerRef.scrollTop + this.containerRef.clientHeight)) <= 50) {
            this.enableButton = true;
        }
    }

    acceptTerms(): void {
        this.activeModal.close(true);
    }
}
