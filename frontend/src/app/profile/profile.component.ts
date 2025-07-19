import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { images } from '../recipes/recipes.component';
import { ScrollLockService } from '../services/scroll-lock.service';
import { ProfileService } from '../services/profile.service';

export interface category {
  categoryName: string;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  photoUrl: string;
  backgroundUrl: string;
  favourites: FavouriteRecipe[];
}

export interface FavouriteRecipe {
  id: number;
  imageUrl: ImageUrl[];
  recipeName: string;
  servings: number;
  difficulty: number;
  prepareTime: number;
  category: string;
  ratings: number;
}

export interface ImageUrl {
  id: number;
  imageUrl: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterSectionComponent,
    MobileNavComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  url: string = 'http://localhost:8080/api/recipes';
  http = inject(HttpClient);
  el: ElementRef = inject(ElementRef);
  categoriesArray: category[] = [];

  userId!: number;
  favouriteRecipes: FavouriteRecipe[] = [];
  filteredFavouriteRecipes: FavouriteRecipe[] = [];

  currentPage: number = 1;
  pageSize: number = 12;
  difficulty?: number;
  prepTimeFrom?: number;
  prepTimeTo?: number;
  prepTime?: number;
  servingsFrom?: number;
  servingsTo?: number;
  category?: string;
  totalPages: number = 1;
  images?: images[];
  query?: string;
  language: string = 'en';
  username?: string;
  userPhotoUrl: string | null = null;
  backgroundImageUrl: string | null = null;

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.loadCategories();
    this.loadUserData();
    this.isMobile = window.innerWidth <= 800;
    this.Filtering = window.innerWidth <= 1350;
  }

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private scrollLockService: ScrollLockService,
    private profileService: ProfileService,
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

  applyFilters() {
    let filtered = [...this.favouriteRecipes];

    if (this.difficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === this.difficulty
      );
    }

    if (this.prepTimeFrom !== undefined || this.prepTimeTo !== undefined) {
      const prepTimeFrom = this.prepTimeFrom ?? 0;
      const prepTimeTo = this.prepTimeTo ?? 99999;
      filtered = filtered.filter(
        (recipe) =>
          recipe.prepareTime >= prepTimeFrom && recipe.prepareTime <= prepTimeTo
      );
    }

    if (this.servingsFrom !== undefined || this.servingsTo !== undefined) {
      const servingsFrom = this.servingsFrom ?? 0;
      const servingsTo = this.servingsTo ?? 99999;
      filtered = filtered.filter(
        (recipe) =>
          recipe.servings >= servingsFrom && recipe.servings <= servingsTo
      );
    }

    if (this.category) {
      filtered = filtered.filter((recipe) => recipe.category === this.category);
    }

    if (this.query) {
      const queryLower = this.query.toLowerCase();
      filtered = filtered.filter((recipe) =>
        recipe.recipeName.toLowerCase().includes(queryLower)
      );
    }

    this.filteredFavouriteRecipes = filtered;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
  }

  loadCategories() {
    if (this.favouriteRecipes.length > 0) {
      this.categoriesArray = Array.from(
        new Set(this.favouriteRecipes.map((recipe) => recipe.category))
      )
        .sort()
        .map((categoryName) => ({ categoryName }));
    }
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
  }

  getAverageRating(avgRating: number): number {
    return avgRating;
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

  onEditProfilePicture(event: Event) {
    this.profileService.editProfilePicture(this.userId, event);
  }

  onEditBackgroundPicture(event: Event) {
    this.profileService.editBackgroundPicture(this.userId, event);
  }

  loadUserData() {
    this.profileService.getUserProfile().subscribe({
      next: (response: UserProfileResponse) => {
        if (response) {
          this.userId = response.id;
          this.username = response.username;
          this.userPhotoUrl = response.photoUrl;
          this.backgroundImageUrl = response.backgroundUrl;
          this.favouriteRecipes = response.favourites;
          this.filteredFavouriteRecipes = [...this.favouriteRecipes];

          this.loadCategories();
        }
      },
    });
  }

  getFavouriteAverageRating(avgRating: number): number {
    return avgRating;
  }

  get paginatedFavouriteRecipes(): FavouriteRecipe[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredFavouriteRecipes.slice(startIndex, endIndex);
  }
}
