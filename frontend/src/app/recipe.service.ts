import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from './recipe-detailed/recipe-detailed.component';

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

  postRecipe(recipeData: FormData): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.post<any>(
      'http://localhost:8080/api/recipes',
      recipeData,
      { headers }
    );
  }
}
