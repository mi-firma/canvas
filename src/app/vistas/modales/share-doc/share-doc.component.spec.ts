import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDocComponent } from './share-doc.component';

describe('ShareDocComponent', () => {
  let component: ShareDocComponent;
  let fixture: ComponentFixture<ShareDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
