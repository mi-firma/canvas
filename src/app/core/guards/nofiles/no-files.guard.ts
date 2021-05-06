import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FiledataService } from 'src/app/servicios/filedata.service';

@Injectable({
    providedIn: 'root'
})
export class NoFilesGuard implements CanActivate {
    constructor(
        private fdService: FiledataService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(resolve => {
            this.fdService.filesListener$.subscribe(files => {
                if (files.length === 0) {
                    this.router.navigate(['main/documentos']);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
}
