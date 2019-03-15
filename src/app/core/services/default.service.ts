import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../utils/config.service';
import { environment } from '../../../environments/environment'


@Injectable()
export class DefaultService {

  private BASE_SERVER: string;
  private BASE_PROTOCOL: string;
  private BASE_API: string;
  private BASE_URI: string;

  constructor(private _configService: ConfigService, private _http: HttpClient) {
    this.BASE_SERVER = this._configService.getConfig("BackendDefineServer");
    this.BASE_PROTOCOL = environment.apiConfig.api_protocal + ":";
    this.BASE_API = environment.apiConfig.api_name + "/" + environment.apiConfig.api_version;
    this.BASE_URI = `${this.BASE_PROTOCOL}//${this.BASE_SERVER}/${this.BASE_API}/`;
  }

  getParkingLotData(): Observable<any> {
    let API_URI = this.BASE_URI + environment.apiConfig.getParkingLotData;
    console.log(API_URI);
    return this._http.get(API_URI);
  }
}
