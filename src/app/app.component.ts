import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesService } from './services/games.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'proj-game';

  game: Game[] = [];

  loading = true;
  error = false;

  private gamesService = inject(GamesService)

  ngOnInit(): void{
    this.gamesService.getGames().subscribe({
      next: (game : Game[]) => {
        this.game = game;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
