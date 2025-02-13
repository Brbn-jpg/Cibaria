package com.kk.cibaria.helper;

import com.kk.cibaria.ingredient.Ingredient;
import com.kk.cibaria.ingredient.IngredientRepository;
import com.kk.cibaria.rating.Rating;
import com.kk.cibaria.rating.RatingRepository;
import com.kk.cibaria.recipe.*;
import com.kk.cibaria.tag.Tag;
import com.kk.cibaria.tag.TagRepository;
import com.kk.cibaria.user.UserEntity;
import com.kk.cibaria.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TagRepository tagRepository;
    private final IngredientRepository ingredientRepository;
    private final RatingRepository ratingRepository;

    public DataInitializer(RecipeRepository recipeRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, TagRepository tagRepository, IngredientRepository ingredientRepository, RatingRepository ratingRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tagRepository = tagRepository;
        this.ingredientRepository = ingredientRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if(recipeRepository.findAll().isEmpty() && userRepository.findAll().isEmpty()){
            Recipe recipe = new Recipe();
            recipe.setRecipeName("Omlet z warzywami");
            recipe.setCreatedAt(new Date());
            recipe.setDifficulty(2);
            recipe.setPrepareTime(15);
            recipe.setServings(2);
            recipe.setCategory("Breakfast");

            recipeRepository.save(recipe);

            UserEntity user = new UserEntity();
            user.setUsername("TestUser");
            user.setEmail("test@test.com");
            user.setPassword(passwordEncoder.encode("test"));
            user.setRole("USER");
            user.setFavouriteRecipes(Arrays.asList(recipe));
            userRepository.save(user);

            Ingredient ingredient1 = new Ingredient();
            ingredient1.setIngredientName("eggs");
            ingredient1.setQuantity(3);
            ingredient1.setUnit("unit");
            ingredient1.setRecipe(recipe);

            Ingredient ingredient2 = new Ingredient();
            ingredient2.setIngredientName("Pepper");
            ingredient2.setQuantity(1);
            ingredient2.setUnit("unit");
            ingredient2.setRecipe(recipe);

            ingredientRepository.saveAll(List.of(ingredient1,ingredient2));

            Rating rating = new Rating();
            rating.setUser(user);
            rating.setRecipe(recipe);
            rating.setValue(5);

            ratingRepository.save(rating);

            Tag tag = new Tag();
            tag.setTagName("Vege");
            tag.setRecipe(recipe);

            tagRepository.save(tag);


            System.out.println("Dummy data were created!");
        }


    }
}
