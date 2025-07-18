import { RecipeService } from '../services/recipe.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Recipe {
  category: string;
  difficulty: number;
  prepareTime: number;
  recipeId: number;
  recipeName: string;
  servings: number;
  ingredients: {
    ingredientName: string;
    quantity: number;
    unit: string;
  }[];
  steps: step[];
  images: images[];
}

export interface Ingredients {
  name: string;
  quantity: number;
  unit: string;
}

export interface images {
  imageUrl: string;
  publicId: string;
}

export interface step {
  content: string[];
}

@Component({
  selector: 'app-recipe-detailed',
  standalone: true,
  imports: [FooterSectionComponent, NavbarComponent],
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

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;

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
    // Use this.isFavourite as the source of truth
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
