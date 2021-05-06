import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoFirmaComponent } from './tipo-firma.component';

describe('TipoFirmaComponent', () => {
  let component: TipoFirmaComponent;
  let fixture: ComponentFixture<TipoFirmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoFirmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
