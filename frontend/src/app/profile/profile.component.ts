import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink, NavbarComponent, FooterSectionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  url: string = 'http://localhost:8080/api/recipes';
  http = inject(HttpClient);
  categoriesArray: category[] = [];
  recipesArray: recipesRequest[] = [];
  totalItems: recipesRequest[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  difficulty?: number;
  prepTimeFrom?: number;
  prepTimeTo?: number;
  prepTime?: number;
  servings?: number;
  category?: string;
  totalPages: number = 0;

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.isMobile = window.innerWidth <= 800;
    this.loadCategories();
    this.loadRecipes();
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
      params.prepareTime = `${prepTimeFrom || 0}-${prepTimeTo || ''}`;
    }
    if (this.servings) params.servings = this.servings;
    if (this.category) params.category = this.category;

    this.http
      .get<{
        content: recipesRequest[];
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
    const value = (event.target as HTMLSelectElement).value;

    if (filterName === 'prepTime') {
      const inputClass = (event.target as HTMLInputElement).classList;

      if (inputClass.contains('from')) {
        this.prepTimeFrom = value ? Number(value) : undefined;
      } else if (inputClass.contains('to')) {
        this.prepTimeTo = value ? Number(value) : undefined;
      }
    } else {
      switch (filterName) {
        case 'difficulty':
          this.difficulty = Number(value);
          break;
        case 'servings':
          this.servings = Number(value);
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
  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
