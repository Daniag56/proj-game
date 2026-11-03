import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesService } from './services/games.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'proj-game';

  game: Game[] = [];
  gamesFiltered: Game[] = [];
  selectedGame: Game | null = null;

  loading = true;
  error = false;

  private gamesService = inject(GamesService);

  ngOnInit(): void {
    this.gamesService.getGames().subscribe({
      next: (game: Game[]) => {
        this.game = game;
        this.gamesFiltered = game;
        this.loading = false;
        console.log(game);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  onGenreChange(genre: string): void {
    console.log(genre);
    if (genre === 'all') {
      this.gamesFiltered = this.game;
    } else {
      this.gamesService.getGamesByGenre(genre).subscribe({
        next: (games: Game[]) => {
          this.gamesFiltered = games;
          this.loading = false;
          console.log(games);
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
    }
  }
  onGameId(id: number): void {
    this.gamesService.getGameId(id).subscribe({
      next: (game: Game) => {
        this.selectedGame = game;
        this.loading = false;
        console.log(game);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  onPlatformChange(platform: string): void {
    console.log(platform);
    if (platform === 'all') {
      this.gamesFiltered = this.game;
    } else {
      this.gamesService.getGamesByPlatform(platform).subscribe({
        next: (games: Game[]) => {
          this.gamesFiltered = games;
          this.loading = false;
          console.log(games);
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
    }
  }
}
