package com.kk.cibaria.dto;

import com.kk.cibaria.Recipe.Ingredient;
import com.kk.cibaria.Recipe.Tag;
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
    private List<Tag> tag;
    private String file;
}
