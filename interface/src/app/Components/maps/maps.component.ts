import { CommonModule } from '@angular/common'; // import this
import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-game-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapComponent implements OnInit {
  locations = [
    { name: 'Cairo', x: 55, y: 35 },
    { name: 'Luxor', x: 60, y: 60 },
    // These should come from your backend
  ];

  constructor() {}

  ngOnInit(): void {
    // Call backend here to fetch location data
    // this.fetchLocations();
  }

  onSelectLocation(location: any) {
    alert(`Selected: ${location.name}`);
    // Navigate or load game level
  }
}
