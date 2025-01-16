package com.kk.cibaria.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.kk.cibaria.model.Recipe;


public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
}
