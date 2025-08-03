import { HttpClient } from '@angular/common/http';
// auth.service.ts
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/register'; // Replace with your Flask API URL

  constructor(private http: HttpClient) { }

  register(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }
}
