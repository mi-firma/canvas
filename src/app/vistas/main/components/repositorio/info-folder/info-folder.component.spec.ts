import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFolderComponent } from './info-folder.component';

describe('InfoFolderComponent', () => {
  let component: InfoFolderComponent;
  let fixture: ComponentFixture<InfoFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
