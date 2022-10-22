import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserBasicInfo, UserProfile  } from './user-profile.model';
import { CorrespondenceAddress } from './user-profile.model';
import { PermanentAddress } from './user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  //GET: api/v1/user/profile
  //GET: api/v1/user/profile/id

  apiEndpoint: string = environment.API;

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiEndpoint}`);
  }

  getById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiEndpoint}`);
  }

  saveUserBasicInfo(basicInfo: UserBasicInfo): Observable<UserBasicInfo> {
    return this.http.post<UserBasicInfo>(`${this.apiEndpoint}`, basicInfo);
  }

  saveUserCorrespondenceAddressInfo(contactInfo: CorrespondenceAddress): Observable<CorrespondenceAddress> {
    return this.http.post<CorrespondenceAddress>(`${this.apiEndpoint}`, contactInfo);
  }
  saveUserPermanentAddressInfo(contactInfo: PermanentAddress): Observable<PermanentAddress> {
    return this.http.post<PermanentAddress>(`${this.apiEndpoint}`, contactInfo);
  }
}
