package com.kk.cibaria.recipe;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import com.kk.cibaria.user.UserEntity;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

  Recipe save(RecipeAddDto recipe) throws IOException;

  Recipe update(int id, Recipe recipe);

  RecipeRequestDto getRecipeByPage(int page, int size, List<String> category, Integer difficulty, String servings,
                                   String prepareTime);

  UserEntity addRecipeToFavourites(String token, int recipeId);

  UserEntity deleteRiceFromFavourites(String token, int recipeId);

  void delete(int id);

}
