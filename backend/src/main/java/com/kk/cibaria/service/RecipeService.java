package com.kk.cibaria.service;

import java.util.List;

import com.kk.cibaria.model.Recipe;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

}
