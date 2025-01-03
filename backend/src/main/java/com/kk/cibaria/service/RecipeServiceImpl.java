package com.kk.cibaria.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kk.cibaria.exception.RecipeNotFoundException;
import com.kk.cibaria.model.Ingredient;
import com.kk.cibaria.model.Rating;
import com.kk.cibaria.model.Recipe;
import com.kk.cibaria.model.Tag;
import com.kk.cibaria.model.User;
import com.kk.cibaria.repository.RecipeRepository;
import com.kk.cibaria.repository.UserRepository;

@Service
public class RecipeServiceImpl implements RecipeService {

  private RecipeRepository recipeRepository;
  private UserRepository userRepository;

  public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository) {
    this.recipeRepository = recipeRepository;
    this.userRepository = userRepository;
  }

  @Override
  public List<Recipe> getAll() {
    return recipeRepository.findAll();
  }

  @Override
  public Recipe getById(int id) {
    return recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));
  }

  @Override
  public Recipe save(Recipe recipe) {
    Recipe recipedb = recipeRepository.save(recipe);
    return recipedb;
  }

  @Override
  public Recipe update(int id, Recipe recipe) {
    Recipe recipeFound = recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));
    recipeFound.setId(id);
    recipeFound.setRecipeName(recipe.getRecipeName());
    recipeFound.setCreatedAt(recipe.getCreatedAt());
    recipeFound.setDifficulty(recipe.getDifficulty());

    recipeFound.getIngredients().clear();
    for (Ingredient ingredient : recipe.getIngredients()) {
      ingredient.setRecipe(recipeFound);
      recipeFound.getIngredients().add(ingredient);
    }

    recipeFound.setPrepareTime(recipe.getPrepareTime());
    recipeFound.setServings(recipe.getServings());
    recipeFound.setCategory(recipe.getCategory());

    recipeFound.getTag().clear();
    for (Tag tag : recipe.getTag()) {
      tag.setRecipe(recipeFound);
      recipeFound.getTag().add(tag);
    }
    recipeFound.getRatings().clear();
    for (Rating rating : recipe.getRatings()) {
      User user = userRepository.findById(rating.getUser().getId()).orElse(null);
      rating.setRecipe(recipeFound);
      rating.setUser(user);
      recipeFound.getRatings().add(rating);
    }

    return recipeRepository.save(recipeFound);
  }

  @Override
  public void delete(int id) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    if (recipe == null) {
      return;
    }

    recipeRepository.delete(recipe);
  }

}
