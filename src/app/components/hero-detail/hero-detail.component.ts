import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Hero from 'src/app/interfaces/Hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();
  @Input() hero?: Hero;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.heroService
      .getHero(id)
      .pipe(takeUntil(this.stop$))
      .subscribe({
        next: hero => (this.hero = hero),
      });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
