import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-add-recipe-panel',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterSectionComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-recipe-panel.component.html',
  styleUrls: ['./add-recipe-panel.component.css'],
})
export class AddRecipePanelComponent {
  ingredients: { ingredientName: string; quantity: number; unit: string }[] =
    [];
  steps: { content: string }[] = [];

  newIngredient = { ingredientName: '', quantity: 0, unit: 'Choose a unit' };
  newStep = '';
  fillAll = true;
  alreadyExists = false;
  fileSizeError = false;
  FailedToAdd = false;

  constructor(private recipeService: RecipeService) {}

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
  });

  ngOnInit(): void {
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
      this.alreadyExists = true;
      return;
    }
    if (
      this.newIngredient.ingredientName &&
      this.newIngredient.quantity > 0 &&
      this.newIngredient.unit &&
      this.newIngredient.unit !== 'Choose a unit'
    ) {
      this.fillAll = true;
      this.ingredients.push({ ...this.newIngredient });
      console.log(this.ingredients);
    } else {
      this.fillAll = false;
    }
  }

  addStep() {
    if (this.newStep.trim()) {
      this.steps.push({ content: this.newStep.trim() });
      console.log(this.steps);
      this.newStep = '';
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

    if (fileInput.files && fileInput.files[0].size > 5242880) {
      this.fileSizeError = true;
      fileInput.value = '';
    } else {
      this.fileSizeError = false;
    }
  }

  postRecipe() {
    if (!localStorage.getItem('token')) {
      console.error('Użytkownik nie jest zalogowany!');
    }

    // if (this.recipeForm.invalid) {
    //   console.error('Formularz zawiera błędy!');
    //   this.FailedToAdd = true;
    //   return;
    // }

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
      })
    );

    const imageInput = document.querySelector('.image') as HTMLInputElement;
    const images = new FileReader();
    if (imageInput.files && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      let imageFile = null;
      console.log('dupa');
      images.onload = (e: any) => {
        imageFile = e.target.result;
      };
      images.readAsDataURL(file);
      formData.append('images', file);
    }
    console.log(formData);

    this.recipeService.postRecipe(formData).subscribe({
      next: (response) => {
        console.log('Przepis został dodany pomyślnie!', response);
      },
      error: (err) => {
        console.error('Wystąpił błąd podczas dodawania przepisu', err);
      },
    });
  }
}
