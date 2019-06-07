import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginUrl = '/api/login';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private http: HttpClient
  ) { }
  sendLogin(username, password): Observable<(User | any)> {
    return this.http.post<(User | any)>(this.loginUrl, JSON.stringify({ username:username, password:password }), this.httpOptions)
  }
}
