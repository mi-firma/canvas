import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFacialComponent } from './login-facial.component';

describe('LoginFacialComponent', () => {
  let component: LoginFacialComponent;
  let fixture: ComponentFixture<LoginFacialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFacialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
