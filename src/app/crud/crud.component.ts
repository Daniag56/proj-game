import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroupDirective, FormControl, Validators, FormGroup} from '@angular/forms';
import { GamesService } from '../services/games.service';
import { Game } from '../models/game';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule,JsonPipe],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent implements OnInit, OnChanges {
  private gameService = inject(GamesService);

  games: Game[] = [];

  game: Game = this.newGame();

  message = '';

  title = new FormControl('',{nonNullable: true, validators: [Validators.required,Validators.minLength(3),Validators.maxLength(40)]});

  genre = new FormControl('',{nonNullable: true, validators: [Validators.required]});

  platform = new FormControl('',{nonNullable: true, validators: [Validators.required]});

  price = new FormControl(0,{nonNullable: true, validators: [Validators.required,Validators.min(0.01),Validators.max(100)]});

  stock = new FormControl(0,{nonNullable: true, validators: [Validators.required,Validators.min(0),Validators.max(999),Validators.pattern('^[0-9]+$')]});

  formGroup = new FormGroup({ title: this.title, genre: this.genre, platform: this.platform, price: this.price, stock: this.stock});

  edit = false;

  editGame = input<Game|undefined>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editGame'] && changes['editGame'].currentValue) {
      this.game = { ...changes['editGame'].currentValue };
      this.formGroup.patchValue(changes['editGame'].currentValue);
      this.edit = true;
    }
  }

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

  onSaveGame(gameForm: FormGroupDirective): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    this.game = { ...this.game, ...this.formGroup.getRawValue() };

    if (this.game.id) {
      this.gameService.updateGame(this.game).subscribe({
        next: () => {
          this.message = '✔ Videojuego actualizado.';
          this.loadGames();
          this.resetGameForm(gameForm);
        },
        error: () => {
          this.message = '⚠ No se ha podido actualizar el videojuego.';
        }
      });
    } else {
      this.gameService.createGame(this.game).subscribe({
        next: () => {
          this.message = '✔ Videojuego creado.';
          this.loadGames();
          this.resetGameForm(gameForm);
        },
        error: () => {
          this.message = '⚠ No se ha podido crear el videojuego.';
        }
      });
    }
  }

  onEditGame(game: Game): void {
    this.game = { ...game };
    this.formGroup.patchValue(game);
    this.message = '';
  }

  onCancelEdit(gameForm: FormGroupDirective): void {
    this.resetGameForm(gameForm);
    this.message = '';
  }

  resetGameForm(gameForm: FormGroupDirective): void {
    gameForm.resetForm();
    this.game = this.newGame();
    this.edit = false;
  }
}
