import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyUsersComponent } from './list-company-users.component';

describe('ListCompanyUsersComponent', () => {
  let component: ListCompanyUsersComponent;
  let fixture: ComponentFixture<ListCompanyUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompanyUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
