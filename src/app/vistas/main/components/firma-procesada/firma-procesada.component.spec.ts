import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaProcesadaComponent } from './firma-procesada.component';

describe('FirmaProcesadaComponent', () => {
  let component: FirmaProcesadaComponent;
  let fixture: ComponentFixture<FirmaProcesadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmaProcesadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaProcesadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
