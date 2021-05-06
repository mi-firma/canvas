import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-ayuda-firma',
  templateUrl: './ayuda-firma.component.html',
  styleUrls: ['./ayuda-firma.component.css']
})
export class AyudaFirmaComponent implements OnInit {
  step = 1;
  public anim_1: Object;
  public anim_mov_1: Object;
  public anim_2: Object;
  public anim_mov_2: Object;
  public anim_3: Object;
  public anim_mov_3: Object;
  public anim_4: Object;
  public anim_mov_4: Object;
  constructor(
    private activeModal: NgbActiveModal,
    
  ) {
    this.anim_1 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-sign-1.json',
    };
    this.anim_mov_1 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-1-mobile.json',
    };
    this.anim_2 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-sign-2.json',
    };
    this.anim_mov_2 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-2-mobile.json',
    };
    this.anim_3 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-sign-3.json',
    };
    this.anim_mov_3 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-3-mobile.json',
    };
    this.anim_4 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-sign-4.json',
    };
    this.anim_mov_4 = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/anim-4-mobile.json',
    };
   }

  ngOnInit() {
  }

  anterior(step: number) {
    this.step = step - 1;
  }

  siguiente(step: number) {
    this.step = step + 1;
  }

  cerrar() {
    this.activeModal.close();
  }
}
