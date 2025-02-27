package com.kk.cibaria.recipe;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.FavouriteRequest;
import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import com.kk.cibaria.image.Image;
import com.kk.cibaria.image.ImageService;
import com.kk.cibaria.user.UserEntity;
import jakarta.validation.constraints.Min;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

  private final RecipeService recipeService;
  private final ImageService imageService;

  public RecipeController(RecipeService recipeService, ImageService imageService) {
    this.recipeService = recipeService;
      this.imageService = imageService;
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

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Recipe save(@RequestPart("recipe") RecipeAddDto recipe,
                     @RequestPart(value = "images",required = false) List<MultipartFile> images) throws IOException {
    if(images!=null){
     return recipeService.saveRecipeWithPhotos(recipe,images);
    }else{
      return recipeService.saveRecipeWithoutPhoto(recipe);
    }
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
  public void addRecipeToFavourites(@RequestHeader("Authorization") String token,
                                          @RequestBody FavouriteRequest request){
    recipeService.addRecipeToFavourites(token,request.getRecipeId());
  }

  @PostMapping("/favourites/delete")
  public void deleteRecipeFromFavourites(@RequestHeader("Authorization") String token,
                                          @RequestBody FavouriteRequest request){
    recipeService.deleteRiceFromFavourites(token,request.getRecipeId());
  }
}
