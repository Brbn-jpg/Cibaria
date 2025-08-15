import { RecipeService } from '../../services/recipe.service';
import {
  asNativeElements,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Recipe } from '../../Interface/recipe';
import { Ingredients } from '../../Interface/ingredients';
import { AuthService } from '../../services/auth.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recipe-detailed',
  standalone: true,
  imports: [RouterLink, ToastNotificationComponent, TranslateModule],
  templateUrl: './recipe-detailed.component.html',
  styleUrl: './recipe-detailed.component.css',
})
export class RecipeDetailedComponent implements OnInit {
  recipeId!: number;
  recipeDetails!: Recipe;
  ingredients: Ingredients[] = [];
  isFavourite: boolean = false;
  isProcessing: boolean = false;
  isLoggedIn: boolean = false;
  isOwner: boolean = false;
  showConfirmation: boolean = false;
  currentRating: number = 0;
  hoveredRating: number = 0;
  isRatingProcessing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipeService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.scrollToTop();
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      console.log('Recipe ID from params:', this.recipeId);

      if (this.recipeId) {
        this.loadRecipeDetails();
        if (this.isLoggedIn) {
          this.checkIfFavourite();
          this.loadUserRating();
        }
      } else {
        console.error('No recipe ID found in params');
      }
    });
    this.setupIntersectionObserver();
  }

  private checkOwnership(): void {
    if (!this.isLoggedIn || !this.recipeDetails) {
      this.isOwner = false;
      console.log(this.isOwner);
      return;
    }

    this.recipeService.isOwner(this.recipeDetails.id).subscribe({
      next: (isOwner) => {
        this.isOwner = isOwner;
        console.log('Is owner:', this.isOwner);
      },
      error: (err) => {
        console.error('Error checking ownership:', err);
        this.isOwner = false;
      },
    });
  }

  private checkIfFavourite(): void {
    if (!this.recipeId) {
      return;
    }

    this.recipeService.isFavourite(this.recipeId).subscribe({
      next: (response) => {
        console.log('Backend response for isFavourite:', response);
        this.isFavourite = response;
        this.updateFavouriteButton();
      },
      error: (err) => {
        console.error('Error checking if recipe is favourite:', err);
        this.isFavourite = false;
        this.updateFavouriteButton();
      },
    });
  }

  private loadRecipeDetails(): void {
    this.recipeService.loadRecipeDetails(this.recipeId).subscribe({
      next: (response) => {
        console.log('Recipe details loaded:', response);
        this.recipeDetails = response;
        this.ingredients = this.recipeDetails.ingredients.map((ingredient) => ({
          name: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }));
        this.checkOwnership();
      },
      error: (err) => {
        console.error('Error loading recipe details:', err);
      },
    });
  }

  private loadUserRating(): void {
    this.recipeService.getUserRating(this.recipeId).subscribe({
      next: (rating) => {
        this.currentRating = rating;
        this.updateStarDisplay(rating);
      },
      error: (err) => {
        this.currentRating = 0;
        this.updateStarDisplay(0);
      },
    });
  }

  private updateFavouriteButton(): void {
    const favButton = document.querySelector('path') as SVGPathElement;
    console.log('Updating favourite button, isFavourite:', this.isFavourite);
    if (favButton) {
      if (this.isFavourite) {
        favButton.classList.add('active');
      } else {
        favButton.classList.remove('active');
      }
    }
  }

  private setupIntersectionObserver(): void {
    const hiddenElements = document.querySelectorAll(
      '.hidden'
    ) as NodeListOf<HTMLElement>;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    hiddenElements.forEach((element: HTMLElement) => {
      observer.observe(element);
    });
  }

  check() {
    const inputs = document.querySelectorAll(
      'input'
    ) as NodeListOf<HTMLInputElement>;
    const labels = document.querySelectorAll(
      'label'
    ) as NodeListOf<HTMLLabelElement>;

    inputs.forEach((input, index) => {
      const label = labels[index];
      if (input.checked) {
        label.classList.add('checked');
      } else {
        label.classList.remove('checked');
      }
    });
  }

  toggleFavourite() {
    // Block further clicks while processing
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    if (!this.isFavourite) {
      this.recipeService.addToFavourites(this.recipeId).subscribe({
        next: (response) => {
          console.log('Successfully added to favourites');
          this.isFavourite = true;
          this.updateFavouriteButton();
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('Error adding recipe to favourites:', err);
          this.isProcessing = false;
        },
      });
    } else {
      this.recipeService.removeFromFavourites(this.recipeId).subscribe({
        next: (response) => {
          this.isFavourite = false;
          this.updateFavouriteButton();
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('Error removing recipe from favourites:', err);
          this.isProcessing = false;
        },
      });
    }
  }

  delete() {
    this.showConfirmation = true;
  }

  cancelDelete() {
    this.showConfirmation = false;
  }

  confirmDelete() {
    this.recipeService.deleteRecipe(this.recipeId).subscribe({
      next: (response) => {
        this.notificationService.success('Recipe has been deleted', 5000);
        this.notificationService.info('Refresh the site to see changes', 5000);
      },
      error: (err) => {
        this.notificationService.error('Error during deletion', 5000);
      },
    });
    this.cancelDelete();
  }

  // RATING STARS

  onStarHover(rating: number): void {
    this.hoveredRating = rating;
    this.updateStarDisplay(rating);
  }

  onStarsLeave(rating: number): void {
    this.hoveredRating = 0;
    this.updateStarDisplay(rating);
  }

  onStarClick(rating: number): void {
    if (this.isRatingProcessing || !this.isLoggedIn) {
      return;
    }

    this.isRatingProcessing = true;

    this.recipeService.rateRecipe(this.recipeId, rating).subscribe({
      next: (response) => {
        this.currentRating = rating;
        this.updateStarDisplay(rating);
        this.notificationService.success(
          `Recipe rated with ${rating} stars!`,
          5000
        );
        this.isRatingProcessing = false;
      },
      error: (err) => {
        this.notificationService.error('Error submitting rating', 5000);
        this.isRatingProcessing = false;
      },
    });
  }

  private updateStarDisplay(rating: number): void {
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById(`star-${i}`)?.querySelector('path');
      if (star) {
        if (i <= rating) {
          star.setAttribute('fill', '#FFD700');
          star.setAttribute('stroke', '#FFD700');
        } else {
          star.setAttribute('fill', 'none');
          star.setAttribute('stroke', 'white');
        }
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0 });
  }

  translateUnit(unit: string): string {
    const unitMap: { [key: string]: string } = {
      'tsp': 'ADD_RECIPE.UNITS.TSP',
      'tbsp': 'ADD_RECIPE.UNITS.TBSP',
      'pcs': 'ADD_RECIPE.UNITS.PCS',
      'g': 'ADD_RECIPE.UNITS.G',
      'kg': 'ADD_RECIPE.UNITS.KG',
      'ml': 'ADD_RECIPE.UNITS.ML',
      'L': 'ADD_RECIPE.UNITS.L'
    };

    const translationKey = unitMap[unit];
    if (translationKey) {
      return this.translateService.instant(translationKey);
    }
    return unit; // fallback to original unit if not found
  }
}
