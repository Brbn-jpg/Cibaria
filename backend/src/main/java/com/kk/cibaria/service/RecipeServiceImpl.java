package com.kk.cibaria.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

}
