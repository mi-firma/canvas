import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopIconComponent } from './top-icon.component';

describe('TopIconComponent', () => {
  let component: TopIconComponent;
  let fixture: ComponentFixture<TopIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopIconComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
