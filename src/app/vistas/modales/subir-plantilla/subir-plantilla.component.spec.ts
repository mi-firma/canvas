import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirPlantillaComponent } from './subir-plantilla.component';

describe('SubirPlantillaComponent', () => {
  let component: SubirPlantillaComponent;
  let fixture: ComponentFixture<SubirPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirPlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
