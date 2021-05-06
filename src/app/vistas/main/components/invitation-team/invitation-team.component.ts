import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invitation-team',
  templateUrl: './invitation-team.component.html',
  styleUrls: ['./invitation-team.component.css']
})
export class InvitationTeamComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  idWorkGroup : string
  companyId : string

  ngOnInit() {
    this.idWorkGroup = this.activatedRoute.snapshot.paramMap.get('id');
    this.companyId = this.activatedRoute.snapshot.paramMap.get('idC');
    localStorage.setItem('idWorkGroup',this.idWorkGroup)
    localStorage.setItem('idCompany',this.companyId)
    this.router.navigateByUrl('main/menu')
  }

}
