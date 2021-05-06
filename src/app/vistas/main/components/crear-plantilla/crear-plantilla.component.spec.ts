import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlantillaComponent } from './crear-plantilla.component';

describe('CrearPlantillaComponent', () => {
  let component: CrearPlantillaComponent;
  let fixture: ComponentFixture<CrearPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
