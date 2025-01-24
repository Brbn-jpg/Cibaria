import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Ingredients,
  Recipe,
} from './recipe-detailed/recipe-detailed.component';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  loadRecipeDetails(recipeId: number): Observable<Recipe> {
    return this.http.get<Recipe>(
      `http://localhost:8080/api/recipes/${recipeId}`
    );
  }
}
