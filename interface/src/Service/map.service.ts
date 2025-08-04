import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Location {
  name: string;
  type: string;
  crowded: string;
  lat: number;
  lng: number;
  link: string;
}

export interface LocationRequest {
  city: string;
  interests: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getLocations(request: LocationRequest): Observable<Location[]> {
    return this.http.post<Location[]>(`${this.apiUrl}/generate_places`, request);
  }

  getSampleLocations(): Location[] {
    return [
      {
        name: "Pyramids of Giza",
        type: "Historical",
        crowded: "Crowded",
        lat: 30,
        lng: 40,
        link: "https://maps.google.com/?q=29.9792,31.1342"
      },
      {
        name: "Egyptian Museum",
        type: "Museum",
        crowded: "Not Crowded",
        lat: 60,
        lng: 50,
        link: "https://maps.google.com/?q=30.0478,31.2336"
      },
      {
        name: "Khan el-Khalili",
        type: "Market",
        crowded: "Crowded",
        lat: 70,
        lng: 60,
        link: "https://maps.google.com/?q=30.0478,31.2619"
      },
      {
        name: "Salah El Din Citadel",
        type: "Historical",
        crowded: "Not Crowded",
        lat: 45,
        lng: 35,
        link: "https://maps.google.com/?q=30.0292,31.2597"
      },
      {
        name: "Al-Azhar Park",
        type: "Park",
        crowded: "Not Crowded",
        lat: 55,
        lng: 45,
        link: "https://maps.google.com/?q=30.0444,31.2357"
      }
    ];
  }
} 