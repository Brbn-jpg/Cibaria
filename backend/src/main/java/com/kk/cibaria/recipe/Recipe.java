package com.kk.cibaria.recipe;


import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.kk.cibaria.ingredient.Ingredient;
import com.kk.cibaria.rating.Rating;
import com.kk.cibaria.tag.Tag;
import com.kk.cibaria.user.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Recipe")
@Data
@NoArgsConstructor
public class Recipe {
  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "recipe_name")
  private String recipeName;

  @Column(name = "created_at")
  private Date createdAt;

  @Column(name = "difficulty")
  private int difficulty;

  @Column(name = "ingredients")
  @OneToMany(mappedBy = "recipe")
  @JsonManagedReference
  private List<Ingredient> ingredients;

  @Column(name = "prepare_time")
  private int prepareTime; // in minutes

  @Column(name = "servings")
  private int servings;

  @Column(name = "category")
  private String category;

  @Column(name = "tag")
  @OneToMany(mappedBy = "recipe")
  @JsonManagedReference
  private List<Tag> tag;

  @Column(name = "rating")
  @OneToMany(mappedBy = "recipe")
  @JsonManagedReference()
  private List<Rating> ratings;

  @ManyToMany(mappedBy = "favouriteRecipes")
  List<UserEntity> favouriteByUsers;
}
