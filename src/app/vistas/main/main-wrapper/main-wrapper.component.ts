import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-wrapper',
    templateUrl: './main-wrapper.component.html',
    styleUrls: ['./main-wrapper.component.css']
})
export class MainWrapperComponent implements OnInit {
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
