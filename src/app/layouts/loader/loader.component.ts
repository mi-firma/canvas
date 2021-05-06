import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit, OnDestroy {
  isThirdParty = localStorage.getItem('isThirdParty') == 'true';
  thirdPartyLoaderUrl = localStorage.getItem('thirdPartyLoaderUrl');
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private cargadorService: LoaderService) { }

  ngOnInit() {
    this.loadingSubscription = this.cargadorService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
