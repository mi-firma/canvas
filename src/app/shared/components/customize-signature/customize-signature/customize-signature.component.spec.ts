import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeSignatureComponent } from './customize-signature.component';

describe('CustomizeSignatureComponent', () => {
  let component: CustomizeSignatureComponent;
  let fixture: ComponentFixture<CustomizeSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeSignatureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
