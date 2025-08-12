import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ScrollLockService } from '../services/scroll-lock.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { RecipeFiltersComponent } from '../recipe-filters/recipe-filters.component';
import { FilterService } from '../services/filter.service';
import { Recipe } from '../Interface/recipe';
import { Rating } from '../Interface/rating';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RouterLink,
    FooterSectionComponent,
    NavbarComponent,
    MobileNavComponent,
    RecipeFiltersComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  recipesArray: Recipe[] = [];
  totalPages: number = 1;
  currentPage: number = 1;
  isMobile: boolean = false;
  isFiltering: boolean = false;
  language: string = 'en';

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.loadRecipes();
    this.updateViewport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private scrollLockService: ScrollLockService,
    private router: Router,
    private notificationService: NotificationService,
    private filterService: FilterService
  ) {
    this.languageService.language$.subscribe((language) => {
      this.language = language;
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.scrollLockService.unlockScroll();
        });
    });
    this.translate.setDefaultLang(this.language);

    this.filterService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.currentPage = filters.currentPage;
      });
  }

  loadRecipes(): void {
    const currentFilters = this.filterService.currentFilters;

    this.filterService
      .loadRecipes(currentFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.content)) {
            this.recipesArray = response.content.filter(
              (recipe) => recipe.isPublic === true
            );
            this.totalPages = response.totalPages;
          } else {
            this.notificationService.error(
              'Failed to load recipes. Please try again later.',
              5000
            );
            this.recipesArray = [];
          }
        },
        error: () => {
          this.notificationService.error(
            'Failed to load recipes. Please try again later.',
            5000
          );
          this.recipesArray = [];
        },
      });
  }

  onFiltersChanged(): void {
    this.loadRecipes();
  }

  onPageChange(page: number): void {
    this.filterService.updateFilters({ currentPage: page });
    this.loadRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getAverageRating(ratings: Rating[]): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  getDifficulty(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'easy';
      case 2:
        return 'medium';
      case 3:
        return 'hard';
      default:
        return 'no value';
    }
  }

  private updateViewport(): void {
    this.isMobile = window.innerWidth <= 800;
    this.isFiltering = window.innerWidth <= 1350;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateViewport();
  }
}
