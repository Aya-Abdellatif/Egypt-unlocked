import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  subscribed = true;
  selectedLocation: any = null;

  locations = [
    {
      name: 'Giza Pyramids',
      type: 'mainstream',
      description: 'The most iconic pyramids in Egypt.',
      link: 'https://www.google.com/maps/search/?api=1&query=Giza+Pyramids+cairo+Egypt',
      crowded: true,
      x: 20,
      y: 30
    },
    {
      name: 'Wadi el-Rayan',
      type: 'hidden gem',
      description: 'Natural oasis with waterfalls.',
      link: 'https://www.google.com/maps/search/?api=1&query=Wadi+el-Rayan+cairo+Egypt',
      crowded: false,
      x: 80,
      y: 30
    },
    {
      name: 'Siwa Oasis',
      type: 'hidden gem',
      description: 'An ancient and serene desert escape.',
      link: 'https://www.google.com/maps/search/?api=1&query=Siwa+Oasis+Egypt',
      crowded: false,
      x: 20,
      y: 60
    },
    {
      name: 'Khan El-Khalili',
      type: 'mainstream',
      description: 'Famous traditional bazaar in Cairo.',
      link: 'https://www.google.com/maps/search/?api=1&query=Khan+El-Khalili+Cairo+Egypt',
      crowded: true,
      x: 80,
      y: 60
    },
    {
      name: 'White Desert',
      type: 'hidden gem',
      description: 'Unique chalk rock formations in the desert.',
      link: 'https://www.google.com/maps/search/?api=1&query=White+Desert+Egypt',
      crowded: false,
      x: 50,
      y: 45
    }
  ];

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
    alert(`You've redeemed coins for ${loc.name}!`);
  }
}
