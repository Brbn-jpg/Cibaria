import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { ScrollLockService } from '../services/scroll-lock.service';
import { ProfileService } from '../services/profile.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { SettingsProfileComponent } from '../settings-profile/settings-profile.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

export interface category {
  categoryName: string;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  photoUrl: string;
  backgroundUrl: string;
  description: string;
}

export interface UserFavouritesResponse {
  favourites: FavouriteRecipe[];
}

export interface UserRecipesResponse {
  userRecipes: UserRecipe[];
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

export interface UserRecipe {
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
    FormsModule,
    EditProfileComponent,
    SettingsProfileComponent,
    ToastNotificationComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  el: ElementRef = inject(ElementRef);
  categoriesArray: category[] = [];

  userId!: number;
  favouriteRecipes: FavouriteRecipe[] = [];
  filteredFavouriteRecipes: FavouriteRecipe[] = [];

  userRecipe: UserRecipe[] = [];
  filteredUserRecipes: UserRecipe[] = [];

  activeTab: 'favourites' | 'userRecipes' = 'favourites';

  currentPage: number = 1;
  pageSize: number = 12;
  difficulty?: number;
  prepTimeFrom?: number;
  prepTimeTo?: number;
  servingsFrom?: number;
  servingsTo?: number;
  category?: string;
  totalPages: number = 1;
  query?: string;
  language: string = 'en';
  username?: string;
  userPhotoUrl: string | null = null;
  backgroundImageUrl: string | null = null;
  description?: string;

  editMode: boolean = false;
  settings: boolean = false;

  Open: boolean = false;
  isMobile: boolean = false;
  Filtering: boolean = false;

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

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.loadCategories();
    this.loadUserData();
    this.loadUserRecipes();
    this.loadUserFavourites();

    this.profileService.editMode$.subscribe((value) => {
      this.editMode = value;
    });

    this.profileService.settingsMode$.subscribe((value) => {
      this.settings = value;
    });

    this.isMobile = window.innerWidth <= 800;
    this.Filtering = window.innerWidth <= 1350;
  }

  applyFilters() {
    let filtered: FavouriteRecipe[] | UserRecipe[] = [];

    if (this.activeTab === 'favourites') {
      filtered = [...this.favouriteRecipes];
    } else if (this.activeTab === 'userRecipes') {
      filtered = [...this.userRecipe];
    }

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

    if (this.activeTab === 'favourites') {
      this.filteredFavouriteRecipes = filtered as FavouriteRecipe[];
      this.totalPages = Math.ceil(
        this.filteredFavouriteRecipes.length / this.pageSize
      );
    } else if (this.activeTab === 'userRecipes') {
      this.filteredUserRecipes = filtered as UserRecipe[];
      this.totalPages = Math.ceil(
        this.filteredUserRecipes.length / this.pageSize
      );
    }
  }

  setActiveTab(tab: 'favourites' | 'userRecipes') {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadCategories();
    this.applyFilters();
  }

  loadCategories() {
    const source =
      this.activeTab === 'favourites' ? this.favouriteRecipes : this.userRecipe;

    if (source.length > 0) {
      this.categoriesArray = Array.from(
        new Set(source.map((recipe) => recipe.category))
      )
        .sort()
        .map((categoryName) => ({ categoryName }));
    } else {
      this.categoriesArray = [];
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
    this.Filtering = window.innerWidth <= 1350;
    if (window.innerWidth <= 1351 && this.Open) {
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
          this.description = response.description;
        }
      },
    });
  }

  loadUserRecipes() {
    this.profileService.getUserRecipes().subscribe({
      next: (response: UserRecipesResponse) => {
        console.log('UserRecipes response:', response);
        if (response && response.userRecipes) {
          this.userRecipe = response.userRecipes;
          this.filteredUserRecipes = [...this.userRecipe];
          this.loadCategories();
        }
      },
      error: (error) => {
        this.userRecipe = [];
        this.filteredUserRecipes = [];
      },
    });
  }

  loadUserFavourites() {
    this.profileService.getUserFavourites().subscribe({
      next: (response: UserFavouritesResponse) => {
        console.log('FavouriteREcipes response:', response);

        if (response) {
          this.favouriteRecipes = response.favourites || [];
          this.filteredFavouriteRecipes = [...this.favouriteRecipes];
          this.loadCategories();
        }
      },
      error: (error) => {
        this.favouriteRecipes = [];
        this.filteredFavouriteRecipes = [];
      },
    });
  }

  editProfile(event: Event) {
    event.preventDefault();
    const newState = !this.profileService.getEditMode();
    this.profileService.setEditMode(newState);
  }

  editSettings(event: Event) {
    event.preventDefault();
    const newState = !this.profileService.getSettingsMode();
    this.profileService.setSettingsMode(newState);
  }

  get paginatedFavouriteRecipes(): FavouriteRecipe[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredFavouriteRecipes.slice(startIndex, endIndex);
  }

  get paginatedUserRecipes(): UserRecipe[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUserRecipes.slice(startIndex, endIndex);
  }
}
