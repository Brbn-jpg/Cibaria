import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(this.apiUrl + '/authenticate', body);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    console.log(body);

    return this.http.post(this.apiUrl + '/register', body);
  }
}
