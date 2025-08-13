import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import {
  FormsModule,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
export class AddRecipePanelComponent implements OnInit {
  ingredients: { ingredientName: string; quantity: number; unit: string }[] =
    [];
  steps: { content: string }[] = [];
  recipeLanguage = 'english';
  isPublic = false;
  newIngredient = { ingredientName: '', quantity: 0, unit: 'Choose unit' };
  newStep = '';
  success = false;
  isDragging = false;
  imagePreview: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private recipeService: RecipeService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {}

  recipeForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    servings: new FormControl(null, [Validators.required, Validators.min(1)]),
    prepareTime: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    quantity: new FormControl(this.ingredients, [Validators.required]),
    unit: new FormControl(this.ingredients, [Validators.required]),
    difficulty: new FormControl(null, [Validators.required]),
    images: new FormControl<File | null>(null, [Validators.required]),
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

    if (
      this.fileInput.nativeElement.files &&
      this.fileInput.nativeElement.files.length > 0
    ) {
      const file = this.fileInput.nativeElement.files[0];
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
