package com.kk.cibaria.service;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.model.Recipe;
import org.springframework.data.domain.Page;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

  Recipe save(RecipeAddDto recipe) throws IOException;

  Recipe update(int id, Recipe recipe);

  List<Recipe> getRecipeByPage(int page, int size, List<String> category,Integer difficulty,Integer servings,
                               Integer prepareTime);



  void delete(int id);

}
