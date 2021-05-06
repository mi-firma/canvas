import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReconoserService } from 'src/app/servicios/reconoser/reconoser.service';
import { Observable, of } from 'rxjs';
import { IRcsValidationRequest } from 'src/app/interfaces';
import { SessionService } from 'src/app/servicios';
import { ToastrService } from 'ngx-toastr';
import { GatewayService } from 'src/app/servicios/gateway.service';


@Component({
  selector: 'app-login-facial',
  templateUrl: './login-facial.component.html',
  styleUrls: ['./login-facial.component.css']
})
export class LoginFacialComponent implements OnInit {
  iframeUrl: string;
  processCode: string;
  user: string;
  id :string
  url :string
  validateOtp: string
  personaId: number
  document: number
  reconoserRestrictive: string
  completeValidation: boolean = true;

  constructor(
    private router: Router,
    private reconoserService: ReconoserService,
    private gatewayService : GatewayService,
    private readonly activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.username;
    this.init();
    this.id = this.sessionService.reconoserGuid;
    this.url = this.sessionService.reconoserUrl;
    this.validateOtp = this.sessionService.validarOtp;
    this.personaId = +this.sessionService.userId;
    this.document = +this.sessionService.documentUser;
    this.reconoserRestrictive = this.sessionService.recoRestrictive
    
    if (this.url) {
      this.iframeUrl = this.url;
    }
  }

  init(): void {
  }

  lastStepReco(){
    if(this.validateOtp == "true"){
      this.gatewayService.generarOtp(this.document).subscribe((respuesta:any)=>{
        localStorage.setItem('identificadorOTP', respuesta.identificador);
        this.router.navigate(['login']);
      });
    }else{
      this.gatewayService.getLoginToken(this.personaId).subscribe((respuesta:any )=>{
        localStorage.setItem('loginToken', respuesta.loginToken);
        this.router.navigate(['main/menu']);
      });
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent): void {
    //console.log('RESULTADO => ', event.data);
    if ((event.data.for === 'resultData')) {
      this.completeValidation = false;
      this.gatewayService.validarFacial(this.id).subscribe((respuesta: any)=>{
        if(this.reconoserRestrictive == "true"){
          if(respuesta.hit){
            this.lastStepReco()
          }else{
            this.toastr.error("No pudimos validar su identidad")
            this.router.navigate(['']);
          }
        }else{
          this.lastStepReco()
        }
      });
    }
  }
}