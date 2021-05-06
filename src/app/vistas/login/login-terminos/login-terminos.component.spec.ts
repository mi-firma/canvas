import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTerminosComponent } from './login-terminos.component';

describe('LoginTerminosComponent', () => {
  let component: LoginTerminosComponent;
  let fixture: ComponentFixture<LoginTerminosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTerminosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTerminosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
