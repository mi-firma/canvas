import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlantillasComponent } from './admin-plantillas.component';

describe('AdminPlantillasComponent', () => {
  let component: AdminPlantillasComponent;
  let fixture: ComponentFixture<AdminPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
