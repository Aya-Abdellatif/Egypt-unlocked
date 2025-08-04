import { Injectable } from '@angular/core';

export interface GamePreferences {
  userName: string;
  selectedCity: string;
  selectedActivity: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gamePreferences: GamePreferences = {
    userName: '',
    selectedCity: '',
    selectedActivity: ''
  };

  constructor() { }

  setGamePreferences(preferences: GamePreferences): void {
    this.gamePreferences = { ...preferences };
    // Also save to localStorage for persistence
    localStorage.setItem('gamePreferences', JSON.stringify(preferences));
  }

  getGamePreferences(): GamePreferences {
    // Try to get from localStorage first, then fallback to memory
    const stored = localStorage.getItem('gamePreferences');
    if (stored) {
      this.gamePreferences = JSON.parse(stored);
    }
    return { ...this.gamePreferences };
  }

  getUserName(): string {
    return this.gamePreferences.userName;
  }

  getSelectedCity(): string {
    return this.gamePreferences.selectedCity;
  }

  getSelectedActivity(): string {
    return this.gamePreferences.selectedActivity;
  }

  clearGamePreferences(): void {
    this.gamePreferences = {
      userName: '',
      selectedCity: '',
      selectedActivity: ''
    };
    localStorage.removeItem('gamePreferences');
  }

  hasGamePreferences(): boolean {
    return this.gamePreferences.userName !== '' && 
           (this.gamePreferences.selectedCity !== '' || this.gamePreferences.selectedActivity !== '');
  }
} 