package com.kk.cibaria.recipe;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kk.cibaria.dto.FavouriteRequest;
import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import com.kk.cibaria.dto.myProfile.MyProfileRecipeDto;
import com.kk.cibaria.image.ImageService;
import com.kk.cibaria.user.UserEntity;

import jakarta.validation.constraints.Min;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
          @RequestParam(required = false) String prepareTime,
          @RequestParam(defaultValue = "true") Boolean isPublic
  )
  {
    return recipeService.getRecipeByPage(page,size,category,difficulty,servings,prepareTime, isPublic);
  }

  @GetMapping("/{id}")
  public Recipe getById(@PathVariable int id) {
    return recipeService.getById(id);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Recipe save(@RequestParam("recipe") String json,
                     @RequestHeader("Authorization") String token,                   
                     @RequestParam(value = "images",required = false) List<MultipartFile> images) throws IOException {

    System.out.println("=== KONTROLER ===");
    System.out.println("JSON: " + json);
    System.out.println("Images count: " + (images != null ? images.size() : 0));
    
    ObjectMapper objectMapper = new ObjectMapper();
    RecipeAddDto recipe = objectMapper.readValue(json,RecipeAddDto.class);
    if(images!=null){
     return recipeService.saveRecipeWithPhotos(recipe,images, token);
    }else{
      return recipeService.saveRecipeWithoutPhoto(recipe, token);
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

  @GetMapping("/favourites/isFavourite")
  public boolean isRecipeFavourite(@RequestHeader("Authorization") String token,
                                   @RequestParam int recipeId) {
    return recipeService.isRecipeFavourite(token, recipeId);
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

  @GetMapping("/searchRecipes")
  public List<Recipe> searchRecipes(@RequestParam String query){
    return recipeService.searchRecipes(query);
  }
}
