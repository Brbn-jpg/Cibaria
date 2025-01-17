package com.kk.cibaria.helper;

import com.kk.cibaria.model.Recipe;

import java.util.List;

public class RecipeFilter {

    public List<Recipe> filterByParams(List<String> category, Integer difficulty,
                                       Integer servings, String prepareTime,
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

            int from = Integer.parseInt(prepareTime.split("-")[0]);
            int to = Integer.parseInt(prepareTime.split("-")[1]);

            filteredRecipes = filteredRecipes.stream()
                    .filter(recipe -> recipe.getPrepareTime()>=from && recipe.getPrepareTime()<=to).toList();
        }

        return filteredRecipes;


    }
}
