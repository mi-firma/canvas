import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FiledataService } from 'src/app/servicios/filedata.service';

@Injectable({
    providedIn: 'root'
})
export class RegistroInitGuard implements CanActivate {
    constructor(
        private fdService: FiledataService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(resolve => {
            this.fdService.registroIniListener$.subscribe((data: any) => {
                if (data.length === 0) {
                    this.router.navigate(['registro']);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
}
