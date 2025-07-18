import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    return this.http.get<any>('http://localhost:8080/api/users/aboutme', {
      headers,
    });
  }
}
