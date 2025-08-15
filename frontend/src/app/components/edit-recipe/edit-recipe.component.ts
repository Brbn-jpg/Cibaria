import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Recipe } from '../../Interface/recipe';
import { Ingredients } from '../../Interface/ingredients';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, ToastNotificationComponent],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css',
})
export class EditRecipeComponent implements OnInit {
  isLoggedIn = false;
  recipeId!: number;
  isDragging = false;
  imagePreview: string | null = null;
  currentImageUrl: string | null = null;
  hasExistingImage = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getToken();

    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      if (this.recipeId) {
        this.loadRecipeDetails();
      }
    });
  }

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
    images: new FormControl<File | null>(null, [Validators.required]),
    isPublic: new FormControl(false, [Validators.required]),
    ingredients: new FormControl(''),
    quantity: new FormControl(0),
    unit: new FormControl(''),
    steps: new FormControl(''),
  });

  private loadRecipeDetails(): void {
    this.recipeService.loadRecipeDetails(this.recipeId).subscribe({
      next: (response) => {
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

        if (response.images && response.images.length > 0) {
          this.currentImageUrl = response.images[0].imageUrl;
          this.imagePreview = this.currentImageUrl;
          this.hasExistingImage = true;
          this.recipeForm.patchValue({
            images: null,
          });
        }
      },
      error: () => {
        this.notificationService.error('Failed to load recipe details', 5000);
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

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File) {
    if (file.size > 5242880) {
      this.notificationService.warning('The file size exceeds 5MB!', 5000);
      this.resetFile();
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.notificationService.warning('Please upload an image file!', 5000);
      this.resetFile();
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.imagePreview = result;

      this.recipeForm.patchValue({
        // update the form with the selected file
        images: file,
      });
    };

    reader.onerror = () => {
      this.notificationService.warning('Error reading file', 5000);
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      this.notificationService.warning('Error processing file', 5000);
      return;
    }

    this.notificationService.success(
      `Image "${file.name}" has been selected`,
      5000
    );
  }

  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const target = event.target as HTMLElement;
    const dropzone = target.closest('.dropzone');

    if (dropzone) {
      event.preventDefault();
      event.stopPropagation(); // stops the event from bubbling up
      this.isDragging = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    const target = event.target as HTMLElement;
    const dropzone = target.closest('.dropzone');

    if (dropzone && !dropzone.contains(event.relatedTarget as Node)) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    const target = event.target as HTMLElement;
    const dropzone = target.closest('.dropzone');

    if (dropzone) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;

      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        this.fileInput.nativeElement.files = dataTransfer.files;

        this.processFile(file);
      }
    }
  }

  resetFile(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.fileInput.nativeElement.value = '';
    this.recipeForm.patchValue({
      images: null,
    });
    this.imagePreview = null;
    this.currentImageUrl = null;
    this.hasExistingImage = false;
  }

  updateRecipe() {
    this.FailedToAdd = false;
    this.success = false;

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
    } else if (this.hasExistingImage && this.currentImageUrl) {
      formData.append('keepExistingImage', 'true');
    }

    this.recipeService.updateRecipe(formData, this.recipeId).subscribe({
      next: () => {
        this.success = true;
        this.FailedToAdd = false;
        this.notificationService.success('Recipe updated successfully!', 5000);
      },
      error: () => {
        this.FailedToAdd = true;
        this.success = false;
        this.notificationService.error('Failed to update recipe', 5000);
      },
    });
  }
}
