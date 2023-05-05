import { Injectable } from '@angular/core';
import Hero from '../interfaces/Hero';
import { Observable, catchError, pipe, tap, throwError } from 'rxjs';
import { MessageService } from './message.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private apiURL = 'https://localhost:7087/api/heroes';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private readonly messageService: MessageService,
    private readonly http: HttpClient
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiURL).pipe(
      tap(() => this.log('Fetched heroes')),
      catchError(this.handleError)
    );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiURL}/${id}`).pipe(
      tap(() => this.log(`Fetched hero with id ${id}`)),
      catchError(this.handleError)
    );
  }

  updateHero(hero: Hero): Observable<void> {
    return this.http
      .put<void>(`${this.apiURL}/${hero.id}`, hero, this.httpOptions)
      .pipe(
        tap(() => this.log(`Updated hero with id ${hero.id}`)),
        catchError(this.handleError)
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiURL, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Added hero w/ id=${newHero.id}`)),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMsg = '';

    if (err.error instanceof ErrorEvent) {
      // Client-side or network error.
      errorMsg = `An error ocurred: ${err.error.message}`;
    } else {
      // Unsuccessful response code. Body could contain additional information.
      errorMsg = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    this.log(errorMsg);
    return throwError(() => errorMsg);
  }

  private log(msg: string): void {
    this.messageService.add(`Hero Service: ${msg}`);
  }
}
