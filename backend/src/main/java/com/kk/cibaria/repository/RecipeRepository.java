package com.kk.cibaria.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kk.cibaria.model.Recipe;


public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
    Page<Recipe> findAll(Pageable pageable);
}
