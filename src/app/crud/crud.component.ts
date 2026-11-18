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

  title = new FormControl('',{nonNullable: true, validators: [Validators.required,Validators.minLength(3),Validators.maxLength(40)]});

  genre = new FormControl('',{nonNullable: true, validators: [Validators.required]});

  platform = new FormControl('',{nonNullable: true, validators: [Validators.required]});

  price = new FormControl(0,{nonNullable: true, validators: [Validators.required,Validators.min(0.01),Validators.max(100)]});

  stock = new FormControl(0,{nonNullable: true, validators: [Validators.required,Validators.min(0),Validators.max(999)]});

  formGroup = new FormGroup({ title: this.title, genre: this.genre, platform: this.platform, price: this.price, stock: this.stock});

  edit = false;

  editGame = input<Game|undefined>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editGame']) {
      this.formGroup.setValue(changes['editGame'].currentValue);
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
    if (gameForm.invalid) {
      return;
    }

    this.game = { ...this.game, ...this.formGroup.getRawValue() };

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
    this.formGroup.setValue({ title: game.title, genre: game.genre, platform: game.platform, price: game.price, stock: game.stock });
  }

  onCancelEdit(gameForm: FormGroupDirective): void {
    this.resetGameForm(gameForm);
  }

  resetGameForm(gameForm: FormGroupDirective): void {
    gameForm.resetForm();
    this.game = this.newGame();
  }
}
