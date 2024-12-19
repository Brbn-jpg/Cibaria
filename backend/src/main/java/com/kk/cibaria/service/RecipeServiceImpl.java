package com.kk.cibaria.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.kk.cibaria.model.Ingredient;
import com.kk.cibaria.model.Recipe;
import com.kk.cibaria.repository.RecipeRepository;

@Service
public class RecipeServiceImpl implements RecipeService {

  private RecipeRepository recipeRepository;

  public RecipeServiceImpl(RecipeRepository recipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  @Override
  public List<Recipe> getAll() {
    return recipeRepository.findAll();
  }

  @Override
  public Recipe getById(int id) {
    return recipeRepository.findById(id).orElse(null);
  }

  @Override
  public Recipe save(Recipe recipe) {
    System.out.println(recipe.getRecipeName());
    System.out.println(recipe.getIngredients());
    System.out.println(recipe.getRatings());
    for (Ingredient ingredient : recipe.getIngredients()) {
      System.out.println(ingredient.getIngredientName());
    }
    Recipe recipedb = recipeRepository.save(recipe);
    System.out.println(recipedb.getCategory());
    return recipedb;
  }

}
