import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionTokenModel } from '../../modelos/login.model';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/servicios';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class AppNavComponent implements OnInit, OnDestroy {
    isThirdParty = localStorage.getItem('isThirdParty') == 'true';
    thirdPartyLogoUrl = localStorage.getItem('thirdPartyLogoUrl');
    // Container wrapped around the notifications button
    @ViewChild('notifications', { static: false }) notificationsContainer: ElementRef;

    // Container wrapped around the notifications button in mobile
    @ViewChild('notificationsMobile', { static: false }) notificationsMobileContainer: ElementRef;

    // Container wrapped around the profile menu buttons
    @ViewChild('userMenu', { static: false }) menuContainer: ElementRef;

    // User menu options
    userMenuOptions: any[] = [
        { name: 'Perfil', icon: 'profile', url: 'perfil' , disabled: false},
        //{ name: 'Certificados', icon: 'medal', url: 'certificados' , disabled: true},
        //{ name: 'Recargas y facturación', icon: 'wallet', url: 'recargas-facturacion' , disabled: true},
        { name: 'Configuración', icon: 'settings', url: 'configuracion' , disabled: false },
        { name: 'Términos y Condiciones', icon: 'tyc', url: 'terminos/terminos-condiciones', disabled: false },
        { name: 'Política de privacidad', icon: 'tratamiento-datos', url: 'terminos/tratamiento-datos', disabled: false }
    ];

    // Main menu options
    appMenuItems: any[] = [
        { name: 'Firmar', icon: 'icon-firmar', url: '/main/documentos' , disabled: false },
        { name: 'Mi Carpeta Personal', icon: 'icon-historial', url: '/main/repositorio' , disabled: false},
        { name: 'Personalizar Firma', icon: 'icon-grafos', url: '/main/miFirma' , disabled: false },
        { name: 'Administración plantillas', icon: 'icon-plantillas', url: '/main/plantillas' , disabled: false },
        //{ name: 'Recargar firmas', icon: 'icon-recargar', url: '/main/plan' , disabled: true},
    ];

    // More options
    mainMenu = 'menu';

    // Whether or not the main menu is showing
    showAppMenu = false;

    // Whether or not the notifications panel is showing
    notificationsAreShowing = false;

    // Whether or not the profile menu is showing
    showProfileMenu = false;

    // Full user name
    user: string;

    // Collection of notifications
    notifications: Array<any> = [];

    // Subscriptions
    validateSessionSubscription: Subscription;

    constructor(
        private router: Router,
        public cargadorService: LoaderService,
        private toastr: ToastrService,
        public sessionService: SessionService
    ) {
    }

    ngOnInit() {
        this.init();
    }

    /**
     * Intialiazes variables
     * Validates the current session
     * Verifies if there are pending requests associated with the configuration of a certificate
     */
    init(): void {
        const helper = new JwtHelperService();

        if (localStorage.getItem('token') == null) {
            this.logout();
        } else {
            const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
            if (isExpired) {
                this.logout();
            }
        }
        this.user = this.sessionService.username;
        localStorage.removeItem('reconoserUrl');
        localStorage.removeItem('reconoserRestrictive');
        localStorage.removeItem('otpRestrictive');

        // Carries out some configuration if this is the first time the user is using the app through this particualr browser and device
        this.setUpForFirstTimeUsers();
    }

    /**
     * Returns true if the current session is valid
     */
    isSessionValid(): Promise<boolean> {
        if (!this.sessionService.isLogged || !this.sessionService.documentUser) {
            return new Promise(resolve => {
                resolve(false);
            });
        }

        const loginToken: string = localStorage.getItem('loginToken');

        const validaSessionToken = new SessionTokenModel();

        validaSessionToken.sessionToken = loginToken;
        validaSessionToken.identificacion = this.sessionService.documentUser.toString();

        return new Promise(resolve => {
            resolve(true);
        });
    }

    /**
     * Identifies if this is the first time the user is using the app with this particular device,
     * if so, makes sure to store a flag to indicate the status of this client
     */
    setUpForFirstTimeUsers(): void {
        if (this.sessionService.isNoobNull) {
            localStorage.setItem('noob', '1');
        }
    }

    /**
     * Cleans the session storage and navigates back to the login page
     */
    logout(): void {
        let noob = localStorage.getItem('noob');
        if (noob == null) {
            noob = '1';
        }
        localStorage.clear();
        localStorage.setItem('noob', noob);
        this.router.navigateByUrl('');
    }

    /**
     * Show/Hide the notifications panel
     */
    toggleNotifications(): void {
        this.notificationsAreShowing = !this.notificationsAreShowing;
    }

    /**
     * Show/Hide user menu.
     */
    toggleUserMenu(): void {
        this.showProfileMenu = !this.showProfileMenu;
    }

    /**
     * Show/Hide main menu
     */
    toggleAppMenu(): void {
        this.showAppMenu = !this.showAppMenu;
    }

    /**
     * Removes a notification from the list
     * @param index The index of the notification to be removed
     */
    removeNotification(index: number): void {
        this.notifications.splice(index, 1);
    }

    /**
     * Detects any click on the document, and closes menus accordingly
     */
    @HostListener('document:touchstart', ['$event'])
    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent): void {
        if (!this.notificationsContainer.nativeElement.contains(event.target) &&
            !this.notificationsMobileContainer.nativeElement.contains(event.target)) {
            this.notificationsAreShowing = false;
        }
        if (!this.menuContainer.nativeElement.contains(event.target)) {
            this.showProfileMenu = false;
        }
    }

    /**
     * Unsubscribes from any ongoing subscription
     */
    ngOnDestroy(): void {
        this.toastr.clear();
        if (this.validateSessionSubscription != null) {
            this.validateSessionSubscription.unsubscribe();
        }
    }
}
