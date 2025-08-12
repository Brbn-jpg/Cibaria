import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Language } from '../Interface/language';
import { NotificationService } from '../services/notification.service';
import { ScrollLockService } from '../services/scroll-lock.service';
import { FilterService } from '../services/filter.service';
import { FilterState } from '../Interface/filter-state';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-recipe-filters',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './recipe-filters.component.html',
  styleUrl: './recipe-filters.component.css',
})
export class RecipeFiltersComponent implements OnInit, OnDestroy {
  @Input() isMobileFiltering = false;
  @Output() filtersChanged = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private el: ElementRef = inject(ElementRef);

  searchQuery = '';
  prepTimeFrom?: number;
  prepTimeTo?: number;
  servingsFrom?: number;
  servingsTo?: number;
  selectedCategory = '';
  selectedDifficulty: string = '';
  selectedLanguage = '';

  categoriesArray: string[] = [];
  languagesArray: Language[] = [];

  isMenuOpen = false;

  constructor(
    private filterService: FilterService,
    private notificationService: NotificationService,
    private scrollLockService: ScrollLockService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadLanguages();
    this.loadCurrentFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories(): void {
    this.filterService
      .loadCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categoriesArray = categories;
        },
        error: () => {
          this.notificationService.error('Failed to load categories', 5000);
        },
      });
  }

  private loadLanguages(): void {
    this.filterService
      .loadLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (languages) => {
          this.languagesArray = languages;
        },
        error: () => {
          this.notificationService.error('Failed to load languages', 5000);
        },
      });
  }

  private loadCurrentFilters(): void {
    const currentFilters = this.filterService.currentFilters;

    this.searchQuery = currentFilters.query || '';
    this.prepTimeFrom = currentFilters.prepTimeFrom;
    this.prepTimeTo = currentFilters.prepTimeTo;
    this.servingsFrom = currentFilters.servingsFrom;
    this.servingsTo = currentFilters.servingsTo;
    this.selectedCategory = currentFilters.category || '';
    this.selectedDifficulty = currentFilters.difficulty
      ? currentFilters.difficulty.toString()
      : ''; // Convert to string for select binding
    this.selectedLanguage = currentFilters.recipeLanguage || '';
  }

  onSearchChange(): void {
    this.updateFilters();
  }

  onFilterChange(): void {
    this.updateFilters();
  }

  private updateFilters(): void {
    const filters: Partial<FilterState> = {
      query: this.searchQuery,
      prepTimeFrom: this.prepTimeFrom,
      prepTimeTo: this.prepTimeTo,
      servingsFrom: this.servingsFrom,
      servingsTo: this.servingsTo,
      category: this.selectedCategory || undefined,
      difficulty:
        this.selectedDifficulty === '' ? undefined : +this.selectedDifficulty, // Convert to number if not empty
      recipeLanguage: this.selectedLanguage || undefined,
      currentPage: 1,
    };

    this.filterService.updateFilters(filters);
    this.filtersChanged.emit();
  }

  openMenu(): void {
    const menu = this.el.nativeElement.querySelector('.menu');
    const menuOverlay = this.el.nativeElement.querySelector('.menu-overlay');

    if (menuOverlay) {
      menuOverlay.classList.add('active');
    }
    if (menu) {
      menu.classList.add('active');
      this.scrollLockService.lockScroll();
      this.isMenuOpen = true;
    }
  }

  closeMenu(): void {
    const menu = this.el.nativeElement.querySelector('.menu');
    const menuOverlay = this.el.nativeElement.querySelector('.menu-overlay');

    if (menuOverlay) {
      menuOverlay.classList.remove('active');
    }
    if (menu) {
      menu.classList.remove('active');
      this.scrollLockService.unlockScroll();
      this.isMenuOpen = false;
    }
  }
}
