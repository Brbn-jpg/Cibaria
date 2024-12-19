package com.kk.cibaria.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kk.cibaria.model.Recipe;
import com.kk.cibaria.service.RecipeService;

@RestController
@RequestMapping("/api")
public class RecipeController {

  private RecipeService recipeService;

  public RecipeController(RecipeService recipeService) {
    this.recipeService = recipeService;
  }

  @GetMapping("/recipes")
  public List<Recipe> getAll() {
    return recipeService.getAll();
  }

  @GetMapping("/recipe/{id}")
  public Recipe getById(@PathVariable int id) {
    return recipeService.getById(id);
  }

}
