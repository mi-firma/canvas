import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturesListComponent } from './signatures-list.component';

describe('SignaturesListComponent', () => {
  let component: SignaturesListComponent;
  let fixture: ComponentFixture<SignaturesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignaturesListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
