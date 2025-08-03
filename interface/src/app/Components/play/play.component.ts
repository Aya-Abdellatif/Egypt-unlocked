import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent {
  step = 1;
  userName = '';
  selectedCity = '';
  selectedActivity = '';

  continue() {
    this.step++;
  }

  skipCity() {
    this.selectedCity = 'Any';
    this.continue();
  }

  skipActivity() {
    this.selectedActivity = 'Any';
    this.continue();
  }

  startGame() {
    console.log(`Start game for ${this.userName}, city: ${this.selectedCity}, activity: ${this.selectedActivity}`);
  }
}
