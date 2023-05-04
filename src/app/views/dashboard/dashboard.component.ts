import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Hero from 'src/app/interfaces/Hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
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
        next: heroes => (this.heroes = heroes.slice(1, 5)),
      });
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
