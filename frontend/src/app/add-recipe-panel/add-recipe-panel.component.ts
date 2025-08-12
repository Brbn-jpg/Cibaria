import { Component, HostListener } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RecipeService } from '../services/recipe.service';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-add-recipe-panel',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterSectionComponent,
    FormsModule,
    ReactiveFormsModule,
    MobileNavComponent,
    ToastNotificationComponent,
  ],
  templateUrl: './add-recipe-panel.component.html',
  styleUrls: ['./add-recipe-panel.component.css'],
})
export class AddRecipePanelComponent {
  ingredients: { ingredientName: string; quantity: number; unit: string }[] =
    [];
  steps: { content: string }[] = [];
  recipeLanguage = 'english';
  isPublic = false;
  newIngredient = { ingredientName: '', quantity: 0, unit: 'Choose a unit' };
  newStep = '';
  success = false;

  constructor(
    private recipeService: RecipeService,
    private notificationService: NotificationService
  ) {}

  recipeForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    servings: new FormControl(1, [Validators.required, Validators.min(1)]),
    prepareTime: new FormControl(1, [Validators.required, Validators.min(1)]),
    quantity: new FormControl(this.ingredients, [Validators.required]),
    unit: new FormControl(this.ingredients, [Validators.required]),
    difficulty: new FormControl(1, [Validators.required]),
    images: new FormControl(null, [Validators.required]),
    steps: new FormControl(this.steps, [Validators.required]),
    ingredients: new FormControl(this.ingredients, [Validators.required]),
    isPublic: new FormControl(this.isPublic, [Validators.required]),
    language: new FormControl(this.recipeLanguage, [Validators.required]),
  });

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 800;

    this.getToken();
  }

  isLoggedIn = false;

  getToken(): void {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }

  addIngredient() {
    const ingredientExists = this.ingredients.some(
      (ingredient) =>
        ingredient.ingredientName.toLowerCase() ===
        this.newIngredient.ingredientName.toLowerCase()
    );
    if (ingredientExists) {
      this.notificationService.warning('This ingredient already exists!', 5000);
      return;
    }
    if (
      this.newIngredient.ingredientName &&
      this.newIngredient.quantity > 0 &&
      this.newIngredient.unit &&
      this.newIngredient.unit !== 'Choose a unit'
    ) {
      this.ingredients.push({ ...this.newIngredient });
    } else {
      this.notificationService.warning(
        'Fill all fields to add ingredient',
        5000
      );
    }
  }

  addStep() {
    if (this.newStep.trim()) {
      this.steps.push({ content: this.newStep.trim() });
      this.newStep = '';
    } else {
      this.notificationService.warning('Please enter a step', 5000);
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

    if (fileInput.files && fileInput.files[0].size > 5242880) {
      this.notificationService.warning('The file size exceeds 5MB!', 5000);
      fileInput.value = '';
    }
  }

  postRecipe() {
    if (!localStorage.getItem('token')) {
      this.notificationService.error('User is not logged in!', 5000);
    }

    if (this.recipeForm.pristine || this.recipeForm.untouched) {
      this.notificationService.error('Failed to add the recipe!', 5000);
      return;
    }

    const formData = new FormData();
    formData.append(
      'recipe',
      JSON.stringify({
        recipeName: this.recipeForm.value.title!,
        category: this.recipeForm.value.category!,
        difficulty: this.recipeForm.value.difficulty,
        servings: this.recipeForm.value.servings,
        prepareTime: this.recipeForm.value.prepareTime,
        ingredients: this.ingredients,
        steps: this.steps,
        isPublic: this.recipeForm.value.isPublic,
        language: this.recipeForm.value.language,
      })
    );

    const imageInput = document.querySelector('.image') as HTMLInputElement;
    const images = new FileReader();
    if (imageInput.files && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      let imageFile = null;
      images.onload = (e: any) => {
        imageFile = e.target.result;
      };
      images.readAsDataURL(file);
      formData.append('images', file);
    }

    this.recipeService.postRecipe(formData).subscribe({
      next: (response) => {
        this.notificationService.success('Recipe has been created', 5000);
      },
      error: (err) => {
        this.notificationService.error('Failed to add the recipe!', 5000);
      },
    });
  }

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
