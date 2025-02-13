package com.kk.cibaria.Recipe;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import com.kk.cibaria.dto.RecipeAddDto;
import com.kk.cibaria.dto.RecipeRequestDto;
import com.kk.cibaria.helper.Pagination;
import com.kk.cibaria.helper.RecipeFilter;
import com.kk.cibaria.user.UserEntity;
import org.springframework.stereotype.Service;

import com.kk.cibaria.exception.RecipeNotFoundException;
import com.kk.cibaria.user.UserRepository;

@Service
public class RecipeServiceImpl implements RecipeService {

  private final RecipeRepository recipeRepository;
  private final UserRepository userRepository;

  public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository) {
    this.recipeRepository = recipeRepository;
    this.userRepository = userRepository;

  }

  @Override
  public List<Recipe> getAll() {
    return recipeRepository.findAll();
  }

  @Override
  public Recipe getById(int id) {
    return recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));
  }

  @Override
  public Recipe save(RecipeAddDto recipe) throws IOException {
    Recipe newRecipe = new Recipe();
    newRecipe.setRecipeName(recipe.getRecipeName());
    newRecipe.setCreatedAt(new Date());
    newRecipe.setDifficulty(recipe.getDifficulty());
    List<Ingredient> newIngredients = recipe.getIngredients().stream().map(i -> {
      Ingredient ingredient = new Ingredient();
      ingredient.setRecipe(newRecipe);
      ingredient.setIngredientName(i.getIngredientName());
      ingredient.setUnit(i.getUnit());
      ingredient.setQuantity(i.getQuantity());
      return ingredient;
    }).toList();
    newRecipe.setIngredients(newIngredients);



    newRecipe.setPrepareTime(recipe.getPrepareTime());
    newRecipe.setServings(recipe.getServings());
    newRecipe.setCategory(recipe.getCategory());
    List<Tag> newTags = recipe.getTag().stream().map(t->{
      Tag tag = new Tag();
      tag.setRecipe(newRecipe);
      tag.setTagName(t .getTagName());
      return tag;
    }).toList();

    newRecipe.setTag(newTags);


    return recipeRepository.save(newRecipe);
  }

  @Override
  public Recipe update(int id, Recipe recipe) {
    Recipe recipeFound = recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));
    recipeFound.setId(id);
    recipeFound.setRecipeName(recipe.getRecipeName());
    recipeFound.setCreatedAt(recipe.getCreatedAt());
    recipeFound.setDifficulty(recipe.getDifficulty());

    recipeFound.getIngredients().clear();
    for (Ingredient ingredient : recipe.getIngredients()) {
      ingredient.setRecipe(recipeFound);
      recipeFound.getIngredients().add(ingredient);
    }

    recipeFound.setPrepareTime(recipe.getPrepareTime());
    recipeFound.setServings(recipe.getServings());
    recipeFound.setCategory(recipe.getCategory());

    recipeFound.getTag().clear();
    for (Tag tag : recipe.getTag()) {
      tag.setRecipe(recipeFound);
      recipeFound.getTag().add(tag);
    }
    recipeFound.getRatings().clear();
    for (Rating rating : recipe.getRatings()) {
      UserEntity user = userRepository.findById(rating.getUser().getId()).orElse(null);
      rating.setRecipe(recipeFound);
      rating.setUser(user);
      recipeFound.getRatings().add(rating);
    }

    return recipeRepository.save(recipeFound);
  }

  @Override
  public RecipeRequestDto getRecipeByPage(int page, int size, List<String> category,
                                          Integer difficulty, String servings, String prepareTime) {
    Pagination pagination = new Pagination();
    RecipeFilter filter = new RecipeFilter();
    List<Recipe> recipes = recipeRepository.findAll();
    List<Recipe> filteredRecipes = filter.filterByParams(category,difficulty,servings,prepareTime,recipes);
    List<Recipe> paginatedRecipes = pagination.paginate(page,size,filteredRecipes);
    RecipeRequestDto recipeRequestDto = new RecipeRequestDto();
    recipeRequestDto.setContent(paginatedRecipes);
    recipeRequestDto.setTotalPages(pagination.getTotalPages(size,filteredRecipes));
    return recipeRequestDto;
  }

  @Override
  public void delete(int id) {
    Recipe recipe = recipeRepository.findById(id).orElseThrow(
        () -> new RecipeNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    if (recipe == null) {
      return;
    }

    recipeRepository.delete(recipe);
  }

}
