package com.kk.cibaria.helper;

import com.kk.cibaria.model.Recipe;

import java.util.List;

public class RecipeFilter {

    public List<Recipe> filterByParams(List<String> category, Integer difficulty,
                                       Integer servings, Integer prepareTime,
                                       List<Recipe> recipes)
    {
        List<Recipe> filteredRecipes = recipes;
        if (category != null) {
            filteredRecipes = filteredRecipes.stream()
                    .filter(recipe -> category.stream().anyMatch(c -> c.equals(recipe.getCategory())))
                    .toList();
        }

        if(difficulty != null)
        {
            filteredRecipes = filteredRecipes.stream()
                    .filter(recipe -> recipe.getDifficulty()==difficulty).toList();
        }

        if(servings!=null)
        {
            filteredRecipes = filteredRecipes.stream()
                    .filter(recipe -> recipe.getServings()==servings).toList();
        }

        if(prepareTime!=null)
        {
            filteredRecipes = filteredRecipes.stream()
                    .filter(recipe -> recipe.getPrepareTime()==prepareTime).toList();
        }

        return filteredRecipes;


    }
}
