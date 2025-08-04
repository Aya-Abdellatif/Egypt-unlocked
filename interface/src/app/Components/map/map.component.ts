import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService, Location } from '@services/map.service';
import { GameService } from '@services/game.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  subscribed = true;
  selectedLocation: Location | null = null;
  locations: Location[] = [];
  loading = false;
  error = '';
  userName = '';
  selectedCity = '';
  selectedActivity = '';
 
  constructor(private mapService: MapService, private gameService: GameService) {}

  ngOnInit() {
    this.loadUserPreferences();
    this.loadLocations();
  }

  loadUserPreferences() {
    const preferences = this.gameService.getGamePreferences();
    this.userName = preferences.userName;
    this.selectedCity = preferences.selectedCity;
    this.selectedActivity = preferences.selectedActivity;
    console.log('Loaded user preferences:', preferences);
  }

  loadLocations() {
    this.loading = true;
    this.error = '';
    
    // Use the user's selected city and activity
    const city = this.selectedCity === 'Any' ? 'Cairo' : this.selectedCity;
    const interests = this.selectedActivity === 'Any' ? ['food', 'ancient'] : [this.selectedActivity.toLowerCase()];
    
    const request = {
      city: city,
      interests: interests
    };

    this.mapService.getLocations(request).subscribe({
      next: (data) => {
        console.log('Raw API response:', data);
        this.locations = data;
        console.log('Locations loaded:', this.locations);
        console.log('Number of locations:', this.locations.length);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.error = 'Failed to load locations. Please try again.';
        // Fallback to sample data for demo
        this.locations = this.mapService.getSampleLocations();
        console.log('Using fallback locations:', this.locations);
        this.loading = false;
      }
    });
  }

  selectLocation(loc: Location) {
    this.selectedLocation = loc;
  }

  closeInfo() {
    this.selectedLocation = null;
  }

  accessExclusiveContent(loc: Location) {
    alert(`🎉 Enjoy your exclusive trip to ${loc.name}!`);
  }

  redeemCoins(loc: Location) {
    const targetLat = loc.lat;
    const targetLng = loc.lng;

    if (!navigator.geolocation) {
      alert('❌ Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = this.getDistanceFromLatLonInKm(userLat, userLng, targetLat, targetLng);
        const thresholdMeters = 100;

        if (distance * 1000 <= thresholdMeters) {
          alert(`🎉 You've redeemed coins for ${loc.name}!`);
        } else {
          alert(`❌ You are too far from the location. (${Math.round(distance * 1000)} meters away)`);
        }
      },
      (error) => {
        alert('❌ Failed to get your location. Make sure location access is enabled.');
        console.error(error);
      }
    );
  }

  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  refreshLocations() {
    this.loadLocations();
  }

}
