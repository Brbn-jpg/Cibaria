package com.kk.cibaria.recipe;


import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.kk.cibaria.image.Image;
import com.kk.cibaria.ingredient.Ingredient;
import com.kk.cibaria.rating.Rating;
import com.kk.cibaria.step.Step;
import com.kk.cibaria.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Recipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "recipe_name")
  private String recipeName;

  @Column(name = "difficulty")
  private int difficulty;

  @Column(name = "ingredients")
  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
  @JsonManagedReference("ingredient")
  private List<Ingredient> ingredients;

  @Column(name = "prepare_time")
  private int prepareTime; // in minutes

  @Column(name = "servings")
  private int servings;

  @Column(name = "category")
  private String category;


  @Column(name = "rating")
  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
  @JsonManagedReference("rating")
  private List<Rating> ratings = new ArrayList<>();

  @ManyToMany(mappedBy = "favouriteRecipes")
  @JsonIgnore
  private List<UserEntity> favouriteByUsers = new ArrayList<>()  ;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Image> images = new ArrayList<>();

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Step> steps;
}
