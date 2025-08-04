import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  subscribed = true;
  selectedLocation: any = null;
  locations: any = null;
 
  async ngOnInit() {
    let data = {
      "city": "Cairo",
      "interests": ["food, ancient"]
    }

    console.log("HI")
    this.locations = await fetch("http://127.0.0.1:5000/generate_places", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log(this.locations)

  }

  selectLocation(loc: any) {
    this.selectedLocation = loc;
  }

  closeInfo() {
    this.selectedLocation = null;
  }

  accessExclusiveContent(loc: any) {
    alert(`Enjoy your exclusive trip to ${loc.name}!`);
  }

  redeemCoins(loc: any) {
    const queryMatch = loc.link.match(/query=([-.\d]+),([-.\d]+)/);
    if (!queryMatch) {
      alert('⚠️ Location coordinates not found in the link.');
      return;
    }

    const targetLat = parseFloat(queryMatch[1]);
    const targetLng = parseFloat(queryMatch[2]);

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

}
