import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSliderComponent } from './plan-slider.component';

describe('PlanSliderComponent', () => {
  let component: PlanSliderComponent;
  let fixture: ComponentFixture<PlanSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
