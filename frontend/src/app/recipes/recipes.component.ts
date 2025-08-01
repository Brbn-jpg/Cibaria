import {
  Component,
  HostListener,
  inject,
  OnInit,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ScrollLockService } from '../services/scroll-lock.service';
import { filter } from 'rxjs';

export interface category {
  categoryName: string;
}

export interface recipesRequest {
  id: number;
  recipeName: string;
  difficulty: number;
  prepareTime: number;
  servings: number;
  category: string;
  ratings: rating[];
  images: images[];
  isPublic: boolean;
}

export interface images {
  imageUrl: string;
  publicId: string;
}

export interface rating {
  ratingId: number;
  value: number;
}
@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RouterLink,
    FooterSectionComponent,
    NavbarComponent,
    MobileNavComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  url: string = 'http://localhost:8080/api/recipes';
  http = inject(HttpClient);
  el: ElementRef = inject(ElementRef);
  categoriesArray: category[] = [];
  recipesArray: recipesRequest[] = [];
  totalItems: recipesRequest[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  difficulty?: number;
  prepTimeFrom?: number;
  prepTimeTo?: number;
  prepTime?: number;
  servingsFrom?: number;
  servingsTo?: number;
  category?: string;
  isPublic?: boolean;
  totalPages: number = 1;
  images?: images[];
  query?: string;
  language: string = 'en';

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.loadCategories();
    this.loadRecipes();
    this.isMobile = window.innerWidth <= 800;
    this.Filtering = window.innerWidth <= 1350;
  }

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private scrollLockService: ScrollLockService,
    private router: Router
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
  }

  loadRecipes() {
    const params: {
      page: number;
      size: number;
    } = {
      page: this.currentPage,
      size: this.pageSize,
    };

    this.http
      .get<{
        content: recipesRequest[];
        images: images[];
        totalPages: number;
      }>(this.url, { params })
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.content)) {
            this.recipesArray = response.content.filter(
              (recipe) => recipe.isPublic == true
            );
            this.totalPages = response.totalPages;
          } else {
            console.error(response);
            this.recipesArray = [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  applyFilters() {
    const params: any = {
      page: this.currentPage,
      size: this.pageSize,
    };

    const prepTimeTo = this.prepTimeTo ?? 99999;
    const prepTimeFrom = this.prepTimeFrom ?? 0;

    if (this.difficulty) params.difficulty = this.difficulty;
    if (prepTimeFrom || prepTimeTo) {
      params.prepareTime = `${prepTimeFrom}-${prepTimeTo}`;
    }
    if (this.servingsFrom !== undefined || this.servingsTo !== undefined) {
      const servingsFrom = this.servingsFrom ?? 0;
      const servingsTo = this.servingsTo ?? 99999;
      params.servings = `${servingsFrom}-${servingsTo}`;
    }
    if (this.category) params.category = this.category;
    if (this.query) params.query = this.query;

    console.log('Filters applied:', params);

    const endpoint = this.query ? `${this.url}/searchRecipes` : this.url;

    this.http.get<any>(endpoint, { params }).subscribe({
      next: (response) => {
        console.log('Response received:', response);

        if (response && Array.isArray(response.content)) {
          this.recipesArray = response.content;
          this.totalPages = response.totalPages;
        } else if (Array.isArray(response)) {
          this.recipesArray = response;
          this.totalPages = Math.ceil(response.length / this.pageSize);
        } else {
          console.error('Unexpected response format:', response);
          this.recipesArray = [];
        }

        if (this.recipesArray.length === 0) {
          console.log('No recipes found for the given filters.');
        }
      },
    });
  }

  loadCategories() {
    this.http
      .get<{ content: any[] }>('http://localhost:8080/api/recipes')
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.content)) {
            this.categoriesArray = Array.from(
              new Set(response.content.map((recipe) => recipe.category))
            ).sort();
          } else {
            console.error('Unexpected response format', response);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onFilterChange(filterName: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (filterName === 'prepTime') {
      const inputClass = (event.target as HTMLInputElement).classList;

      if (inputClass.contains('from')) {
        this.prepTimeFrom = value ? Number(value) : undefined;
      } else if (inputClass.contains('to')) {
        this.prepTimeTo = value ? Number(value) : undefined;
      }
    } else if (filterName === 'servings') {
      const inputClass = (event.target as HTMLInputElement).classList;

      if (inputClass.contains('from')) {
        this.servingsFrom = value ? Number(value) : undefined;
      } else if (inputClass.contains('to')) {
        this.servingsTo = value ? Number(value) : undefined;
      }
    } else {
      switch (filterName) {
        case 'difficulty':
          this.difficulty = Number(value);
          break;
        case 'category':
          this.category = value;
          break;
      }
    }

    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadRecipes();
  }

  getAverageRating(ratings: rating[]) {
    if (ratings.length === 0) {
      return 0;
    }
    return ratings.reduce((x, y) => x + y.value, 0);
  }

  getDifficulty(difficulty: number) {
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

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    this.query = value.trim();
    this.currentPage = 1;
    this.applyFilters();
  }

  openMenu() {
    const menu = this.el.nativeElement.querySelector('.menu');
    const menu_overlay = this.el.nativeElement.querySelector('.menu-overlay');
    if (menu_overlay) {
      menu_overlay.classList.add('active');
    }
    if (menu) {
      menu.classList.add('active');
      this.scrollLockService.lockScroll();
      this.Open = true;
    }
  }

  closeMenu() {
    const menu = this.el.nativeElement.querySelector('.menu');
    const menu_overlay = this.el.nativeElement.querySelector('.menu-overlay');
    if (menu_overlay) {
      menu_overlay.classList.remove('active');
    }
    if (menu) {
      menu.classList.remove('active');
      this.scrollLockService.unlockScroll();

      this.Open = false;
    }
  }

  Open: boolean = false;
  isMobile: boolean = false;
  Filtering: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800 ? true : false;
    this.Filtering = window.innerWidth <= 1350 ? true : false;
    if ((this.Open = window.innerWidth <= 1351)) {
      this.closeMenu();
    }
  }
}
