import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationTeamComponent } from './invitation-team.component';

describe('InvitationTeamComponent', () => {
  let component: InvitationTeamComponent;
  let fixture: ComponentFixture<InvitationTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
