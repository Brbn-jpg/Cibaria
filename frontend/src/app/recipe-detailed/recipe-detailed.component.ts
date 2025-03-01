import { RecipeService } from '../recipe.service';
import { Component, OnInit } from '@angular/core';
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
}

export interface Ingredients {
  name: string;
  quantity: number;
  unit: string;
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

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      if (this.recipeId) {
        this.recipeService.loadRecipeDetails(this.recipeId).subscribe({
          next: (response) => {
            this.recipeDetails = response;
            this.ingredients = this.recipeDetails.ingredients.map(
              (ingredient) => ({
                name: ingredient.ingredientName,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
              })
            );
            // console.log('Recipe details loaded:', this.recipeDetails);
            // console.log('Ingredients:', this.ingredients);
          },
          error: (err) => {
            console.error('Error loading recipe details:', err);
          },
        });
      }
    });
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

  addToFav() {
    const favButton = document.querySelector('path') as SVGPathElement;
    favButton.classList.toggle('active');
  }
}
