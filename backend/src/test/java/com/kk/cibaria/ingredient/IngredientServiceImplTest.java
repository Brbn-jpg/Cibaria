package com.kk.cibaria.ingredient;

import com.kk.cibaria.recipe.Recipe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class IngredientServiceImplTest {

    @InjectMocks
    private IngredientServiceImpl ingredientService;

    private List<Ingredient> testIngredients;
    private Recipe testRecipe;

    @BeforeEach
    void setUp() {
        testRecipe = new Recipe();
        testRecipe.setId(1);

        Ingredient ingredient1 = new Ingredient();
        ingredient1.setId(1);
        ingredient1.setIngredientName("Mąka");
        ingredient1.setQuantity(500.0f);
        ingredient1.setUnit("g");
        ingredient1.setIsOptional(false);
        ingredient1.setLanguage("pl");
        ingredient1.setRecipe(testRecipe);

        Ingredient ingredient2 = new Ingredient();
        ingredient2.setId(2);
        ingredient2.setIngredientName("Flour");
        ingredient2.setQuantity(500.0f);
        ingredient2.setUnit("g");
        ingredient2.setIsOptional(false);
        ingredient2.setLanguage("en");
        ingredient2.setRecipe(testRecipe);

        Ingredient ingredient3 = new Ingredient();
        ingredient3.setId(3);
        ingredient3.setIngredientName("Cukier");
        ingredient3.setQuantity(200.0f);
        ingredient3.setUnit("g");
        ingredient3.setIsOptional(true);
        ingredient3.setLanguage("pl");
        ingredient3.setRecipe(testRecipe);

        Ingredient ingredient4 = new Ingredient();
        ingredient4.setId(4);
        ingredient4.setIngredientName("Sugar");
        ingredient4.setQuantity(200.0f);
        ingredient4.setUnit("g");
        ingredient4.setIsOptional(true);
        ingredient4.setLanguage("en");
        ingredient4.setRecipe(testRecipe);

        testIngredients = Arrays.asList(ingredient1, ingredient2, ingredient3, ingredient4);
    }

    @Test
    void filterByLanguage_ShouldReturnPolishIngredients_WhenLanguageIsPolish() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, "pl");

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(ingredient -> "pl".equals(ingredient.getLanguage())));
        assertEquals("Mąka", result.get(0).getIngredientName());
        assertEquals("Cukier", result.get(1).getIngredientName());
    }

    @Test
    void filterByLanguage_ShouldReturnEnglishIngredients_WhenLanguageIsEnglish() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, "en");

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(ingredient -> "en".equals(ingredient.getLanguage())));
        assertEquals("Flour", result.get(0).getIngredientName());
        assertEquals("Sugar", result.get(1).getIngredientName());
    }

    @Test
    void filterByLanguage_ShouldReturnEmptyList_WhenNoIngredientsMatchLanguage() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, "fr");

        assertTrue(result.isEmpty());
    }

    @Test
    void filterByLanguage_ShouldReturnEmptyList_WhenInputListIsEmpty() {
        List<Ingredient> emptyList = Arrays.asList();
        List<Ingredient> result = ingredientService.filterByLanguage(emptyList, "pl");

        assertTrue(result.isEmpty());
    }

    @Test
    void filterByLanguage_ShouldBeCaseInsensitive() {
        List<Ingredient> result1 = ingredientService.filterByLanguage(testIngredients, "PL");
        List<Ingredient> result2 = ingredientService.filterByLanguage(testIngredients, "Pl");
        List<Ingredient> result3 = ingredientService.filterByLanguage(testIngredients, "pL");

        assertEquals(2, result1.size());
        assertEquals(2, result2.size());
        assertEquals(2, result3.size());
        
        assertTrue(result1.stream().allMatch(ingredient -> "pl".equals(ingredient.getLanguage())));
        assertTrue(result2.stream().allMatch(ingredient -> "pl".equals(ingredient.getLanguage())));
        assertTrue(result3.stream().allMatch(ingredient -> "pl".equals(ingredient.getLanguage())));
    }

    @Test
    void filterByLanguage_ShouldDefaultToEnglish_WhenLanguageIsNull() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, null);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(ingredient -> "en".equals(ingredient.getLanguage())));
        assertEquals("Flour", result.get(0).getIngredientName());
        assertEquals("Sugar", result.get(1).getIngredientName());
    }

    @Test
    void filterByLanguage_ShouldHandleIngredientsWithNullLanguage() {
        Ingredient ingredientWithNullLanguage = new Ingredient();
        ingredientWithNullLanguage.setId(5);
        ingredientWithNullLanguage.setIngredientName("No Language");
        ingredientWithNullLanguage.setLanguage(null);

        List<Ingredient> ingredientsWithNull = Arrays.asList(
                testIngredients.get(0), // polish ingredient
                ingredientWithNullLanguage
        );

        List<Ingredient> result = ingredientService.filterByLanguage(ingredientsWithNull, "pl");

        assertEquals(1, result.size());
        assertEquals("pl", result.get(0).getLanguage());
    }

    @Test
    void filterByLanguage_ShouldPreserveIngredientProperties() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, "pl");

        Ingredient firstResult = result.get(0);
        assertEquals(1, firstResult.getId());
        assertEquals("Mąka", firstResult.getIngredientName());
        assertEquals(500.0f, firstResult.getQuantity());
        assertEquals("g", firstResult.getUnit());
        assertFalse(firstResult.getIsOptional());
        assertEquals("pl", firstResult.getLanguage());
        assertNotNull(firstResult.getRecipe());
        assertEquals(1, firstResult.getRecipe().getId());
    }

    @Test
    void filterByLanguage_ShouldReturnNewList() {
        List<Ingredient> result = ingredientService.filterByLanguage(testIngredients, "pl");

        assertNotSame(testIngredients, result);
        assertEquals(2, result.size());
        assertEquals(4, testIngredients.size()); // original list unchanged
    }
}