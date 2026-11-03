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
  gamesFiltered: Game[] = [];
  selectedGame: Game | null = null;

  loading = true;
  error = false;

  private gamesService = inject(GamesService)

  ngOnInit(): void{
    this.gamesService.getGames().subscribe({
      next: (game : Game[]) => {
        this.game = game;
        this.gamesFiltered = game;
        this.loading = false;
        console.log(game);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
  filterByElement(element: string): void{
    if(element === ' '){
      this.gamesFiltered = this.game;
    }else{
      this.gamesFiltered = this.game.filter((game: Game) => game.genre === element);
    }
  }
  onGenreChange(event : Event): void{
    const select = event.target as HTMLSelectElement;
    const genre = select.value;
    console.log(genre);
    this.filterByElement(genre);
  }
  getGameId(id: number): void{
    this.gamesService.getGameId(id).subscribe({
      next: (game : Game) => {
        this.selectedGame = game;
        this.loading = false;
        console.log(game);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
