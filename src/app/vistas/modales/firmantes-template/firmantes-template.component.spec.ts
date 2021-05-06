import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmantesTemplateComponent } from './firmantes-template.component';

describe('FirmantesTemplateComponent', () => {
  let component: FirmantesTemplateComponent;
  let fixture: ComponentFixture<FirmantesTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmantesTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmantesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
