import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  locations = [
    {
      name: 'Giza Pyramids',
      type: 'mainstream',
      link: 'https://www.google.com/maps/search/?api=1&query=Giza+Pyramids+cairo+Egypt',
      x: 48,
      y: 30
    },
    {
      name: 'Egyptian Museum',
      type: 'mainstream',
      link: 'https://www.google.com/maps/search/?api=1&query=Egyptian+Museum+cairo+Egypt',
      x: 51,
      y: 32
    },
    {
      name: 'Anba Bishoy Monastery',
      type: 'hidden gem',
      link: 'https://www.google.com/maps/search/?api=1&query=Anba+Bishoy+Monastery+cairo+Egypt',
      x: 45,
      y: 28
    },
    // Add all the rest with coordinates
  ];

  openLocation(link: string) {
    window.open(link, '_blank');
  }
}
