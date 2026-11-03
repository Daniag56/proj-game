import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private apiUrl = 'http://localhost:3000/games'
  private http = inject(HttpClient)

  getGames(page: number, limit: number, genre: string, platform: string): Observable<HttpResponse<Game[]>> {
    let params = new HttpParams().set('_page', page).set('_limit', limit);

    if (genre) {
      params = params.set('genre', genre);
    }
    if (platform) {
      params = params.set('platform', platform);
    }

    return this.http.get<Game[]>(this.apiUrl, { params, observe: 'response' });
  }

  getGameId(id: number): Observable<Game>{
    return this.http.get<Game>(`${this.apiUrl}/${id}`)
  }

  searchGames(text: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}?title_like=${text}`);
  }

  getGamesByPrice(min: string, max: string): Observable<Game[]> {
    let params = new HttpParams();

    if (min) {
      params = params.set('price_gte', min);
    }
    if (max) {
      params = params.set('price_lte', max);
    }

    return this.http.get<Game[]>(this.apiUrl, { params });
  }
}
