package com.kk.cibaria.controller;

import java.io.IOException;
import java.sql.Date;
import java.time.Instant;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.kk.cibaria.model.Recipe;
import com.kk.cibaria.service.RecipeService;

@RestController
public class RecipeController {

  private final RecipeService recipeService;

  public RecipeController(RecipeService recipeService) {
    this.recipeService = recipeService;
  }

//  @GetMapping("/recipes")
//  public List<Recipe> getAll() {
//    return recipeService.getAll();
//  }

  @GetMapping("/recipes")
  public RecipeRequestDto getRecipesByPage(
          @RequestParam(defaultValue = "1", required = false) @Min(1) int page,
          @RequestParam(defaultValue = "10", required = false) @Min(1) int size,
          @RequestParam(required = false) List<String> category,
          @RequestParam(required = false) Integer difficulty,
          @RequestParam(required = false) Integer servings,
          @RequestParam(required = false) String prepareTime
  )
  {

    return recipeService.getRecipeByPage(page,size,category,difficulty,servings,prepareTime);
  }

  @GetMapping("/recipes/{id}")
  public Recipe getById(@PathVariable int id) {
    return recipeService.getById(id);
  }

  @PostMapping(value = "/recipes", consumes = { "application/json" })
  public Recipe save(@RequestBody RecipeAddDto recipe) throws IOException {
    return recipeService.save(recipe);
  }

  @PutMapping(value = "/recipes/{id}", consumes = { "application/json" })
  public Recipe update(@PathVariable int id, @RequestBody Recipe recipe) {
    return recipeService.update(id, recipe);
  }

  @DeleteMapping("/recipes/{id}")
  public void delete(@PathVariable int id) {
    recipeService.delete(id);
  }
}
