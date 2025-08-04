import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  Router,
} from '@angular/router';
import { GameService, GamePreferences } from '@services/game.service';

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

  constructor(private gameService: GameService, private router: Router) {}

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
    // Save user preferences
    const preferences: GamePreferences = {
      userName: this.userName,
      selectedCity: this.selectedCity || 'Any',
      selectedActivity: this.selectedActivity || 'Any'
    };
    
    this.gameService.setGamePreferences(preferences);
    console.log('Game preferences saved:', preferences);
    
    // Navigate to map
    this.router.navigate(['/map']);
  }
}
