import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  private _googleAnalytics = new BehaviorSubject<boolean>(null);

  public readonly googleAnalytics = this._googleAnalytics.asObservable();

  private _paramsApi = new BehaviorSubject<any>(null);

  public readonly paramsApi = this._paramsApi.asObservable();

  private _OneDrive = new BehaviorSubject<string>(null);

  public readonly OneDrive = this._OneDrive.asObservable();

  constructor(private http: HttpClient) {
    this.isGoogleAnalyticsEnabled();
    this.OneDriveF()
    this.paramsApiF()
  }

  private isGoogleAnalyticsEnabled() {
      if(environment.IsGoogleAnalyticsEnabled){
        this._googleAnalytics.next(true);
      }else{
        this._googleAnalytics.next(false);
      }

  }

  paramsApiF(){
    const data = {
      urlAPI : environment.UrlApi,
      token : environment.tokenAPI,
      urlDev : environment.PortalDeveloper
    }
    this._paramsApi.next(data)
  }

  OneDriveF(){
    this._OneDrive.next(environment.ClienIdOneDrive)
  }
}
