import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaderboardEntry, LeaderboardService } from '@services/leaderboard.service';


@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboardData: LeaderboardEntry[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.error = '';
    
    this.leaderboardService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.error = 'Failed to load leaderboard data';
        this.loading = false;
      }
    });
  }

  refreshLeaderboard(): void {
    this.loadLeaderboard();
  }

  getRankClass(index: number): string {
    const rank = index + 1;
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  }

  getRank(index: number): number {
    return index + 1;
  }
}
