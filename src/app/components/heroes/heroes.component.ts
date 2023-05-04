import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Hero from 'src/app/interfaces/Hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();
  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(private readonly heroService: HeroService) {}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.heroService
      .getHeroes()
      .pipe(takeUntil(this.stop$))
      .subscribe({
        next: heroes => (this.heroes = heroes),
      });
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
