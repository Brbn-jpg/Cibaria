package com.kk.cibaria.dto;

import com.kk.cibaria.ingredient.Ingredient;
import com.kk.cibaria.step.Step;
import lombok.Data;

import java.util.List;

@Data
public class RecipeAddDto {
    private String recipeName;
    private int difficulty;
    private List<Ingredient> ingredients;
    private int prepareTime;
    private int servings;
    private String category;
    private List<Step> steps;
}
