package com.kk.cibaria.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.kk.cibaria.user.UserEntity;
import com.kk.cibaria.user.UserService;
import com.kk.cibaria.dto.admin.AdminStatsDto;
import com.kk.cibaria.dto.admin.UpdateUserDto;
import com.kk.cibaria.recipe.Recipe;
import com.kk.cibaria.recipe.RecipeService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final RecipeService recipeService;

    public AdminController(UserService userService, RecipeService recipeService) {
        this.userService = userService;
        this.recipeService = recipeService;
    }

    // User management endpoints
    @GetMapping("/users")
    public List<UserEntity> getAllUsers() {
        return userService.getAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    public UserEntity updateUserRole(@PathVariable int id, @RequestBody UpdateUserDto userDto) {
        return userService.updateUser(id, userDto.getRole(), userDto.getEmail(), userDto.getUsername());
    }

    // Recipe management endpoints
    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeService.getAll();
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable int id, @RequestHeader("Authorization") String token) {
        recipeService.delete(token, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/recipes/{id}")
    public Recipe updateRecipe(@PathVariable int id, @RequestBody Recipe recipe, @RequestHeader("Authorization") String token) {
        return recipeService.updateRecipeWithoutPhotos(id, recipe, token, true);
    }

    // Statistics endpoints
    @GetMapping("/stats")
    public AdminStatsDto getStats() {
        List<UserEntity> users = userService.getAll();
        List<Recipe> recipes = recipeService.getAll();
        
        long totalUsers = users.size();
        long adminCount = users.stream()
            .filter(user -> user.getRole().contains("ADMIN"))
            .count();
        long regularUsers = totalUsers - adminCount;
        
        long totalRecipes = recipes.size();
        long publicRecipes = recipes.stream()
            .filter(Recipe::getIsPublic)
            .count();
        long privateRecipes = totalRecipes - publicRecipes;
        
        return new AdminStatsDto(totalUsers, adminCount, regularUsers, totalRecipes, publicRecipes, privateRecipes);
    }
}