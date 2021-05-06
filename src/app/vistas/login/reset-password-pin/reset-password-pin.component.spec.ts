import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPinComponent } from './reset-password-pin.component';

describe('ResetPasswordPinComponent', () => {
  let component: ResetPasswordPinComponent;
  let fixture: ComponentFixture<ResetPasswordPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
