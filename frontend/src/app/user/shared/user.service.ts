import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InviteUser, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  post<T>(arg0: string, value: any) {
    throw new Error('Method not implemented.');
  }

  //GET: api/v1/user/profile
  //GET: api/v1/user/profile/id

  apiEndpoint: string = environment.API;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiEndpoint}/users`);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiEndpoint}/users/${id}`);
  }

  inviteUser(user: InviteUser): Observable<User> {
    return this.http.post<User>(`${this.apiEndpoint}/users`, user);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiEndpoint}/users`, user);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiEndpoint}/${id}`).pipe(map((res: any) => {
      return res
    }));
  }

  updateUser(user:User,id:any ):Observable<User>{
      return this.http.put<User>(`${this.apiEndpoint}/${id}`,user);
  }
}
