package com.kk.cibaria.Recipe;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

  Recipe save(RecipeAddDto recipe) throws IOException;

  Recipe update(int id, Recipe recipe);

  RecipeRequestDto getRecipeByPage(int page, int size, List<String> category, Integer difficulty, String servings,
                                   String prepareTime);



  void delete(int id);

}
