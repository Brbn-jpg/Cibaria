package com.kk.cibaria.service;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.model.Recipe;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

  Recipe save(RecipeAddDto recipe) throws IOException;

  Recipe update(int id, Recipe recipe);

  void delete(int id);

}
