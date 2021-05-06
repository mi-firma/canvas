import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroWrapperComponent } from './registro-wrapper.component';

describe('RegistroWrapperComponent', () => {
  let component: RegistroWrapperComponent;
  let fixture: ComponentFixture<RegistroWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroWrapperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
