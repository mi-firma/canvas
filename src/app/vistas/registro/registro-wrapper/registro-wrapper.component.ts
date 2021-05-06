import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-registro-wrapper',
    templateUrl: './registro-wrapper.component.html',
    styleUrls: ['./registro-wrapper.component.css']
})
export class RegistroWrapperComponent implements OnInit {
    constructor() { }

    ngOnInit() {
    }

    /**
     * Funntion to scrollTop in lazy components that have
     * different height and execute with router-outlet
     * load another component.
     */
    onActivate(): void {
        window.scroll(0, 0);
    }
}
