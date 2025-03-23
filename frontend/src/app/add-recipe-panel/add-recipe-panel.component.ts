import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-add-recipe-panel',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterSectionComponent, FormsModule],
  templateUrl: './add-recipe-panel.component.html',
  styleUrl: './add-recipe-panel.component.css',
})
export class AddRecipePanelComponent {
  ingredients: { name: string; quantity: number; unit: string }[] = [];
  steps: string[] = [];

  newIngredient = { name: '', quantity: 0, unit: 'Choose a unit' };
  newStep = '';
  fillAll = true;
  alreadyExists = false;
  fileSizeError = false;

  addIngredient() {
    const ingredientExists = this.ingredients.some(
      (ingredient) =>
        ingredient.name.toLowerCase() === this.newIngredient.name.toLowerCase()
    );
    if (ingredientExists) {
      this.alreadyExists = true;
      return;
    }
    if (
      this.newIngredient.name &&
      this.newIngredient.quantity > 0 &&
      this.newIngredient.unit &&
      this.newIngredient.unit !== 'Choose a unit'
    ) {
      this.fillAll = true;
      this.ingredients.push({ ...this.newIngredient });
      console.log(this.newIngredient);
    } else {
      this.fillAll = false;
    }
  }

  addStep() {
    if (this.newStep.trim()) {
      this.steps.push(this.newStep.trim());
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
    const fileName = document.querySelector('.image') as HTMLInputElement;

    if (fileName.files && fileName.files[0].size > 5242880) {
      this.fileSizeError = true;
      fileName.value = '';
    } else {
      this.fileSizeError = false;
    }
  }
}
