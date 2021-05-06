import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicOptionsComponent } from './basic-options.component';

describe('BasicOptionsComponent', () => {
  let component: BasicOptionsComponent;
  let fixture: ComponentFixture<BasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
