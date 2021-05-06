import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    public anim: Object;
    constructor(
        private router: Router
    ) { 
        this.anim = {
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/anim_mantenimiento.json',
          };
    }

    ngOnInit() {
    }

    regresar(){
        const token = localStorage.getItem("token");
        if(token == null){
            this.router.navigateByUrl("")
        }else{
            this.router.navigateByUrl("main/menu")
        }
    }
}
