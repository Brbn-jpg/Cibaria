package com.kk.cibaria.recipe;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.FavouriteRequest;
import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import com.kk.cibaria.user.UserEntity;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

  private final RecipeService recipeService;

  public RecipeController(RecipeService recipeService) {
    this.recipeService = recipeService;
  }

  @GetMapping
  public RecipeRequestDto getRecipesByPage(
          @RequestParam(defaultValue = "1", required = false) @Min(1) int page,
          @RequestParam(defaultValue = "10", required = false) @Min(1) int size,
          @RequestParam(required = false) List<String> category,
          @RequestParam(required = false) Integer difficulty,
          @RequestParam(required = false) String servings,
          @RequestParam(required = false) String prepareTime
  )
  {

    return recipeService.getRecipeByPage(page,size,category,difficulty,servings,prepareTime);
  }

  @GetMapping("/{id}")
  public Recipe getById(@PathVariable int id) {
    return recipeService.getById(id);
  }

  @PostMapping
  public Recipe save(@RequestBody RecipeAddDto recipe) throws IOException {
    return recipeService.save(recipe);
  }

  @PutMapping("/{id}")
  public Recipe update(@PathVariable int id, @RequestBody Recipe recipe) {
    return recipeService.update(id, recipe);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable int id) {
    recipeService.delete(id);
  }


  @PostMapping("/favourites/add")
  public UserEntity addRecipeToFavourites(@RequestHeader("Authorization") String token,
                                          @RequestBody FavouriteRequest request){
    return recipeService.addRecipeToFavourites(token,request.getRecipeId());
  }

  @PostMapping("/favourites/delete")
  public UserEntity deleteRecipeFromFavourites(@RequestHeader("Authorization") String token,
                                          @RequestBody FavouriteRequest request){
    return recipeService.deleteRiceFromFavourites(token,request.getRecipeId());
  }
}
