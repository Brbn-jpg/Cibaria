import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe-detailed/recipe-detailed.component';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:8080/api/recipes';
  loadRecipeDetails(recipeId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.url}/${recipeId}`);
  }

  postRecipe(recipeData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http.post<any>(this.url, recipeData);
  }

  isFavourite(recipeId: number): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    const params = new HttpParams().set('recipeId', recipeId.toString());

    return this.http.get<boolean>(`${this.url}/favourites/isFavourite`, {
      headers,
      params,
    });
  }

  addToFavourites(recipeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    return this.http.post<any>(
      this.url + '/favourites/add',
      { recipeId },
      { headers }
    );
  }

  removeFromFavourites(recipeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    return this.http.post<any>(
      this.url + '/favourites/delete',
      { recipeId },
      { headers }
    );
  }
}
