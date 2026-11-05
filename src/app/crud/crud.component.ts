import { Component, inject } from '@angular/core';
import { FormsModule,NgModel } from '@angular/forms';
import { GamesService } from '../services/games.service';
import { Game } from '../models/game';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [FormsModule, JsonPipe],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent {
  private gameService = inject(GamesService);

  game: Game = {
    title: '',
    genre: '',
    platform: '',
    price: 0,
    stock: 0,
  };

  onSaveGame() {
    console.log('Guardando juego:', this.game);

  }
}
