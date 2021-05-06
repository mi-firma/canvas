import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCelularComponent } from './confirmar-celular.component';

describe('ConfirmarCelularComponent', () => {
  let component: ConfirmarCelularComponent;
  let fixture: ComponentFixture<ConfirmarCelularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarCelularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarCelularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
