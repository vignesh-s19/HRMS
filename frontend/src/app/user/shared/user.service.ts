import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { InviteUser, User, UserStatus } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // post<T>(arg0: string, value: any) {
  //   throw new Error('Method not implemented.');
  // }

  //GET: api/v1/user/profile
  //GET: api/v1/user/profile/id

  //userV1Api: string = `${environment.API}/users`;
  private apiUrl: string = `${environment.API}/api/v1/user`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/emailexists?email=${encodeURIComponent(email)}`);
  }

  inviteUser(user: InviteUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/invite`, user);
  }

  updateUserStatus(userStatus: UserStatus): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/update/status`, userStatus);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateUserRoles(userRoles: string[], id: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}/update/roles`, userRoles);
  }
}
