import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoApiComponent } from './info-api.component';

describe('InfoApiComponent', () => {
  let component: InfoApiComponent;
  let fixture: ComponentFixture<InfoApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
