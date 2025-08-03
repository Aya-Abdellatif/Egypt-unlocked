import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LeaderboardEntry {
  username: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private apiUrl = 'http://localhost:5000'; // Replace with your Flask API URL

  constructor(private http: HttpClient) { }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    console.log('Fetching leaderboard from:', `${this.apiUrl}/get_leaderboard`);
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/get_leaderboard`);
  }





  submitScore(username: string, score: number): Observable<any> {
    const body = { username, score };
    return this.http.post(`${this.apiUrl}/leaderboard/submit`, body);
  }
} 