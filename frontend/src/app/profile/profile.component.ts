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
import { LanguageService } from '../language.service';
import { images } from '../recipes/recipes.component';
import { ScrollLockService } from '../scroll-lock.service';

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
}

export interface rating {
  ratingId: number;
  value: number;
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
  urlUser: string = 'http://localhost:8080/api/users/aboutme';
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
  totalPages: number = 1;
  images?: images[];
  query?: string;
  language: string = 'en';
  username?: string;

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.loadCategories();
    this.loadRecipes();
    // this.loadUserData();
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
            this.recipesArray = response.content;
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

  editProfilePicture(event: Event) {
    // TODO: Implement posting it to the backend
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5 MB limit.');
          return;
        } else {
          const reader = new FileReader();
          console.log('File selected:', file);
          reader.onload = () => {
            const profilePicture = document.querySelector('.profile-picture');
            if (profilePicture) {
              profilePicture.setAttribute('src', reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };
    fileInput.click();
  }

  editBackgroundPicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5 MB limit.');
          return;
        } else {
          const reader = new FileReader();
          console.log('File selected:', file);
          reader.onload = () => {
            const profilePicture = document.querySelector('.background-image');
            if (profilePicture) {
              profilePicture.setAttribute('src', reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };
    fileInput.click();
  }

  // TODO: Uncomment this method when the backend is ready to handle user data

  // loadUserData() {
  //   this.http.get<any>(this.urlUser, { withCredentials: true }).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         const profilePicture = document.querySelector('.profile-picture');
  //         const backgroundImage = document.querySelector('.background-image');
  //         const usernameElement = document.querySelector('.username');
  //         if (profilePicture && response.profilePicture) {
  //           profilePicture.setAttribute('src', response.profilePicture);
  //         }
  //         if (backgroundImage && response.backgroundImage) {
  //           backgroundImage.setAttribute('src', response.backgroundImage);
  //         }
  //         if (usernameElement && response.username) {
  //           usernameElement.textContent = response.username;
  //           this.username = response.username;
  //         }
  //       } else {
  //         console.error('No user data found');
  //       }
  //     },
  //   });
  // }
}
