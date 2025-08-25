package com.kk.cibaria.ingredient;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class IngredientServiceImpl implements IngredientService{

    @Override
    public List<Ingredient> filterByLanguage(List<Ingredient> ingredients, String language) {
        return ingredients.stream()
                .filter(ingredient -> language.equalsIgnoreCase(ingredient.getLanguage()))
                .collect(Collectors.toList());
    }
}
