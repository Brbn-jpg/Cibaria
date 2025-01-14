import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { FooterSectionComponent } from '../footer-section/footer-section.component';

export interface recipesRequest {
  recipeName: string;
  difficulty: number;
  prepareTime: number;
  servings: number;
  ratings: rating[];
}

export interface rating {
  ratingId: number;
  value: number;
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
  recipesArray: recipesRequest[] = [];
  totalItems: recipesRequest[] = [];
  currentPage: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;

  ngOnInit() {
    this.loadRecipes();
    this.recipes();
  }

  loadRecipes() {
    const params: { page: number; size: number } = {
      page: this.currentPage,
      size: this.pageSize,
    };

    const url = `${this.url}?${params.page}&${params.size}`;

    this.http.get<recipesRequest[]>(url, { params }).subscribe({
      next: (response) => {
        this.recipesArray = response;
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadRecipes();
  }

  recipes() {
    this.http.get<recipesRequest[]>(this.url).subscribe({
      next: (response) => {
        console.log(response);
        this.totalItems = response;
        this.totalPages = Math.round(this.totalItems.length / this.pageSize);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getAverageRating(ratings: rating[]) {
    if (ratings.length === 0) {
      return 0;
    }
    return ratings.reduce((x, y) => x + y.value, 0);
  }

  getDifficulty(difficulty: number) {
    switch (difficulty) {
      case 1:
        return 'easy';
      case 2:
        return 'medium';
      case 3:
        return 'hard';
      default:
        return 'no value';
    }
  }

  // fillFigure(data: recipesRequest) {
  //   console.log(data);
  //   const figure = document.createElement('figure');
  //   figure.classList.add('recipe');
  //   const imageWrapper = document.createElement('div');
  //   imageWrapper.classList.add('imageWrapper');

  //   const recipeImage = document.createElement('img');
  //   recipeImage.classList.add('recipe-image');
  //   recipeImage.src = 'images/gallery/gallery1.webp';

  //   const h2 = document.createElement('h2');
  //   h2.classList.add('recipe-name');
  //   h2.innerHTML = data.recipeName;

  //   const recipeDesc = document.createElement('div');
  //   recipeDesc.classList.add('recipe-desc');

  //   const ratingDiv = document.createElement('div');
  //   ratingDiv.classList.add('recipe-rating');
  //   ratingDiv.classList.add('recipe-desc-inner');

  //   const starIcon = document.createElement('img');
  //   starIcon.classList.add('icon');
  //   starIcon.src = 'images/icons/star-outline.svg';
  //   starIcon.alt = 'rating icon';

  //   let averageRating = 'No ratings';
  //   if (data.ratings && data.ratings.length > 0) {
  //     const sum = data.ratings.reduce((acc, curr: any) => acc + curr.value, 0);
  //     averageRating = (sum / data.ratings.length).toFixed(1);
  //   }

  //   const rating = document.createElement('span');
  //   rating.innerHTML = averageRating;

  //   const difficultyDiv = document.createElement('div');
  //   difficultyDiv.classList.add('recipe-difficulty');
  //   difficultyDiv.classList.add('recipe-desc-inner');

  //   const chartIcon = document.createElement('img');
  //   chartIcon.classList.add('icon');
  //   chartIcon.src = 'images/icons/bar-chart-outline.svg';
  //   chartIcon.alt = 'difficulty icon';

  //   let difficulty = document.createElement('span');
  //   if (data.difficulty === 1) {
  //     difficulty.innerHTML = 'easy';
  //   } else if (data.difficulty === 2) {
  //     difficulty.innerHTML = 'medium';
  //   } else if (data.difficulty === 3) {
  //     difficulty.innerHTML = 'hard';
  //   }

  //   const servingsDiv = document.createElement('div');
  //   servingsDiv.classList.add('recipe-servings');
  //   servingsDiv.classList.add('recipe-desc-inner');

  //   const servingsIcon = document.createElement('img');
  //   servingsIcon.classList.add('icon');
  //   servingsIcon.src = 'images/icons/restaurant-outline.svg';
  //   servingsIcon.alt = 'servings icon';

  //   const servingsSize = document.createElement('span');
  //   servingsSize.innerHTML = `${data.servings.toString()} servings`;

  //   const prepareTimeDiv = document.createElement('div');
  //   prepareTimeDiv.classList.add('recipe-time');
  //   prepareTimeDiv.classList.add('recipe-desc-inner');

  //   const timeIcon = document.createElement('img');
  //   timeIcon.classList.add('icon');
  //   timeIcon.src = 'images/icons/time-outline.svg';
  //   timeIcon.alt = 'prepare time icon';

  //   const time = document.createElement('span');
  //   time.innerHTML = `${data.prepareTime} minutes`;

  //   figure.appendChild(imageWrapper);
  //   imageWrapper.appendChild(recipeImage);
  //   figure.appendChild(h2);
  //   figure.appendChild(recipeDesc);
  //   recipeDesc.appendChild(ratingDiv);
  //   ratingDiv.appendChild(starIcon);
  //   ratingDiv.appendChild(rating);
  //   recipeDesc.appendChild(difficultyDiv);
  //   difficultyDiv.appendChild(chartIcon);
  //   difficultyDiv.appendChild(difficulty);
  //   recipeDesc.appendChild(servingsDiv);
  //   servingsDiv.appendChild(servingsIcon);
  //   servingsDiv.appendChild(servingsSize);
  //   recipeDesc.appendChild(prepareTimeDiv);
  //   prepareTimeDiv.appendChild(timeIcon);
  //   prepareTimeDiv.appendChild(time);
  //   document.querySelector('.recipes.grid-4-cols')?.appendChild(figure);
  //   console.log(figure);
  // }
}
