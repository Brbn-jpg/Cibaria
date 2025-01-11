import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RouterLink, FooterSectionComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {}
