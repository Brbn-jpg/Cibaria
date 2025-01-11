import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { FooterSectionComponent } from '../footer-section/footer-section.component';

export interface recipesRequest {
  recipeName: string;
  difficulty: number;
  prepareTime: number;
  servings: number;
}

export interface tokenResponse {
  token: string;
  tokenType: string;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RouterLink, FooterSectionComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  url: string = 'http://localhost:8080/api/recipes';
  http = inject(HttpClient);

  recipes() {
    this.http.get<tokenResponse>(this.url).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.recipes();
  }
}
