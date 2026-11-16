import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GamesService } from '../services/games.service';
import { Game } from '../models/game';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [FormsModule, JsonPipe],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent implements OnInit {
  private gameService = inject(GamesService);

  games: Game[] = [];

  game: Game = this.newGame();

  ngOnInit(): void {
    this.loadGames();
  }

  newGame(): Game {
    return {
      title: '',
      genre: '',
      platform: '',
      price: 0,
      stock: 0,
    };
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe(data => {
      this.games = data;
    });
  }

  onSaveGame(gameForm: NgForm): void {
    if (gameForm.invalid) {
      return;
    }

    if (this.game.id) {
      this.gameService.updateGame(this.game).subscribe(() => {
        this.loadGames();
        this.resetGameForm(gameForm);
      });
    } else {
      this.gameService.createGame(this.game).subscribe(() => {
        this.loadGames();
        this.resetGameForm(gameForm);
      });
    }
  }

  onEditGame(game: Game): void {
    this.game = { ...game };
  }

  onCancelEdit(gameForm: NgForm): void {
    this.resetGameForm(gameForm);
  }

  resetGameForm(gameForm: NgForm): void {
    gameForm.resetForm();
    this.game = this.newGame();
  }
}
