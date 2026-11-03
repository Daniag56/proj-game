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

  private gamesService = inject(GamesService);
  games: Game[] = [];
  selectedGame: Game | null = null;
  selectedGenre = '';
  selectedPlatform = '';
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadGames();
  }

  onGameId(id: string): void {
    this.gamesService.getGameId(Number(id)).subscribe(data => {
      this.selectedGame = data;
    });
  }

  loadGames(): void {
    this.gamesService.getGames(this.currentPage, this.pageSize, this.selectedGenre, this.selectedPlatform).subscribe(response => {
      this.games = response.body ?? [];
      this.totalItems = Number(response.headers.get('X-Total-Count') ?? 0);
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGames();
    }
  }

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadGames();
  }

  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.loadGames();
  }

  searchByTitle(text: string): void {
    this.gamesService.searchGames(text).subscribe(data => {
      this.games = data;
    });
  }

  filterByPrice(min: string, max: string): void {
    this.gamesService.getGamesByPrice(min, max).subscribe(data => {
      this.games = data;
    });
  }
}
