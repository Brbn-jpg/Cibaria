import { Component, HostListener, OnInit } from '@angular/core';
import { Recipe } from '../Interface/recipe';
import { Ingredients } from '../Interface/ingredients';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterSectionComponent,
    MobileNavComponent,
  ],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css',
})
export class EditRecipeComponent implements OnInit {
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 800;
    this.getToken();

    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      if (this.recipeId) {
        this.loadRecipeDetails();
      }
    });
  }

  isLoggedIn = false;
  recipeId!: number;

  getToken(): void {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }

  recipeDetails!: Recipe;
  ingredients: Ingredients[] = [];
  steps: { content: string }[] = [];
  isPublic = false;
  newIngredient = { ingredientName: '', quantity: 0, unit: '' };
  newStep = '';
  fillAll = true;
  alreadyExists = false;
  fileSizeError = false;
  FailedToAdd = false;
  success = false;

  recipeForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    servings: new FormControl(1, [Validators.required, Validators.min(1)]),
    prepareTime: new FormControl(1, [Validators.required, Validators.min(1)]),
    difficulty: new FormControl(1, [Validators.required]),
    images: new FormControl(null),
    isPublic: new FormControl(false, [Validators.required]),
    ingredients: new FormControl(''),
    quantity: new FormControl(0),
    unit: new FormControl(''),
    steps: new FormControl(''),
  });

  private loadRecipeDetails(): void {
    this.recipeService.loadRecipeDetails(this.recipeId).subscribe({
      next: (response) => {
        console.log('Recipe details loaded:', response);
        this.recipeDetails = response;

        this.recipeForm.patchValue({
          title: response.recipeName,
          category: response.category,
          servings: response.servings,
          prepareTime: response.prepareTime,
          difficulty: response.difficulty,
          isPublic: response.isPublic,
        });

        this.ingredients = this.recipeDetails.ingredients.map((ingredient) => ({
          name: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }));

        this.steps = this.recipeDetails.steps.map((step) => ({
          content: Array.isArray(step.content)
            ? step.content.join(' ')
            : step.content,
        }));

        this.isPublic = response.isPublic;
      },
      error: (err) => {
        console.error('Error loading recipe details:', err);
      },
    });
  }

  addIngredient() {
    this.alreadyExists = false;
    this.fillAll = true;

    const ingredientName = this.recipeForm.get('ingredients')?.value || '';
    const quantity = this.recipeForm.get('quantity')?.value || 0;
    const unit = this.recipeForm.get('unit')?.value || '';

    const ingredientExists = this.ingredients.some(
      (ingredient) =>
        ingredient.name.toLowerCase() === ingredientName.toLowerCase()
    );

    if (ingredientExists) {
      this.alreadyExists = true;
      return;
    }

    if (ingredientName && quantity > 0 && unit && unit !== 'Choose a unit') {
      this.ingredients.push({
        name: ingredientName,
        quantity: quantity,
        unit: unit,
      });

      this.recipeForm.patchValue({
        ingredients: '',
        quantity: 0,
        unit: '',
      });
    } else {
      this.fillAll = false;
    }
  }

  addStep() {
    const stepContent = this.recipeForm.get('steps')?.value || '';

    if (stepContent.trim()) {
      this.steps.push({ content: stepContent.trim() });
      this.recipeForm.patchValue({ steps: '' });
    } else {
      alert('Please enter a step.');
    }
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
  }

  validateFileSize() {
    const fileInput = document.querySelector('.image') as HTMLInputElement;

    if (
      fileInput.files &&
      fileInput.files[0] &&
      fileInput.files[0].size > 5242880
    ) {
      this.fileSizeError = true;
      fileInput.value = '';
    } else {
      this.fileSizeError = false;
    }
  }

  updateRecipe() {
    this.FailedToAdd = false;
    this.success = false;
    console.log(localStorage.getItem('token'));

    // if (!this.recipeForm.valid) {
    //   this.FailedToAdd = true;
    //   console.log('Form is invalid:', this.recipeForm.errors);
    //   return;
    // }

    if (this.ingredients.length === 0) {
      this.FailedToAdd = true;
      alert('Please add at least one ingredient.');
      return;
    }

    if (this.steps.length === 0) {
      this.FailedToAdd = true;
      alert('Please add at least one step.');
      return;
    }

    const formData = new FormData();

    const recipeData = {
      recipeName: this.recipeForm.value.title!,
      category: this.recipeForm.value.category!,
      difficulty: Number(this.recipeForm.value.difficulty),
      servings: Number(this.recipeForm.value.servings),
      prepareTime: Number(this.recipeForm.value.prepareTime),
      ingredients: this.ingredients.map((ingredient) => ({
        ingredientName: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      steps: this.steps,
      isPublic: this.recipeForm.value.isPublic,
    };

    formData.append('recipe', JSON.stringify(recipeData));

    const imageInput = document.querySelector('.image') as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      formData.append('images', file);
    }

    console.log('Sending FormData:', formData);
    console.log('Recipe data:', recipeData);

    this.recipeService.updateRecipe(formData, this.recipeId).subscribe({
      next: (response) => {
        console.log('Recipe updated successfully:', response);
        this.success = true;
        this.FailedToAdd = false;
      },
      error: (err) => {
        console.error('Error updating recipe:', err);
        this.FailedToAdd = true;
        this.success = false;
      },
    });
  }

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
