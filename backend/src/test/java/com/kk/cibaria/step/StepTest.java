package com.kk.cibaria.step;

import com.kk.cibaria.recipe.Recipe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class StepTest {

    private Step step;
    private Recipe testRecipe;

    @BeforeEach
    void setUp() {
        testRecipe = new Recipe();
        testRecipe.setId(1);
        testRecipe.setRecipeName("Test Recipe");
        testRecipe.setIngredients(new ArrayList<>());
        testRecipe.setSteps(new ArrayList<>());
        testRecipe.setRatings(new ArrayList<>());
        testRecipe.setImages(new ArrayList<>());
        testRecipe.setFavouriteByUsers(new ArrayList<>());

        step = new Step();
    }

    @Test
    void testStepCreation() {
        assertNotNull(step);
        assertNull(step.getId());
        assertNull(step.getContent());
        assertNull(step.getRecipe());
    }

    @Test
    void testStepConstructorWithParameters() {
        Step step = new Step("Mix the ingredients", testRecipe);

        assertEquals("Mix the ingredients", step.getContent());
        assertEquals(testRecipe, step.getRecipe());
        assertNull(step.getId()); // ID should be null before persisting
    }

    @Test
    void testStepSettersAndGetters() {
        step.setId(1L);
        step.setContent("Bake for 30 minutes");
        step.setRecipe(testRecipe);

        assertEquals(1L, step.getId());
        assertEquals("Bake for 30 minutes", step.getContent());
        assertEquals(testRecipe, step.getRecipe());
    }

    @Test
    void testStepWithNullContent() {
        step.setContent(null);
        step.setRecipe(testRecipe);

        assertNull(step.getContent());
        assertEquals(testRecipe, step.getRecipe());
    }

    @Test
    void testStepWithEmptyContent() {
        step.setContent("");
        step.setRecipe(testRecipe);

        assertEquals("", step.getContent());
        assertEquals(testRecipe, step.getRecipe());
    }

    @Test
    void testStepWithLongContent() {
        String longContent = "This is a very long step description that contains detailed instructions " +
                "on how to prepare this particular part of the recipe. It includes multiple sentences " +
                "and provides comprehensive guidance for the cooking process.";
        
        step.setContent(longContent);
        step.setRecipe(testRecipe);

        assertEquals(longContent, step.getContent());
        assertEquals(testRecipe, step.getRecipe());
    }

    @Test
    void testStepWithNullRecipe() {
        step.setContent("Some cooking step");
        step.setRecipe(null);

        assertEquals("Some cooking step", step.getContent());
        assertNull(step.getRecipe());
    }

    @Test
    void testEqualsAndHashCode() {
        Step step1 = new Step();
        step1.setId(1L);
        step1.setContent("Mix ingredients");
        step1.setRecipe(testRecipe);

        Step step2 = new Step();
        step2.setId(1L);
        step2.setContent("Mix ingredients");
        step2.setRecipe(testRecipe);

        Step step3 = new Step();
        step3.setId(2L);
        step3.setContent("Bake mixture");
        step3.setRecipe(testRecipe);

        assertEquals(step1, step2);
        assertNotEquals(step1, step3);
        assertEquals(step1.hashCode(), step2.hashCode());
    }

    @Test
    void testToString() {
        step.setId(1L);
        step.setContent("Preheat oven to 180°C");
        step.setRecipe(testRecipe);

        String toString = step.toString();
        
        assertNotNull(toString);
        assertTrue(toString.contains("Preheat oven to 180°C"));
    }

    @Test
    void testStepRecipeRelationship() {
        step.setContent("Add salt to taste");
        step.setRecipe(testRecipe);

        // Test bidirectional relationship
        assertEquals(testRecipe, step.getRecipe());
        assertEquals("Test Recipe", step.getRecipe().getRecipeName());
        assertEquals(1, step.getRecipe().getId());
    }

    @Test
    void testStepContentSpecialCharacters() {
        String contentWithSpecialChars = "Add 2½ cups flour & mix @ 180°C for 30 min.";
        
        step.setContent(contentWithSpecialChars);
        step.setRecipe(testRecipe);

        assertEquals(contentWithSpecialChars, step.getContent());
    }

    @Test
    void testStepContentWithNewlines() {
        String contentWithNewlines = "Step 1:\nPreheat oven\n\nStep 2:\nMix ingredients";
        
        step.setContent(contentWithNewlines);
        step.setRecipe(testRecipe);

        assertEquals(contentWithNewlines, step.getContent());
        assertTrue(step.getContent().contains("\n"));
    }

    @Test
    void testStepIdTypeAndRange() {
        step.setId(Long.MAX_VALUE);
        assertEquals(Long.MAX_VALUE, step.getId());

        step.setId(0L);
        assertEquals(0L, step.getId());

        step.setId(-1L);
        assertEquals(-1L, step.getId());
    }
}