package com.kk.cibaria.ingredient;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.kk.cibaria.recipe.Recipe;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Ingredient")
@Data
@NoArgsConstructor
public class Ingredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String ingredientName;
  private int quantity;
  private String unit;

  @ManyToOne
  @JoinColumn(name = "recipe_id")
  @JsonBackReference("ingredient")
  private Recipe recipe;
}
