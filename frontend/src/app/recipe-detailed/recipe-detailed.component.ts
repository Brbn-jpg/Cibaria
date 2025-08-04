import { RecipeService } from '../services/recipe.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Recipe } from '../Models/recipe';
import { Ingredients } from '../Models/ingredients';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recipe-detailed',
  standalone: true,
  imports: [
    FooterSectionComponent,
    NavbarComponent,
    RouterLink,
    MobileNavComponent,
  ],
  templateUrl: './recipe-detailed.component.html',
  styleUrl: './recipe-detailed.component.css',
})
export class RecipeDetailedComponent implements OnInit {
  recipeId!: number;
  recipeDetails!: Recipe;
  ingredients: Ingredients[] = [];
  isFavourite: boolean = false;
  isMobile: boolean = false;
  isProcessing: boolean = false;
  isLoggedIn: boolean = false;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      console.log('Recipe ID from params:', this.recipeId);

      if (this.recipeId) {
        this.checkIfFavourite();
        this.loadRecipeDetails();
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
          console.log('Successfully removed from favourites');
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
