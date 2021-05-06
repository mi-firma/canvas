import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishSignComponent } from './finish-sign.component';

describe('FinishSignComponent', () => {
  let component: FinishSignComponent;
  let fixture: ComponentFixture<FinishSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
