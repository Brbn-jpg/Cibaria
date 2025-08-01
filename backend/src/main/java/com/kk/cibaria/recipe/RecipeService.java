package com.kk.cibaria.recipe;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import org.springframework.web.multipart.MultipartFile;

public interface RecipeService {
  List<Recipe> getAll();

  Recipe getById(int id);

  Recipe saveRecipeWithoutPhoto(RecipeAddDto recipe, String token) throws IOException;

  Recipe saveRecipeWithPhotos(RecipeAddDto recipe, List<MultipartFile> images, String token);

  Recipe update(int id, Recipe recipe);

  RecipeRequestDto getRecipeByPage(int page, int size, List<String> category, Integer difficulty, String servings,
                                   String prepareTime, Boolean isPublic);

  void addRecipeToFavourites(String token, int recipeId);

  void deleteRiceFromFavourites(String token, int recipeId);

  void delete(int id);

  List<Recipe> searchRecipes(String query);

  boolean isRecipeFavourite(String token, int recipeId);
}
